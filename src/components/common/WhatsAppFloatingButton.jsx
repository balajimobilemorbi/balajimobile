import React from 'react';
import { MessageSquare, PhoneCall } from 'lucide-react';
import { storeCMS } from '../../services/storeCMS';

export default function WhatsAppFloatingButton() {
  const settings = storeCMS.getSettings();
  const ownerPhone = (settings.supportPhone || '7990648756').replace(/[^0-9]/g, '');
  const fullOwnerPhone = ownerPhone.startsWith('91') ? ownerPhone : `91${ownerPhone}`;
  
  const whatsappUrl = `https://wa.me/${fullOwnerPhone}?text=${encodeURIComponent('Hello Balaji Mobile! I want to inquire about smartphones and deals.')}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 left-4 lg:bottom-6 lg:left-6 z-40 group flex items-center gap-2.5 px-3.5 py-3.5 sm:px-4 sm:py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-[0_10px_30px_rgba(16,185,129,0.4)] hover:shadow-[0_12px_35px_rgba(16,185,129,0.5)] hover:scale-110 active:scale-95 transition-all duration-200 border border-white/10 animate-float"
      title="Chat with Us — Balaji Mobile"
    >
      <div className="w-6 h-6 rounded-full bg-white text-emerald-600 flex items-center justify-center font-bold shrink-0">
        <MessageSquare className="w-3.5 h-3.5 fill-emerald-600" />
      </div>
      <span className="font-mono text-sm uppercase tracking-wider font-extrabold hidden sm:inline-block">Chat</span>
    </a>
  );
}
