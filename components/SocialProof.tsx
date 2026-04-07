"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "Youssef B.",
    location: "Casablanca",
    text: "Le pack est excellent. J'utilise le Nokia comme téléphone principal pour mon travail, la batterie dure une éternité. Les écouteurs sont l'ajout parfait.",
    rating: 5,
    date: "Il y a 2 jours"
  },
  {
    id: 2,
    name: "Amina H.",
    location: "Rabat",
    text: "Livraison super rapide et gratuite ! J'étais sceptique mais la qualité est au rendez-vous. Le son des écouteurs M10 est étonnamment clair et puissant.",
    rating: 5,
    date: "Il y a 4 jours"
  },
  {
    id: 3,
    name: "Karim T.",
    location: "Marrakech",
    text: "Prix incroyable pour un téléphone aussi résistant et les écouteurs inclus. Le format est très pratique. Je recommande vraiment ce pack à tous.",
    rating: 5,
    date: "Il y a une semaine"
  }
];

export default function SocialProof() {
  return (
    <section className="py-24 md:py-32 bg-slate-50 relative overflow-hidden" id="avis">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-white rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 font-display mb-6 tracking-tight">
            Ils l'ont essayé et <span className="text-primary-500">approuvé.</span>
          </h2>
          <p className="text-xl text-slate-500 font-bold max-w-2xl mx-auto">
            Rejoignez des milliers de clients satisfaits partout au Maroc.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, idx) => (
            <motion.div 
              key={review.id}
              initial={{ opacity: 0, y: 50, filter: "blur(10px)", scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
              transition={{ duration: 0.8, delay: idx * 0.2, ease: "easeOut" }}
              viewport={{ once: true, margin: "-100px" }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="bg-white p-8 md:p-10 rounded-[32px] shadow-xl border-[3px] border-slate-100 hover:border-primary-500 hover:shadow-2xl transition-all relative flex flex-col group cursor-pointer"
            >
              <div className="flex gap-1 text-primary-500 mb-6 drop-shadow-sm">
                {[...Array(review.rating)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
              </div>
              
              <p className="text-slate-700 font-bold text-lg leading-relaxed mb-8 flex-1">
                "{review.text}"
              </p>
              
              <div className="flex items-center justify-between border-t-2 border-slate-100 pt-6 mt-auto">
                <div>
                  <h4 className="font-black text-slate-900 text-xl">{review.name}</h4>
                  <p className="text-sm text-slate-400 font-black tracking-wide">{review.location}</p>
                </div>
                <div className="text-[10px] font-black text-green-700 uppercase tracking-widest bg-green-50 px-3 py-1.5 rounded-lg border-2 border-green-200">
                  Vérifié
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
