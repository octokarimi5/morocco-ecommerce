"use client";

import { motion } from "framer-motion";
import { productData } from "@/lib/data";
import { Check } from "lucide-react";

interface OfferSectionProps {
  selectedOffer: string;
  setSelectedOffer: (id: string) => void;
}

export default function OfferSection({ selectedOffer, setSelectedOffer }: OfferSectionProps) {
  return (
    <section className="py-24 bg-slate-50 relative" id="offres">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full bg-primary-500/5 blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 font-display mb-6 tracking-tight">
            Choisissez votre <span className="text-primary-500">pack</span>
          </h2>
          <p className="text-xl text-slate-600 font-medium">
            Plus vous en prenez, plus vous économisez. Livraison toujours gratuite.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
          {productData.offers.map((offer, idx) => {
            const isSelected = selectedOffer === offer.id;
            return (
              <motion.div 
                key={offer.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, ease: "easeOut" }}
                onClick={() => {
                  setSelectedOffer(offer.id);
                  document.getElementById("checkout-section")?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`relative flex-1 rounded-[32px] border-2 p-8 cursor-pointer transition-all duration-300 flex flex-col hover:-translate-y-2 group bg-white ${
                  isSelected 
                    ? "border-primary-500 shadow-[0_20px_50px_rgba(236,176,97,0.2)] md:scale-105 z-10" 
                    : "border-slate-200 hover:border-slate-300 shadow-xl"
                }`}
              >
                {offer.isBestValue && (
                  <div className="absolute -top-5 left-0 right-0 flex justify-center">
                    <span className="bg-slate-900 text-white text-xs font-black uppercase tracking-widest py-2 px-6 rounded-full shadow-lg border-2 border-slate-700">
                      Meilleure Vente
                    </span>
                  </div>
                )}

                <div className="mb-6 mt-2">
                  <h3 className="text-2xl font-black text-slate-900 text-center tracking-tight">{offer.title}</h3>
                  <p className="text-sm text-slate-500 font-bold text-center mt-2">{offer.subtitle}</p>
                </div>

                <div className="flex justify-center items-end gap-1 mb-8">
                  <span className="text-5xl font-black text-slate-900 tracking-tighter">{offer.price}</span>
                  <span className="text-lg text-slate-500 font-bold mb-1">MAD</span>
                </div>

                {offer.badge && (
                  <div className={`text-sm font-black text-center py-2.5 rounded-xl mb-8 uppercase tracking-wide border-2 ${
                    isSelected ? "bg-primary-50 text-primary-600 border-primary-200" : "bg-slate-50 text-slate-600 border-slate-200"
                  }`}>
                    {offer.badge}
                  </div>
                )}

                <ul className="flex-1 space-y-4 mb-10">
                  <li className="flex items-start gap-3">
                    <Check className={`w-5 h-5 shrink-0 mt-0.5 ${isSelected ? 'text-primary-500' : 'text-slate-400'}`} />
                    <span className="text-slate-700 font-bold">{offer.count}x Nokia 105 Original</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className={`w-5 h-5 shrink-0 mt-0.5 ${isSelected ? 'text-primary-500' : 'text-slate-400'}`} />
                    <span className="text-slate-700 font-bold">{offer.count}x Écouteurs Bluetooth M10</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className={`w-5 h-5 shrink-0 mt-0.5 ${isSelected ? 'text-primary-500' : 'text-slate-400'}`} />
                    <span className="text-slate-700 font-medium">Cadeau(x) Inclus</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className={`w-5 h-5 shrink-0 mt-0.5 ${isSelected ? 'text-primary-500' : 'text-slate-400'}`} />
                    <span className="text-slate-700 font-medium">Livraison Express Gratuite</span>
                  </li>
                </ul>

                <button 
                  className={`w-full py-4 rounded-2xl font-black text-lg transition-all border-b-4 hover:border-b-0 hover:translate-y-1 active:border-b-0 active:translate-y-1 gap-2 flex items-center justify-center shadow-lg ${
                    isSelected 
                      ? "bg-slate-900 text-white border-black" 
                      : "bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200 group-hover:bg-primary-500 group-hover:text-slate-900 group-hover:border-primary-700"
                  }`}
                >
                  {isSelected ? "Sélectionné" : "Choisir ce pack"}
                </button>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
