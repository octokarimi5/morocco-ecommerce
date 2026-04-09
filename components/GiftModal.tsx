"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, X } from "lucide-react";
import { createLead } from "@/app/actions/leads";

export default function GiftModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Show modal when scrolling down 50%
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      if (scrollPosition > windowHeight * 0.4 && !hasScrolled) {
        setHasScrolled(true);
        // Add a small delay
        setTimeout(() => setIsOpen(true), 1000);
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasScrolled) {
        setHasScrolled(true);
        setIsOpen(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [hasScrolled]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append("source", "gift_popup");

    const result = await createLead(formData);
    
    setLoading(false);
    
    if (result.success) {
       setSubmitted(true);
       setTimeout(() => setIsOpen(false), 4000);
    } else {
       alert(result.message);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl z-10 overflow-hidden text-center border-4 border-white"
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 bg-slate-100 rounded-full p-2 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="mx-auto w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <Gift size={32} />
            </div>

            {submitted ? (
              <div className="py-6">
                <h3 className="text-3xl font-black text-slate-900 mb-2">Cadeau débloqué ! 🎉</h3>
                <p className="text-slate-600 font-medium">Notre équipe vous contactera sous peu. Merci !</p>
              </div>
            ) : (
              <>
                <h3 className="text-3xl font-display font-black text-slate-900 mb-3 tracking-tight">
                  Attendez ! Un cadeau pour vous 🎁
                </h3>
                <p className="text-slate-600 font-medium mb-6">
                  Débloquez une surprise gratuite avec votre pack. Entrez vos coordonnées avant de partir.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                  <div>
                    <input 
                      type="text" 
                      name="first_name"
                      required
                      placeholder="Votre Prénom"
                      className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:bg-white focus:border-slate-900 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                  <div>
                    <input 
                      type="tel" 
                      name="phone"
                      required
                      placeholder="Numéro de téléphone"
                      className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:bg-white focus:border-slate-900 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                  <button 
                    disabled={loading}
                    type="submit"
                    className="w-full bg-slate-900 text-white font-black text-lg py-4 px-4 rounded-2xl border-b-4 border-black hover:border-b-0 hover:translate-y-1 active:border-b-0 active:translate-y-1 outline-none transition-all shadow-xl mt-4 disabled:opacity-70 disabled:transform-none disabled:border-b-4"
                  >
                    {loading ? "Chargement..." : "Obtenir Mon Cadeau"}
                  </button>
                </form>
                <button onClick={() => setIsOpen(false)} className="mt-5 text-sm font-bold text-slate-400 hover:text-slate-600 underline">
                  Non merci, je ne veux pas de cadeau
                </button>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
