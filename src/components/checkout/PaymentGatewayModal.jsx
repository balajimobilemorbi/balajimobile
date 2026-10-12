import React, { useState, useEffect } from 'react';
import { 
  Lock, Zap, ShieldCheck, AlertTriangle, X, CheckCircle2, 
  RotateCw, ArrowRight, RefreshCw, CreditCard, ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { razorpayService, RAZORPAY_KEY_ID, PAYMENT_MODE } from '../../services/razorpayService';

export default function PaymentGatewayModal({ orderDetails, onSuccess, onCancel }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [isSdkLoaded, setIsSdkLoaded] = useState(false);
  const [razorpayOrder, setRazorpayOrder] = useState(null);
  const [mode] = useState(() => (PAYMENT_MODE === 'live' ? 'live' : 'test'));

  const isDemoOrPlaceholder = razorpayService.isTestMode();

  useEffect(() => {
    let isMounted = true;

    // Load official Razorpay SDK & initialize order
    const initGateway = async () => {
      setIsProcessing(true);
      setError('');

      // 1. Create Order through Backend / Serverless
      const orderRes = await razorpayService.createOrder({
        amount: orderDetails.totalAmount,
        currency: 'INR',
        notes: {
          customerName: orderDetails.customerName,
          phone: orderDetails.phone,
          email: orderDetails.email
        }
      });

      if (isMounted) {
        if (orderRes.success && orderRes.order) {
          setRazorpayOrder(orderRes.order);
        } else {
          setError('Could not initialize Razorpay order. Please try again.');
        }
      }

      // 2. Load SDK script
      const loaded = await razorpayService.loadScript();
      if (isMounted) {
        setIsSdkLoaded(loaded);
        setIsProcessing(false);

        // If not placeholder and real SDK is present, trigger official popup automatically
        if (loaded && !isDemoOrPlaceholder && window.Razorpay && orderRes.order?.id) {
          triggerOfficialRazorpay(orderRes.order.id);
        }
      }
    };

    initGateway();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      isMounted = false;
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prev;
    };
  }, [orderDetails, onCancel]);

  /**
   * Triggers the official Razorpay Checkout SDK popup
   */
  const triggerOfficialRazorpay = (orderId) => {
    try {
      if (!window.Razorpay) {
        setError('Razorpay SDK failed to load. Please check your internet connection.');
        return;
      }

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: Math.round(orderDetails.totalAmount * 100),
        currency: 'INR',
        name: 'Balaji Mobile',
        description: 'Smartphone Acquisition',
        order_id: orderId,
        theme: {
          color: '#D4AF37'
        },
        prefill: {
          name: orderDetails.customerName || '',
          email: orderDetails.email || '',
          contact: orderDetails.phone || ''
        },
        handler: async (response) => {
          setIsProcessing(true);
          setError('');

          // Verify signature on backend
          const verification = await razorpayService.verifyPaymentSignature({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          });

          setIsProcessing(false);

          if (verification.verified) {
            try { confetti({ particleCount: 140, spread: 80 }); } catch (_) {}
            onSuccess({
              method: 'Razorpay',
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
              status: 'Paid'
            });
          } else {
            setError(verification.message || 'Payment signature verification failed. Please contact support.');
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            setError('Payment process was cancelled.');
          }
        }
      };

      const rzpInstance = new window.Razorpay(options);
      rzpInstance.on('payment.failed', (resp) => {
        setIsProcessing(false);
        setError(resp.error?.description || 'Payment transaction failed. Please retry.');
      });
      rzpInstance.open();
    } catch (err) {
      setIsProcessing(false);
      setError('An error occurred opening Razorpay: ' + err.message);
    }
  };

  /**
   * Handles Demo / Test Mode Simulated Successful Payment
   */
  const handleSimulateTestSuccess = async () => {
    setIsProcessing(true);
    setError('');

    const testOrderId = razorpayOrder?.id || `order_test_${Date.now()}`;
    const testPaymentId = `pay_test_${Math.floor(10000000 + Math.random() * 90000000)}`;
    const testSignature = `sig_test_${Date.now()}`;

    // Verify signature on backend
    const verification = await razorpayService.verifyPaymentSignature({
      razorpay_order_id: testOrderId,
      razorpay_payment_id: testPaymentId,
      razorpay_signature: testSignature
    });

    setTimeout(() => {
      setIsProcessing(false);
      if (verification.verified) {
        try { confetti({ particleCount: 140, spread: 80 }); } catch (_) {}
        onSuccess({
          method: 'Razorpay',
          paymentId: testPaymentId,
          orderId: testOrderId,
          signature: testSignature,
          status: 'Paid'
        });
      } else {
        setError('Test verification failed.');
      }
    }, 900);
  };

  /**
   * Handles Demo / Test Mode Simulated Failure
   */
  const handleSimulateTestFailure = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setError('Simulated payment failed (e.g. insufficient funds or bank decline). You can retry or choose another option.');
    }, 600);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto font-sans bm-modal-overlay animate-in fade-in duration-200"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.88)', backdropFilter: 'blur(16px)' }}
    >
      <div 
        className="bg-[#0D1117] border-2 border-[#D4AF37]/50 text-[#F8F8F8] rounded-[28px] max-w-lg w-full shadow-[0_30px_80px_rgba(0,0,0,0.95)] relative my-auto overflow-hidden max-h-[92vh] flex flex-col bm-modal-card"
        style={{ backgroundColor: '#0D1117' }}
      >
        {/* Header */}
        <div className="bg-white/[0.03] p-5 border-b border-white/[0.08] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/[0.05] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-[#F8F8F8] text-base flex items-center gap-2">
                <span>Razorpay Secure Checkout</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#E7C76A] border border-[#D4AF37]/40 uppercase font-bold">
                  {mode.toUpperCase()} MODE
                </span>
              </h3>
              <p className="text-[11px] text-[#B8BDC8] font-mono">Official Payment Gateway Integration</p>
            </div>
          </div>
          <button 
            onClick={onCancel} 
            className="p-2 rounded-full hover:bg-white/[0.05] text-[#B8BDC8] hover:text-[#F8F8F8] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Valuation Ribbon */}
        <div className="px-5 py-3.5 bg-[#050505] border-b border-white/[0.08] flex justify-between items-center text-xs font-mono shrink-0">
          <span className="text-[#B8BDC8]">Payable Amount (INR):</span>
          <span className="font-display font-black text-[#0FAE72] text-xl">
            ₹{orderDetails.totalAmount.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto font-mono text-xs">
          
          {/* Demo Mode Notice Box */}
          <div className="p-4 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/40 text-[#E7C76A] space-y-2">
            <div className="flex items-center gap-2 font-bold text-[12px]">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>Razorpay is currently in demo/test mode.</span>
            </div>
            <p className="text-[11px] text-[#B8BDC8] leading-relaxed">
              No real money will be charged. This environment is prepared to accept official Razorpay test credentials and verify payment webhooks/signatures without exposing secret keys.
            </p>
          </div>

          {/* Customer Summary */}
          <div className="p-4 rounded-2xl bg-[#050505] border border-white/[0.08] space-y-2 text-[#B8BDC8]">
            <div className="flex justify-between">
              <span>Customer:</span>
              <strong className="text-[#F8F8F8]">{orderDetails.customerName || 'Valued Client'}</strong>
            </div>
            <div className="flex justify-between">
              <span>Phone:</span>
              <strong className="text-[#F8F8F8]">+91 {orderDetails.phone}</strong>
            </div>
            <div className="flex justify-between">
              <span>Email:</span>
              <strong className="text-[#F8F8F8]">{orderDetails.email}</strong>
            </div>
            <div className="flex justify-between">
              <span>Razorpay Order ID:</span>
              <strong className="text-[#D4AF37] font-mono">{razorpayOrder?.id || 'Creating order...'}</strong>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 flex items-start gap-2.5 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3 pt-2">
            
            {/* If SDK loaded & real test keys present, option to open standard popup */}
            {isSdkLoaded && !isDemoOrPlaceholder && (
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => triggerOfficialRazorpay(razorpayOrder?.id)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#E7C76A] text-[#050505] font-bold font-sans text-sm shadow-[0_4px_20px_rgba(212,175,55,0.35)] hover:opacity-95 transition flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Connecting to Razorpay...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Open Razorpay Checkout Popup</span>
                  </>
                )}
              </button>
            )}

            {/* Test Simulation Buttons for Demo Mode */}
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleSimulateTestSuccess}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#0FAE72] to-[#0B8F5C] hover:from-[#D4AF37] hover:to-[#E7C76A] hover:text-[#050505] text-white font-bold font-sans text-sm shadow-[0_4px_20px_rgba(15,174,114,0.35)] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Test Signature on Server...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simulate Successful Test Payment</span>
                </>
              )}
            </button>

            <button
              type="button"
              disabled={isProcessing}
              onClick={handleSimulateTestFailure}
              className="w-full py-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:border-rose-500/50 text-rose-300 hover:text-rose-200 transition text-[11px] flex items-center justify-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Simulate Payment Failure (Test Error Handling)</span>
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="w-full py-2.5 rounded-xl bg-transparent text-[#B8BDC8] hover:text-[#F8F8F8] transition text-[11px] text-center"
            >
              Cancel / Return to Checkout
            </button>

          </div>

        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-[#050505] border-t border-white/[0.08] text-[10px] font-mono text-[#B8BDC8] text-center">
          🔒 256-Bit SSL Encrypted • Razorpay Certified Payment Architecture
        </div>
      </div>
    </div>
  );
}
