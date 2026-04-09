"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

import { useStoreContent } from "@/components/StoreProvider";
export default function SocialProof() {
  const content = useStoreContent();
  return (
    <section className="py-24 md:py-32 bg-slate-50 relative overflow-hidden" id="avis">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-white rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 font-display mb-6 tracking-tight">
            {content.socialProofTitle}
          </h2>
          <p className="text-xl text-slate-500 font-bold max-w-2xl mx-auto">
            {content.socialProofSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {content.reviews.map((review, idx) => (
            <motion.div 
              key={review.id}
              initial={{ opacity: 0, y: 50, filter: "blur(10px)", scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
              transition={{ duration: 0.8, delay: idx * 0.2, ease: "easeOut" }}
              viewport={{ once: true, margin: "-100px" }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="bg-white p-8 md:p-10 rounded-[32px] shadow-xl border-[3px] border-slate-100 hover:border-primary-500 hover:shadow-2xl transition-all relative flex flex-col group cursor-pointer"
            >
              <div className="flex gap-1 text-primary-500 mb-4 drop-shadow-sm">
                {[...Array(review.rating)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
              </div>
              
              {review.image && (
                <div className="mb-6 rounded-2xl overflow-hidden border border-slate-100 shadow-sm relative aspect-video">
                  <img src={review.image} alt="Review" className="w-full h-full object-cover" />
                </div>
              )}
              
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
