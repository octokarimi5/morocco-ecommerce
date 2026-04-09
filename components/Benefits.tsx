"use client";

import { motion } from "framer-motion";
import { useStoreContent } from "@/components/StoreProvider";
import { Battery, Smartphone, Headphones, Shield } from "lucide-react";

const getIcon = (iconName: string) => {
  switch (iconName) {
    case "Battery": return <Battery className="w-8 h-8 flex-shrink-0" />;
    case "Smartphone": return <Smartphone className="w-8 h-8 flex-shrink-0" />;
    case "Headphones": return <Headphones className="w-8 h-8 flex-shrink-0" />;
    case "Shield": return <Shield className="w-8 h-8 flex-shrink-0" />;
    default: return <Smartphone className="w-8 h-8 flex-shrink-0" />;
  }
};

export default function Benefits() {
  const content = useStoreContent();
  return (
    <section className="py-24 md:py-32 bg-slate-900 relative text-white border-t-8 border-b-8 border-black shadow-[inset_0_20px_60px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        <div className="text-center max-w-4xl mx-auto mb-20 lg:mb-28">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black font-display mb-6 tracking-tight leading-[1.1]">
            {content.benefitsTitle}
          </h2>
          <p className="text-xl lg:text-2xl text-slate-400 font-bold">
            {content.benefitsSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {content.features.map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 50, filter: "blur(12px)", scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
              transition={{ duration: 0.7, delay: idx * 0.15, ease: "easeOut" }}
              viewport={{ once: true, margin: "-100px" }}
              whileHover={{ scale: 1.05 }}
              className="bg-slate-800/50 backdrop-blur-md rounded-[32px] p-8 lg:p-10 border-[3px] border-slate-700 hover:border-primary-500 hover:bg-slate-800 transition-all flex flex-col items-center text-center group cursor-pointer shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-bl-full blur-2xl pointer-events-none transition-opacity opacity-0 group-hover:opacity-100" />
              
              <div className="w-20 h-20 rounded-[20px] bg-slate-900 shadow-inner flex items-center justify-center mb-8 border-[3px] border-slate-700 text-slate-400 group-hover:bg-primary-500 group-hover:text-slate-900 group-hover:border-primary-500 transition-colors z-10">
                {getIcon(feature.icon)}
              </div>
              
              <h3 className="text-2xl font-black text-white mb-4 tracking-tight z-10">{feature.title}</h3>
              <p className="text-slate-400 font-bold leading-relaxed z-10">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
