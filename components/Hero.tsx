"use client";

import { motion } from "framer-motion";
import { productData } from "@/lib/data";
import { useStoreContent } from "@/components/StoreProvider";
import { Star, Truck, ShieldCheck, ShoppingCart, Flame, Users } from "lucide-react";
import { useEffect, useState } from "react";

export default function Hero() {
  const content = useStoreContent();
  const [viewers, setViewers] = useState(14);
  const [timeLeft, setTimeLeft] = useState(5400); // starts at 1h 30m
  const [stock, setStock] = useState(38);
  const [sales, setSales] = useState(115);

  useEffect(() => {
    // Simulate real-time active viewers gracefully
    const interval = setInterval(() => {
      setViewers(prev => Math.max(8, Math.min(26, prev + (Math.floor(Math.random() * 3) - 1))));
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Create realistic stock and sales values tied to the current day
    const date = new Date();
    const seed = date.getDate() + date.getMonth() * 31;
    
    setStock(22 + (seed % 29));  // Between 22 and 50
    setSales(60 + (seed % 141)); // Between 60 and 200
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
  };

  return (
    <section className="relative pt-12 pb-16 md:pt-24 md:pb-28 overflow-hidden bg-slate-50">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center gap-12 relative z-10">
        
        {/* Image Column */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full md:w-1/2 relative"
        >
          <div className="relative aspect-square md:aspect-[4/5] rounded-[32px] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] bg-white border border-slate-100 group">
            <img 
              src={content.heroImage} 
              alt="Produit de la boutique" 
              className="object-cover w-full h-full transform transition-transform duration-700 group-hover:scale-105 opacity-95"
            />
            {/* Live Viewed Badge */}
            <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md text-slate-900 text-xs font-black px-4 py-2.5 rounded-xl shadow-lg border border-slate-200 flex items-center gap-2">
               <span className="relative flex h-3 w-3">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
               </span>
               {viewers} personnes regardent ça
            </div>
          </div>
        </motion.div>

        {/* Content Column */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full md:w-1/2 flex flex-col items-start"
        >
          <div className="flex items-center gap-2 mb-4 bg-white py-1.5 px-3.5 rounded-full shadow-sm border border-slate-200">
            <div className="flex text-[#FFB800] drop-shadow-sm">
              {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
            </div>
            <span className="text-sm text-slate-900 font-bold tracking-tight">{productData.rating}/5 <span className="text-slate-500 font-medium tracking-normal">({productData.reviewsCount} avis vérifiés)</span></span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-slate-900 leading-[1.05] mb-5 font-display tracking-tight">
            {content.heroHeadline}
          </h1>
          
          <p className="text-lg text-slate-600 mb-8 font-medium max-w-lg leading-relaxed">
            {content.heroSubheadline}
          </p>
          
          {/* Add-on: High-Converting Urgency & Deal Box  */}
          <div className="flex flex-col w-full sm:max-w-md bg-white border border-red-100 rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(239,68,68,0.05)] mb-8">
            <div className="bg-red-50 px-4 py-3 border-b border-red-100 flex items-center justify-between">
              <span className="flex items-center gap-2 text-red-600 font-black text-[11px] sm:text-xs uppercase tracking-wider">
                <Flame size={16} className="animate-pulse shrink-0" /> Offre spéciale expire dans
              </span>
              <span className="text-red-700 font-black font-mono bg-white px-2.5 py-1 rounded-lg border border-red-200 shadow-sm">{formatTime(timeLeft)}</span>
            </div>
            <div className="p-4 sm:p-5">
              <div className="flex items-end gap-3 mb-2">
                <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tighter leading-none">{productData.basePrice} <span className="text-2xl">MAD</span></span>
                <span className="text-xl text-slate-400 line-through decoration-slate-300 font-black mb-1">{productData.originalPrice} MAD</span>
              </div>
              {/* Authentic Progress Bar for Stock Scarcity */}
              <div className="w-full bg-slate-100 rounded-full h-2.5 mt-5 overflow-hidden border border-slate-200 flex">
                <div className="bg-red-500 h-2.5 rounded-full transition-all duration-1000" style={{ width: `${(stock / 60) * 100}%` }}></div>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-3 gap-2 sm:gap-0">
                <p className="text-[10.5px] font-black text-red-600 uppercase tracking-widest">Plus que {stock} packs en stock</p>
                <p className="text-[10.5px] font-black text-green-600 uppercase tracking-widest flex items-center gap-1.5"><Users size={12} strokeWidth={3}/> {sales} VENDUS AUJOURD'HUI</p>
              </div>
            </div>
          </div>

          <button 
            onClick={() => document.getElementById("checkout-section")?.scrollIntoView({ behavior: "smooth", block: "start" })}
            className="w-full sm:max-w-md bg-slate-900 text-white text-lg font-black py-4 sm:py-5 px-6 sm:px-10 rounded-2xl border-b-[6px] border-black hover:bg-slate-800 hover:border-b-0 hover:translate-y-[6px] active:border-b-0 active:translate-y-[6px] transition-all flex items-center justify-center gap-3 shadow-xl group"
          >
            <ShoppingCart size={24} className="group-hover:scale-110 transition-transform" />
            Commander Maintenant
          </button>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 text-[11px] sm:text-xs text-slate-700 font-black w-full sm:max-w-md uppercase tracking-wider">
             <div className="flex items-center gap-3 bg-white py-3 px-4 rounded-xl shadow-sm border border-slate-200 flex-1">
               <ShieldCheck className="text-green-500 shrink-0" size={24}/> 
               <span>Paiement à la livraison</span>
             </div>
             <div className="flex items-center gap-3 bg-white py-3 px-4 rounded-xl shadow-sm border border-slate-200 flex-1">
               <Truck className="text-primary-500 shrink-0" size={24}/> 
               <span>Livraison<br/> 24-48h</span>
             </div>
          </div>

        </motion.div>
      </div>
    </section>
  );
}
