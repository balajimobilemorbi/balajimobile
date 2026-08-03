import React, { useState } from 'react';
import { Clock, User } from 'lucide-react';
import { storeCMS } from '../services/storeCMS';

export default function BlogsPage() {
  const [blogs] = useState(storeCMS.getBlogs());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 bg-[#050505] min-h-screen">
      
      <div className="pb-6 border-b border-white/[0.08]">
        <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#D4AF37] font-bold">TECH EDITORIAL</span>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-[#F8F8F8] mt-1">Smartphones &amp; Industry Reviews</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {blogs.map(b => (
          <div key={b.id} className="p-7 rounded-[28px] bg-[#0D1117] border border-white/[0.08] space-y-4 group hover:border-[#D4AF37]/50 transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.8)] reflection-sweep">
            <div className="h-60 rounded-2xl overflow-hidden bg-[#050505]">
              <img src={b.image} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-[#B8BDC8]">
              <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-[#0FAE72]" /> {b.author}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#D4AF37]" /> {b.readTime}</span>
            </div>

            <h3 className="font-display font-bold text-xl text-[#F8F8F8] group-hover:text-[#D4AF37] transition-colors">
              {b.title}
            </h3>

            <p className="text-xs text-[#B8BDC8] leading-relaxed font-sans">
              {b.summary}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}
