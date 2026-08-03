import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Lock, QrCode, Truck, ArrowRight
} from 'lucide-react';
import PaymentGatewayModal from '../components/checkout/PaymentGatewayModal';
import OrderSuccessModal from '../components/checkout/OrderSuccessModal';
import { INDIA_STATES_DATA, validateAddressForm } from '../data/indiaLocations';
import { storeCMS } from '../services/storeCMS';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const cart = storeCMS.getCart();

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [stateName, setStateName] = useState('Gujarat');
  const [district, setDistrict] = useState('Morbi');
  const [city, setCity] = useState('Morbi City');
  const [pincode, setPincode] = useState('363641');
  const [isGstBilling, setIsGstBilling] = useState(false);
  const [gstin, setGstin] = useState('');
  const [companyName, setCompanyName] = useState('');

  // Validation Errors state
  const [formErrors, setFormErrors] = useState({});

  const [paymentMethod, setPaymentMethod] = useState('Razorpay UPI');
  const [showGatewayModal, setShowGatewayModal] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + (item.bmPrice * item.quantity), 0);
  const grandTotal = subtotal;

  const availableDistricts = INDIA_STATES_DATA[stateName]
    ? Object.keys(INDIA_STATES_DATA[stateName].districts)
    : [];

  const availableCities = (INDIA_STATES_DATA[stateName] && INDIA_STATES_DATA[stateName].districts[district])
    ? INDIA_STATES_DATA[stateName].districts[district]
    : [];

  useEffect(() => {
    if (availableDistricts.length > 0 && !availableDistricts.includes(district)) {
      setDistrict(availableDistricts[0]);
    }
  }, [stateName]);

  useEffect(() => {
    if (availableCities.length > 0 && !availableCities.includes(city)) {
      setCity(availableCities[0]);
    }
  }, [district]);

  if (cart.length === 0 && !placedOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6 bg-[#050505] min-h-screen">
        <h2 className="text-2xl font-bold font-display text-[#F8F8F8]">Your Shopping Bag is Empty</h2>
        <p className="text-xs text-[#B8BDC8] font-mono">Select a flagship smartphone to proceed with client checkout.</p>
        <Link to="/products" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#0FAE72] to-[#0B8F5C] hover:from-[#D4AF37] hover:to-[#E7C76A] hover:text-[#050505] text-white font-bold text-sm transition-all duration-500">
          Browse Flagships <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const formPayload = {
      customerName, email, phone, address, state: stateName, district, city, pincode
    };

    const validation = validateAddressForm(formPayload);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }
    setFormErrors({});

    if (paymentMethod === 'Cash on Delivery') {
      const newOrder = storeCMS.placeOrder({
        customerName,
        email,
        phone,
        address,
        state: stateName,
        district,
        city,
        pincode,
        items: cart,
        totalAmount: grandTotal,
        paymentMethod: 'Cash on Delivery',
        isGstBilling,
        gstin,
        companyName
      });

      try {
        const waLinks = storeCMS.getWhatsAppLinks(newOrder);
        window.open(waLinks.ownerWhatsAppUrl, '_blank');
      } catch (e) {}

      storeCMS.clearCart();
      setPlacedOrder(newOrder);
      setShowSuccessModal(true);
    } else {
      setShowGatewayModal(true);
    }
  };

  const handlePaymentSuccess = (paymentDetails) => {
    setShowGatewayModal(false);

    const payStatusLabel = paymentDetails.pendingVerification
      ? `${paymentDetails.method} — ⚠️ Pending Owner Verification`
      : paymentDetails.method === 'Cash on Delivery' ? 'COD — Pending' : `${paymentDetails.method} — Paid`;

    const newOrder = storeCMS.placeOrder({
      customerName,
      email,
      phone,
      address,
      state: stateName,
      district,
      city,
      pincode,
      items: cart,
      totalAmount: grandTotal,
      paymentMethod: paymentDetails.method || paymentMethod,
      paymentId: paymentDetails.paymentId,
      paymentStatus: payStatusLabel,
      isGstBilling,
      gstin,
      companyName
    });

    try {
      const waLinks = storeCMS.getWhatsAppLinks(newOrder);
      window.open(waLinks.ownerWhatsAppUrl, '_blank');
    } catch (e) {}

    storeCMS.clearCart();
    setPlacedOrder(newOrder);
    setShowSuccessModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 bg-[#050505] min-h-screen">
      
      <div className="pb-6 border-b border-white/[0.08]">
        <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#D4AF37] font-bold">CLIENT CHECKOUT DESK</span>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-[#F8F8F8] mt-1">Shipping &amp; Payment Details</h1>
        <p className="text-xs text-[#B8BDC8] font-mono mt-0.5">Enter delivery address in Morbi, Gujarat or anywhere in India.</p>
      </div>

      <form onSubmit={handleFormSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Shipping Address */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="p-7 rounded-[28px] bg-[#0D1117] border border-white/[0.08] space-y-5 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
            <h3 className="font-display font-bold text-[#F8F8F8] text-lg flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#0FAE72]" />
              <span>1. Client Shipping Location</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <label className="block text-[#B8BDC8] mb-1 font-bold">Client Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rudra Sharma"
                  value={customerName}
                  onChange={(e) => { setCustomerName(e.target.value); setFormErrors(prev => ({ ...prev, customerName: null })); }}
                  className="w-full px-4 py-3 rounded-2xl bg-[#050505] border border-white/[0.08] text-[#F8F8F8] focus:border-[#D4AF37] outline-none font-sans"
                />
                {formErrors.customerName && <p className="text-[11px] text-rose-400 font-mono mt-1 font-bold">{formErrors.customerName}</p>}
              </div>

              <div>
                <label className="block text-[#B8BDC8] mb-1 font-bold">Mobile Number (10 Digits) *</label>
                <input
                  type="tel"
                  required
                  maxLength="10"
                  placeholder="7990648756"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setFormErrors(prev => ({ ...prev, phone: null })); }}
                  className="w-full px-4 py-3 rounded-2xl bg-[#050505] border border-white/[0.08] text-[#F8F8F8] focus:border-[#D4AF37] outline-none font-mono"
                />
                {formErrors.phone && <p className="text-[11px] text-rose-400 font-mono mt-1 font-bold">{formErrors.phone}</p>}
              </div>
            </div>

            <div className="text-xs font-mono">
              <label className="block text-[#B8BDC8] mb-1 font-bold">Email Address (For Invoice &amp; Tracking) *</label>
              <input
                type="email"
                required
                placeholder="client@gmail.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setFormErrors(prev => ({ ...prev, email: null })); }}
                className="w-full px-4 py-3 rounded-2xl bg-[#050505] border border-white/[0.08] text-[#F8F8F8] focus:border-[#D4AF37] outline-none font-sans"
              />
              {formErrors.email && <p className="text-[11px] text-rose-400 font-mono mt-1 font-bold">{formErrors.email}</p>}
            </div>

            {/* Location Selector */}
            <div className="p-5 rounded-2xl bg-[#050505] border border-white/[0.08] space-y-3">
              <span className="text-[11px] font-mono text-[#D4AF37] font-bold uppercase block">
                Indian State, District &amp; Taluka / Village:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div>
                  <label className="block text-[#B8BDC8] mb-1">State *</label>
                  <select
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[#F8F8F8] font-bold focus:border-[#D4AF37] outline-none"
                  >
                    {Object.keys(INDIA_STATES_DATA).map(st => (
                      <option key={st} value={st} className="bg-[#050505]">{st}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#B8BDC8] mb-1">District *</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[#F8F8F8] font-bold focus:border-[#D4AF37] outline-none"
                  >
                    {availableDistricts.map(dst => (
                      <option key={dst} value={dst} className="bg-[#050505]">{dst}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#B8BDC8] mb-1">City / Village *</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[#F8F8F8] font-bold focus:border-[#D4AF37] outline-none"
                  >
                    {availableCities.map(ct => (
                      <option key={ct} value={ct} className="bg-[#050505]">{ct}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="sm:col-span-2">
                <label className="block text-[#B8BDC8] mb-1 font-bold">Building / Street Address *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sanala Road, Near Sky Mall"
                  value={address}
                  onChange={(e) => { setAddress(e.target.value); setFormErrors(prev => ({ ...prev, address: null })); }}
                  className="w-full px-4 py-3 rounded-2xl bg-[#050505] border border-white/[0.08] text-[#F8F8F8] focus:border-[#D4AF37] outline-none font-sans"
                />
                {formErrors.address && <p className="text-[11px] text-rose-400 font-mono mt-1 font-bold">{formErrors.address}</p>}
              </div>

              <div>
                <label className="block text-[#B8BDC8] mb-1 font-bold">PIN Code *</label>
                <input
                  type="text"
                  required
                  maxLength="6"
                  placeholder="363641"
                  value={pincode}
                  onChange={(e) => { setPincode(e.target.value); setFormErrors(prev => ({ ...prev, pincode: null })); }}
                  className="w-full px-3.5 py-3 rounded-2xl bg-[#050505] border border-white/[0.08] text-[#F8F8F8] focus:border-[#D4AF37] outline-none font-mono"
                />
                {formErrors.pincode && <p className="text-[11px] text-rose-400 font-mono mt-1 font-bold">{formErrors.pincode}</p>}
              </div>
            </div>

            {/* GST Option */}
            <div className="pt-3 border-t border-white/[0.08] space-y-3">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-[#F8F8F8]">
                <input
                  type="checkbox"
                  checked={isGstBilling}
                  onChange={(e) => setIsGstBilling(e.target.checked)}
                  className="accent-[#0FAE72] w-4 h-4 rounded"
                />
                <span>I need a GST Tax Invoice for Business Tax Exemption</span>
              </label>

              {isGstBilling && (
                <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-2">
                  <input
                    type="text"
                    placeholder="GSTIN Number"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl bg-[#050505] border border-white/[0.08] text-[#F8F8F8] uppercase"
                  />
                  <input
                    type="text"
                    placeholder="Company Name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl bg-[#050505] border border-white/[0.08] text-[#F8F8F8]"
                  />
                </div>
              )}
            </div>

          </div>

          {/* Payment Method Selector */}
          <div className="p-7 rounded-[28px] bg-[#0D1117] border border-white/[0.08] space-y-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
            <h3 className="font-display font-bold text-[#F8F8F8] text-lg flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#D4AF37]" />
              <span>2. Select Payment Mode</span>
            </h3>

            <div className="space-y-3 font-mono text-xs">
              <label className={`p-4.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all duration-300 ${
                paymentMethod === 'Razorpay UPI' ? 'bg-white/[0.04] border-[#D4AF37] text-[#E7C76A] font-bold' : 'bg-[#050505] border-white/[0.08] text-[#B8BDC8]'
              }`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="Razorpay UPI"
                    checked={paymentMethod === 'Razorpay UPI'}
                    onChange={() => setPaymentMethod('Razorpay UPI')}
                    className="accent-[#D4AF37]"
                  />
                  <div>
                    <span className="text-[#F8F8F8] block">UPI QR / GPay / PhonePe / Paytm</span>
                    <span className="text-[10px] text-[#B8BDC8]">Instant verification with UPI UTR ID</span>
                  </div>
                </div>
                <QrCode className="w-5 h-5 text-[#D4AF37]" />
              </label>

              <label className={`p-4.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all duration-300 ${
                paymentMethod === 'Cash on Delivery' ? 'bg-white/[0.04] border-[#D4AF37] text-[#E7C76A] font-bold' : 'bg-[#050505] border-white/[0.08] text-[#B8BDC8]'
              }`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="Cash on Delivery"
                    checked={paymentMethod === 'Cash on Delivery'}
                    onChange={() => setPaymentMethod('Cash on Delivery')}
                    className="accent-[#D4AF37]"
                  />
                  <div>
                    <span className="text-[#F8F8F8] block">Cash on Delivery (COD)</span>
                    <span className="text-[10px] text-[#B8BDC8]">Pay cash upon delivery at your doorstep</span>
                  </div>
                </div>
                <Truck className="w-5 h-5 text-[#0FAE72]" />
              </label>
            </div>
          </div>

        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-7 rounded-[28px] bg-[#0D1117] border border-white/[0.08] space-y-4 font-mono text-xs shadow-[0_20px_50px_rgba(0,0,0,0.8)] sticky top-24">
            <h3 className="font-display font-bold text-[#F8F8F8] text-sm border-b border-white/[0.08] pb-3">
              Order Valuation ({cart.length} Items)
            </h3>

            <div className="space-y-3 max-h-60 overflow-y-auto">
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-[#B8BDC8]">
                  <div className="truncate max-w-[180px]">
                    <p className="font-bold truncate text-[#F8F8F8]">{item.title}</p>
                    <p className="text-[10px] text-[#B8BDC8]">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-bold text-[#F8F8F8]">₹{(item.bmPrice * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-white/[0.08] flex justify-between text-[#F8F8F8] font-bold text-base font-display">
              <span>Total Amount:</span>
              <span className="text-[#0FAE72]">₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>

            <button
              type="submit"
              className="w-full py-4.5 rounded-2xl bg-gradient-to-r from-[#0FAE72] to-[#0B8F5C] hover:from-[#D4AF37] hover:to-[#E7C76A] hover:text-[#050505] text-white font-bold text-sm shadow-[0_4px_20px_rgba(15,174,114,0.35)] transition-all duration-500 flex items-center justify-center gap-2 font-sans"
            >
              <Lock className="w-4 h-4" />
              <span>Complete Acquisition ₹{grandTotal.toLocaleString('en-IN')}</span>
            </button>
          </div>
        </div>

      </form>

      {showGatewayModal && (
        <PaymentGatewayModal
          orderDetails={{ totalAmount: grandTotal, customerName, email, phone }}
          gatewayType={paymentMethod === 'Stripe' ? 'stripe' : 'razorpay'}
          onSuccess={handlePaymentSuccess}
          onCancel={() => setShowGatewayModal(false)}
        />
      )}

      {showSuccessModal && (
        <OrderSuccessModal
          order={placedOrder}
          onClose={() => setShowSuccessModal(false)}
        />
      )}

    </div>
  );
}
