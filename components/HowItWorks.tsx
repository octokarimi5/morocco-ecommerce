"use client";

import { motion, Variants } from "framer-motion";
import { ShoppingCart } from "lucide-react";

import { useStoreContent } from "@/components/StoreProvider";
// Premium Lueur-style entry variants
const revealVariants: Variants = {
  hidden: { opacity: 0, y: 50, filter: "blur(10px)", scale: 1.05 },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: "blur(0px)", 
    scale: 1,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

export default function HowItWorks() {
  const content = useStoreContent();
  return (
    <section className="bg-white relative overflow-hidden" id="details">
      
      {/* Animated Separator Marquee */}
      <div className="w-full bg-primary-50 py-5 md:py-8 border-b-2 border-primary-100 overflow-hidden flex items-center shadow-inner relative">
        <motion.div 
          animate={{ x: [0, -2000] }} 
          transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
          className="flex whitespace-nowrap gap-8 md:gap-16 min-w-[200vw] text-primary-500 font-display font-black text-4xl md:text-6xl opacity-80"
        >
          {[...Array(10)].map((_, i) => (
            <span key={i} className="flex items-center gap-8 md:gap-16">
              <span>QUALITÉ PREMIUM</span>
              <span className="text-primary-300">•</span>
              <span>DESIGN RÉSISTANT</span>
              <span className="text-primary-300">•</span>
              <span>AUTONOMIE RECORD</span>
              <span className="text-primary-300">•</span>
            </span>
          ))}
        </motion.div>
      </div>

      <div className="py-24 md:py-32 max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        
        <div className="text-center flex flex-col items-center mb-24">
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 font-display mb-6 tracking-tight">
            {content.howItWorksTitle}
          </h2>
          <p className="text-xl text-slate-500 font-bold max-w-2xl mx-auto leading-relaxed mb-10">
            {content.howItWorksSubtitle}
          </p>

          <motion.div
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
          >
             <button 
                onClick={() => document.getElementById("checkout-section")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                className="bg-slate-900 text-white font-black text-lg md:text-xl py-4 md:py-5 px-8 md:px-12 rounded-[24px] shadow-[0_20px_50px_rgba(15,23,42,0.3)] border-b-[6px] border-black hover:border-b-0 hover:translate-y-[6px] active:border-b-0 active:translate-y-[6px] transition-all flex items-center gap-4 group"
             >
                <div className="bg-primary-500 text-slate-900 p-2 rounded-full group-hover:scale-110 transition-transform">
                   <ShoppingCart size={20} strokeWidth={3} />
                </div>
                Réserver Mon Pack
             </button>
          </motion.div>
        </div>

        <div className="space-y-32">
          {content.steps.map((step, index) => {
            const isEven = index % 2 !== 0;
            return (
              <div 
                key={step.id} 
                className={`flex flex-col md:flex-row items-center gap-12 lg:gap-24 ${isEven ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Image Side - Lueur scale and blur reveal */}
                <motion.div 
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-150px" }}
                  variants={revealVariants}
                  className="w-full md:w-1/2 relative group"
                >
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="relative aspect-square md:aspect-[4/3] rounded-[40px] shadow-2xl overflow-hidden border border-slate-100 bg-slate-50"
                  >
                    <img 
                      src={step.image} 
                      alt={step.title} 
                      className="w-full h-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
                    />
                  </motion.div>
                </motion.div>

                {/* Content Side */}
                <motion.div 
                  initial={{ opacity: 0, x: isEven ? -40 : 40, filter: "blur(8px)" }}
                  whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                  viewport={{ once: true, margin: "-150px" }}
                  className="w-full md:w-1/2 flex flex-col items-start"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <span className="w-12 h-12 rounded-full bg-slate-900 text-white font-black text-xl flex items-center justify-center shadow-lg border-2 border-white">
                      {step.id}
                    </span>
                    <span className="text-xs font-black uppercase tracking-widest text-slate-900 bg-primary-100 px-4 py-2 rounded-full border-2 border-primary-500">
                      {step.badge}
                    </span>
                  </div>
                  
                  <h3 className="text-3xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1]">
                    {step.title}
                  </h3>
                  
                  <p className="text-lg lg:text-xl text-slate-500 font-bold leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
