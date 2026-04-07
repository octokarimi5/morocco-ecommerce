"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Comment puis-je payer ma commande ?",
    a: "Nous n'acceptons que le paiement à la livraison (Cash on Delivery). Vous ne payez rien en ligne, vous réglez le livreur en espèces une fois votre produit reçu."
  },
  {
    q: "Quels sont les délais de livraison ?",
    a: "La livraison prend généralement 24 à 48 heures ouvrables pour les grandes villes (Casablanca, Rabat, Marrakech...) et jusqu'à 72h pour les autres régions."
  },
  {
    q: "Ce téléphone supporte-t-il WhatsApp ?",
    a: "Non, le Nokia 105 est un téléphone basique conçu pour la durabilité et les appels. Les écouteurs Bluetooth en revanche se connectent à n'importe quel smartphone moderne abordant le Bluetooth."
  },
  {
    q: "Puis-je retourner le produit si je ne suis pas satisfait ?",
    a: "Absolument ! Nous offrons une garantie de satisfaction de 30 jours contre les défauts de fabrication avec un remplacement gratuit."
  }
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 font-display mb-4">
            Questions Fréquentes
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <button 
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
              >
                <span className="text-lg font-bold text-gray-900">{faq.q}</span>
                <ChevronDown 
                  className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${openIdx === idx ? "rotate-180" : ""}`} 
                />
              </button>
              
              <AnimatePresence>
                {openIdx === idx && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 pt-0 text-gray-600 leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
