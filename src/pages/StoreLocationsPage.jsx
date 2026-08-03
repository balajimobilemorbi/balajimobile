import React, { useState } from 'react';
import { MapPin, Phone, Clock, Store } from 'lucide-react';
import { storeCMS } from '../services/storeCMS';

export default function StoreLocationsPage() {
  const [locations] = useState(storeCMS.getLocations());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 bg-[#050505] min-h-screen">
      
      <div className="pb-6 border-b border-white/[0.08]">
        <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#D4AF37] font-bold">PHYSICAL FLAGSHIP LOUNGES</span>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-[#F8F8F8] mt-1">Balaji Mobile Showroom Lounges</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {locations.map(loc => (
          <div key={loc.id} className="p-7 rounded-[28px] bg-[#0D1117] border border-white/[0.08] space-y-6 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.8)] reflection-sweep">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-[#D4AF37]/40 text-[#D4AF37]">
                  <Store className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-[#F8F8F8] text-xl">{loc.name}</h3>
                  <span className="text-xs font-mono text-[#0FAE72] font-bold">{loc.city} Flagship Lounge</span>
                </div>
              </div>

              <div className="space-y-2.5 text-xs font-mono text-[#B8BDC8]">
                <p className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span className="text-[#F8F8F8]">{loc.address}</span>
                </p>
                <p className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#0FAE72] shrink-0" />
                  <span>+91 {loc.phone}</span>
                </p>
                <p className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>{loc.timing}</span>
                </p>
              </div>
            </div>

            <div className="h-52 rounded-2xl overflow-hidden border border-white/[0.08] bg-[#050505]">
              <iframe
                title={loc.name}
                src={loc.mapEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
