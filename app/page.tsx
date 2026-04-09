"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Hero from "@/components/Hero";
import Benefits from "@/components/Benefits";
import HowItWorks from "@/components/HowItWorks";
import SocialProof from "@/components/SocialProof";
import FAQ from "@/components/FAQ";
import CheckoutForm from "@/components/CheckoutForm";
import GiftModal from "@/components/GiftModal";
import { productData } from "@/lib/data";
import { useStoreContent } from "@/components/StoreProvider";

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

export default function Home() {
  const [selectedOffer, setSelectedOffer] = useState(productData.offers[1].id);
  const content = useStoreContent();

  return (
    <main className="min-h-screen bg-slate-50 relative flex flex-col pt-10">
      
      {/* Animated Marquee Banner (Shrine Pro Style) */}
      <div className="fixed top-0 left-0 right-0 h-10 bg-primary-500 text-slate-900 font-black text-sm uppercase tracking-widest overflow-hidden whitespace-nowrap flex items-center z-[100] shadow-md border-b-2 border-primary-700">
        <motion.div 
          animate={{ x: [0, -1000] }} 
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="flex whitespace-nowrap gap-10 min-w-[200vw]"
        >
          {[...Array(12)].map((_, i) => (
            <span key={i} className="flex items-center gap-10">
              {content.marqueeText.split("•").map((text, j) => (
                <span key={j} className="flex items-center gap-5">
                  <span className="flex items-center gap-2">{text.trim()}</span>
                  <span>•</span>
                </span>
              ))}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Sticky Header with Logo and WhatsApp */}
      <header className="bg-white border-b border-slate-200 py-3 px-4 sm:px-6 sticky top-10 z-[90] flex justify-between items-center shadow-sm">
        <div className="font-display font-black text-2xl md:text-3xl tracking-tighter text-slate-900 cursor-pointer">
          {content.storeName}
        </div>
        <a 
          href={`https://wa.me/${content.whatsappNumber}?text=Bonjour,%20je%20suis%20intéressé(e)%20par%20l'offre.`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 md:px-5 md:py-2.5 rounded-xl font-black text-sm md:text-base border-b-4 border-[#128C7E] hover:border-b-0 hover:translate-y-1 active:border-b-0 active:translate-y-1 transition-all shadow-md group"
        >
          <WhatsAppIcon />
          <span className="hidden sm:inline">Commander via WhatsApp</span>
          <span className="sm:hidden">WhatsApp</span>
        </a>
      </header>

      <Hero />
      <Benefits />
      <HowItWorks />
      <SocialProof />
      <FAQ />
      
      {/* The Offer Section is now embedded INSIDE the Checkout Form */}
      <CheckoutForm selectedOfferId={selectedOffer} setSelectedOfferId={setSelectedOffer} />
      
      {/* Footer */}
      <footer className="bg-slate-900 border-t-[6px] border-black text-slate-400 py-16 text-center">
        <div className="max-w-6xl mx-auto px-4">
          <p className="font-black text-white text-3xl mb-6 tracking-tight">{content.storeName}</p>
          <div className="flex justify-center gap-6 mb-10 flex-wrap font-bold">
            <a href="#" className="hover:text-white transition">Contact</a>
            <a href="#" className="hover:text-white transition">Conditions d'utilisation</a>
            <a href="#" className="hover:text-white transition">Politique de confidentialité</a>
          </div>
          <p className="text-sm font-medium">© {new Date().getFullYear()} {content.storeName}. Tous droits réservés.</p>
        </div>
      </footer>

      {/* Sticky Bottom CTA for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] z-50 flex items-center justify-between">
         <div className="flex flex-col">
           <span className="text-xs text-slate-500 font-black uppercase tracking-wider">Total</span>
           <span className="font-black text-slate-900 text-2xl tracking-tighter">
             {productData.offers.find(o => o.id === selectedOffer)?.price} <span className="text-sm">MAD</span>
           </span>
         </div>
         <button 
           onClick={() => document.getElementById("checkout-section")?.scrollIntoView({ behavior: "smooth", block: "start" })}
           className="bg-primary-500 text-slate-900 font-black px-6 py-3 rounded-2xl border-b-[5px] border-primary-700 active:border-b-0 active:translate-y-[5px] transition-all shadow-xl flex items-center gap-2"
         >
           Finaliser
         </button>
      </div>

      <GiftModal />
    </main>
  );
}
