import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, X, Send, RotateCw, PackageCheck, Tag, MapPin, 
  ShoppingCart, Eye, Copy, Check, Bot, User, Trash2, 
  Globe, ChevronDown, Compass, ChevronRight, Lock, Share2
} from 'lucide-react';
import { storeCMS } from '../../services/storeCMS';
import { aiChatService } from '../../services/aiChatService';
import { sharePhoneDetails } from '../../utils/shareUtils';
import Product360Viewer from '../product/Product360Viewer';

export default function AIChatDrawer({ isOpen, onClose }) {
  const [selectedLang, setSelectedLang] = useState(() => {
    return localStorage.getItem('bm_chat_lang') || null;
  });

  const [showLangMenu, setShowLangMenu] = useState(false);

  const getWelcomeText = (lang) => {
    if (lang === 'hi') {
      return `नमस्ते! 👋 मैं **BM AI** हूँ — बालजी मोबाइल का इंटेलिजेंट AI असिस्टेंट।\n\nमुझसे किसी भी बजट में फोन (उदा. "20000 से 30000 के फोन"), स्पेसिफिकेशन्स, लाइव ऑर्डर ट्रैकिंग या 360° व्यू के बारे में कुछ भी पूछें!`;
    } else if (lang === 'en') {
      return `Welcome! 👋 I am **BM AI** — your Balaji Mobile Intelligent AI Assistant.\n\nAsk me about phones in any budget (e.g. "20000 to 30000 phones"), specs, 360° views, pre-owned condition, or live order tracking!`;
    } else {
      return `નમસ્તે! 👋 હું **BM AI** છું — બાલજી મોબાઈલનો ઈન્ટેલિજન્ટ AI અસિસ્ટન્ટ.\n\nમને કોઈપણ બજેટના ફોન (જેમ કે "20000 થી 30000 ના ફોન"), સ્પેસિફિકેશન્સ, 360° વ્યુ કે લાઈવ ઓર્ડર ટ્રેકિંગ વિશે કંઈપણ પૂછો!`;
    }
  };

  const [messages, setMessages] = useState([
    {
      id: 'welcome-msg',
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: getWelcomeText(selectedLang || 'en'),
      type: 'text',
      data: null
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState('');
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const getSuggestions = (lang) => {
    if (lang === 'hi') {
      return [
        { label: '📦 ऑर्डर ट्रैकिंग', query: 'where is my order' },
        { label: '🔄 360° व्यू (iPhone 15 Pro)', query: '360 view of iPhone 15 Pro' },
        { label: '📱 ₹70,000 के अंदर फोन', query: 'phones under 70000' },
        { label: '🔥 एक्टिव कूपन', query: 'latest discount coupons' },
        { label: '📍 दुकान का पता', query: 'where is your shop' }
      ];
    } else if (lang === 'en') {
      return [
        { label: '📦 Track My Order', query: 'where is my order' },
        { label: '🔄 360° View iPhone 15 Pro', query: '360 view of iPhone 15 Pro' },
        { label: '📱 Phones under ₹70,000', query: 'phones under 70000' },
        { label: '🔥 Active Coupons', query: 'latest discount coupons' },
        { label: '📍 Store Lounge Location', query: 'where is your shop' }
      ];
    } else {
      return [
        { label: '📦 ઓર્ડર ટ્રેકિંગ', query: 'where is my order' },
        { label: '🔄 360° વ્યુ (iPhone 15 Pro)', query: '360 view of iPhone 15 Pro' },
        { label: '📱 ₹70,000 સુધીના ફોન', query: 'phones under 70000' },
        { label: '🔥 એક્ટિવ કૂપન્સ', query: 'latest discount coupons' },
        { label: '📍 દુકાનનું એડ્રેસ', query: 'where is your shop' }
      ];
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSelectLanguage = (langCode) => {
    setSelectedLang(langCode);
    localStorage.setItem('bm_chat_lang', langCode);
    setShowLangMenu(false);
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: getWelcomeText(langCode),
        type: 'text',
        data: null
      }
    ]);
  };

  const handleSend = async (customQuery) => {
    const textToSend = customQuery || inputQuery;
    if (!textToSend.trim()) return;

    const userMsg = {
      id: `user-msg-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: textToSend,
      type: 'text'
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customQuery) setInputQuery('');
    setIsTyping(true);

    try {
      setTimeout(async () => {
        const aiResponse = await aiChatService.processMessage(textToSend, messages, selectedLang || 'en');
        setMessages(prev => [...prev, aiResponse]);
        setIsTyping(false);
      }, 500);
    } catch (err) {
      console.error('AI chat error:', err);
      setIsTyping(false);
    }
  };

  const handleCopyCoupon = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(''), 2500);
  };

  const handleAddToCart = (product) => {
    const user = storeCMS.getUser();
    if (!user) {
      window.dispatchEvent(new CustomEvent('bm_require_auth', { detail: { product } }));
      return;
    }
    storeCMS.addToCart(product, 1);
    alert(`✅ ${product.title} added to your bag!`);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: getWelcomeText(selectedLang || 'en'),
        type: 'text'
      }
    ]);
  };

  if (!isOpen) return null;

  const currentLangLabel = selectedLang === 'hi' ? '🇮🇳 हिंदी' : selectedLang === 'en' ? '🇬🇧 English' : '🇮🇳 ગુજરાતી';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-[#050505]/85 backdrop-blur-[30px] transition-opacity duration-300">
      <div 
        className="w-full max-w-lg bg-[#0D1117] border-l border-white/[0.08] text-[#F8F8F8] flex flex-col h-full shadow-[0_0_80px_rgba(0,0,0,0.95)] relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Drawer Header */}
        <div className="p-5 bg-white/[0.03] border-b border-white/[0.08] flex items-center justify-between backdrop-blur-xl shrink-0 z-10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#E7C76A] flex items-center justify-center shadow-lg text-[#050505]">
                <Bot className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#0FAE72] border-2 border-[#0D1117] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-[#F8F8F8] text-sm">BM AI</h3>
                <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#E7C76A] font-mono text-[10px] uppercase font-bold">
                  INTELLIGENT
                </span>
              </div>
              <p className="text-xs text-[#B8BDC8] font-mono flex items-center gap-1 mt-0.5">
                <Sparkles className="w-3 h-3 text-[#D4AF37]" /> Balaji Mobile Store AI
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switcher Badge Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/[0.08] hover:border-[#D4AF37]/40 text-[#D4AF37] text-xs font-mono font-bold flex items-center gap-1.5 transition"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{currentLangLabel}</span>
                <ChevronDown className="w-3 h-3 text-[#B8BDC8]" />
              </button>

              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-36 bg-[#050505] border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden py-1 z-50">
                  <button
                    onClick={() => handleSelectLanguage('gu')}
                    className={`w-full px-3 py-2 text-left text-xs font-mono flex items-center justify-between hover:bg-white/[0.05] transition ${selectedLang === 'gu' ? 'text-[#D4AF37] font-bold' : 'text-[#B8BDC8]'}`}
                  >
                    <span>🇮🇳 ગુજરાતી</span>
                    {selectedLang === 'gu' && <Check className="w-3.5 h-3.5 text-[#D4AF37]" />}
                  </button>
                  <button
                    onClick={() => handleSelectLanguage('hi')}
                    className={`w-full px-3 py-2 text-left text-xs font-mono flex items-center justify-between hover:bg-white/[0.05] transition ${selectedLang === 'hi' ? 'text-[#D4AF37] font-bold' : 'text-[#B8BDC8]'}`}
                  >
                    <span>🇮🇳 हिंदी</span>
                    {selectedLang === 'hi' && <Check className="w-3.5 h-3.5 text-[#D4AF37]" />}
                  </button>
                  <button
                    onClick={() => handleSelectLanguage('en')}
                    className={`w-full px-3 py-2 text-left text-xs font-mono flex items-center justify-between hover:bg-white/[0.05] transition ${selectedLang === 'en' ? 'text-[#D4AF37] font-bold' : 'text-[#B8BDC8]'}`}
                  >
                    <span>🇬🇧 English</span>
                    {selectedLang === 'en' && <Check className="w-3.5 h-3.5 text-[#D4AF37]" />}
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={handleClearChat}
              className="p-2 rounded-xl text-[#B8BDC8] hover:text-[#F8F8F8] hover:bg-white/[0.05] transition text-xs"
              title="Clear Chat"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#B8BDC8] hover:text-[#F8F8F8] hover:bg-white/[0.08] transition"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Language Selection Screen */}
        {!selectedLang ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center">
              <Globe className="w-8 h-8 text-[#D4AF37]" />
            </div>

            <div>
              <h3 className="font-display font-bold text-xl text-[#F8F8F8]">
                Select Language / ભાષા પસંદ કરો
              </h3>
              <p className="text-xs text-[#B8BDC8] font-mono mt-1">
                Select your preferred language for concierge advisory:
              </p>
            </div>

            <div className="w-full space-y-3 max-w-xs">
              <button
                onClick={() => handleSelectLanguage('en')}
                className="w-full p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:border-[#D4AF37] text-[#F8F8F8] font-bold font-sans flex items-center justify-between transition group shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">🇬🇧</span>
                  <div className="text-left">
                    <div className="text-sm font-bold text-[#F8F8F8] group-hover:text-[#D4AF37]">English</div>
                    <div className="text-[10px] text-[#B8BDC8] font-mono">Click here</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[#B8BDC8] group-hover:text-[#D4AF37]" />
              </button>

              <button
                onClick={() => handleSelectLanguage('gu')}
                className="w-full p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:border-[#D4AF37] text-[#F8F8F8] font-bold font-sans flex items-center justify-between transition group shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">🇮🇳</span>
                  <div className="text-left">
                    <div className="text-sm font-bold text-[#F8F8F8] group-hover:text-[#D4AF37]">ગુજરાતી (Gujarati)</div>
                    <div className="text-[10px] text-[#B8BDC8] font-mono">અહીં ક્લિક કરો</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[#B8BDC8] group-hover:text-[#D4AF37]" />
              </button>

              <button
                onClick={() => handleSelectLanguage('hi')}
                className="w-full p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:border-[#D4AF37] text-[#F8F8F8] font-bold font-sans flex items-center justify-between transition group shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">🇮🇳</span>
                  <div className="text-left">
                    <div className="text-sm font-bold text-[#F8F8F8] group-hover:text-[#D4AF37]">हिंदी (Hindi)</div>
                    <div className="text-[10px] text-[#B8BDC8] font-mono">यहाँ क्लिक करें</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[#B8BDC8] group-hover:text-[#D4AF37]" />
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Quick Suggestions */}
            <div className="p-3 bg-[#050505]/60 border-b border-white/[0.08] flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
              {getSuggestions(selectedLang).map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(s.query)}
                  className="px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] hover:border-[#D4AF37]/50 text-[#B8BDC8] hover:text-[#D4AF37] text-xs font-mono shrink-0 transition flex items-center gap-1.5"
                >
                  <span>{s.label}</span>
                </button>
              ))}
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-sm">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 text-[11px] text-[#B8BDC8] font-mono">
                    {msg.sender === 'ai' ? (
                      <>
                        <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                        <span>BM Concierge</span>
                      </>
                    ) : (
                      <>
                        <User className="w-3 h-3 text-[#0FAE72]" />
                        <span>Client</span>
                      </>
                    )}
                    <span>• {msg.timestamp}</span>
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[92%] rounded-3xl p-4 shadow-xl text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-[#0FAE72] to-[#0B8F5C] text-white rounded-tr-xs'
                        : 'bg-white/[0.04] border border-white/[0.08] text-[#F8F8F8] rounded-tl-xs'
                    }`}
                  >
                    {msg.text && (
                      <div className="whitespace-pre-wrap font-sans">
                        {msg.text.split('\n').map((line, lIdx) => {
                          const parts = line.split(/(\*\*.*?\*\*)/g);
                          return (
                            <p key={lIdx} className={line.startsWith('•') ? 'pl-2 text-[#B8BDC8]' : ''}>
                              {parts.map((part, pIdx) => {
                                if (part.startsWith('**') && part.endsWith('**')) {
                                  return <strong key={pIdx} className="font-bold text-[#D4AF37]">{part.slice(2, -2)}</strong>;
                                }
                                return part;
                              })}
                            </p>
                          );
                        })}
                      </div>
                    )}

                    {/* Inline Product Render */}
                    {msg.type === 'product_card' && msg.data && (
                      <div className="mt-3 p-3.5 rounded-2xl bg-[#050505] border border-white/[0.08] text-[#F8F8F8] flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                          <img 
                            src={msg.data.images?.[0]} 
                            alt={msg.data.title} 
                            className="w-16 h-16 object-contain rounded-xl bg-white/[0.03] p-1 shrink-0 border border-white/[0.08]" 
                          />
                          <div>
                            <span className="px-2 py-0.5 rounded-md bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#E7C76A] text-[10px] font-mono font-bold">
                              {msg.data.brand}
                            </span>
                            <h4 className="font-display font-bold text-sm text-[#F8F8F8] mt-1 line-clamp-1">
                              {msg.data.title}
                            </h4>
                            <p className="text-xs text-[#B8BDC8] font-mono mt-0.5">
                              {msg.data.ram} • {msg.data.storage}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-white/[0.08]">
                          <span className="font-display font-extrabold text-base text-[#0FAE72]">
                            ₹{msg.data.bmPrice?.toLocaleString('en-IN')}
                          </span>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => sharePhoneDetails(msg.data)}
                              title="Share Phone Details"
                              className="px-2.5 py-1.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-[#D4AF37] text-xs font-mono font-semibold flex items-center gap-1 hover:border-[#D4AF37] transition"
                            >
                              <Share2 className="w-3.5 h-3.5" /> Share
                            </button>
                            <button
                              onClick={() => handleSend(`360 view of ${msg.data.title}`)}
                              className="px-2.5 py-1.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-[#D4AF37] text-xs font-mono font-semibold flex items-center gap-1 transition"
                            >
                              <RotateCw className="w-3.5 h-3.5" /> 360°
                            </button>
                            <button
                              onClick={() => { onClose(); navigate(`/product/${msg.data.id}`); }}
                              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#0FAE72] to-[#0B8F5C] text-white text-xs font-bold font-mono transition flex items-center gap-1"
                            >
                              View <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Inline Multiple Products Render for BM AI Budget Search */}
                    {msg.type === 'product_list' && Array.isArray(msg.data) && (
                      <div className="mt-3 space-y-2">
                        {msg.data.map(p => (
                          <div key={p.id} className="p-3 rounded-2xl bg-[#050505] border border-white/[0.08] text-[#F8F8F8] flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <img src={p.images?.[0]} alt={p.title} className="w-12 h-12 object-contain rounded-xl bg-white/[0.03] p-1 shrink-0 border border-white/[0.08]" />
                              <div className="min-w-0">
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#D4AF37]/15 text-[#E7C76A] border border-[#D4AF37]/30">
                                  {p.brand}
                                </span>
                                <h4 className="font-bold text-xs text-[#F8F8F8] truncate mt-0.5">{p.title}</h4>
                                <p className="text-[10px] text-[#0FAE72] font-mono font-bold">₹{p.bmPrice?.toLocaleString('en-IN')}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => sharePhoneDetails(p)}
                                title="Share Phone"
                                className="p-1.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-[#D4AF37] hover:border-[#D4AF37] transition"
                              >
                                <Share2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => { onClose(); navigate(`/product/${p.id}`); }}
                                className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-[#0FAE72] to-[#0B8F5C] text-white text-xs font-bold font-mono transition flex items-center gap-1"
                              >
                                View <ChevronRight className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}

                        <button
                          onClick={() => {
                            const summary = msg.data.map(p => `• *${p.title}* (${p.ram || ''} ${p.storage || ''}) — ₹${p.bmPrice?.toLocaleString('en-IN')}`).join('\n');
                            const text = `📱 *Budget Smartphone Recommendations by BM AI (Balaji Mobile):*\n\n${summary}\n\n🔗 Browse & Order at Balaji Mobile: ${window.location.origin}/products`;
                            if (navigator.share) {
                              navigator.share({ title: 'Balaji Mobile Budget Phones', text, url: `${window.location.origin}/products` }).catch(() => {});
                            } else {
                              window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                            }
                          }}
                          className="w-full py-2 px-3 mt-2 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#E7C76A] hover:bg-[#D4AF37]/20 text-xs font-mono font-bold transition flex items-center justify-center gap-2"
                        >
                          <Share2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>Share Entire Budget List</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-[#B8BDC8] text-xs font-mono p-3 bg-white/[0.04] rounded-2xl border border-white/[0.08] w-fit">
                  <Sparkles className="w-4 h-4 text-[#D4AF37] animate-spin" />
                  <span>BM AI is thinking...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <div className="p-4 pb-6 lg:pb-4 bg-[#050505] border-t border-white/[0.08] shrink-0">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex items-center gap-2 bg-[#0D1117] border border-white/[0.08] focus-within:border-[#D4AF37]/60 rounded-2xl p-2 transition"
              >
                <input
                  type="text"
                  placeholder="Ask BM AI anything (e.g. 20000 to 30000 phones)..."
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  className="flex-1 bg-transparent px-3 text-[#F8F8F8] placeholder-[#B8BDC8] font-sans text-sm focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!inputQuery.trim()}
                  className="p-3 rounded-xl bg-gradient-to-r from-[#0FAE72] to-[#0B8F5C] hover:from-[#D4AF37] hover:to-[#E7C76A] hover:text-[#050505] text-white disabled:opacity-40 font-bold transition shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export function AIChatFloatingButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-40 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#0FAE72] to-[#0B8F5C] hover:from-[#D4AF37] hover:to-[#E7C76A] hover:text-[#050505] text-white font-bold shadow-[0_10px_30px_rgba(15,174,114,0.45)] hover:shadow-[0_12px_35px_rgba(212,175,55,0.55)] hover:scale-110 active:scale-95 transition-all flex items-center gap-2 border border-white/10 group"
      title="Open BM AI Assistant"
    >
      <div className="relative">
        <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF37] group-hover:text-[#050505] transition-colors" />
      </div>
      <span className="font-mono text-xs sm:text-sm uppercase tracking-wider font-extrabold hidden sm:inline-block">
        BM AI
      </span>
    </button>
  );
}
