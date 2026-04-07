"use client";

import { useState } from "react";
import { productData } from "@/lib/data";
import { Truck, ShieldCheck, ChevronRight, Flame } from "lucide-react";
import { createOrder } from "@/app/actions/orders";

interface CheckoutFormProps {
  selectedOfferId: string;
  setSelectedOfferId: (id: string) => void;
}

export default function CheckoutForm({ selectedOfferId, setSelectedOfferId }: CheckoutFormProps) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [orderRef, setOrderRef] = useState("");
  
  const selectedOffer = productData.offers.find(o => o.id === selectedOfferId) || productData.offers[0];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      formData.append("offer_id", selectedOfferId);

      const result = await createOrder(formData);
      
      if (result.success) {
        setOrderRef(result.orderNumber!);
        setSubmitted(true);
        e.currentTarget.reset();
      } else {
        alert(result.message);
      }
    } catch (err) {
      alert("Erreur réseau. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <section id="checkout-section" className="py-24 bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-[32px] p-8 md:p-12 max-w-xl text-center shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100">
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck size={40} />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">Commande Réussie !</h2>
          <p className="text-lg text-slate-600 font-medium mb-6">Merci pour votre confiance. Notre équipe vous contactera dans les plus brefs délais pour confirmer l'expédition.</p>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
             <p className="text-sm text-slate-500 font-bold mb-1">Numéro de Commande</p>
             <p className="text-xl font-black text-slate-900 font-mono tracking-widest">{orderRef}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="checkout-section" className="py-16 md:py-24 bg-slate-50 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 font-display mb-4 tracking-tight pt-4">Finalisez votre Commande</h2>
          <p className="text-lg text-slate-600 font-medium max-w-2xl mx-auto">Veuillez sélectionner votre offre et remplir vos informations de livraison.</p>
        </div>

        <div className="bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col-reverse lg:flex-row border border-slate-200">
          
          {/* LEFT SIDE: Form & Offer Selection */}
          <div className="w-full lg:w-[58%] p-6 md:p-10 lg:p-12 bg-white relative z-10">
            
            {/* 1. Bundles */}
            <div className="mb-10 lg:mb-12">
              <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-6 tracking-tight flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm shadow-md">1</span> 
                Choisissez votre pack
              </h3>
              
              <div className="flex flex-col gap-4">
                {productData.offers.map(offer => (
                   <div 
                     key={offer.id} 
                     onClick={() => setSelectedOfferId(offer.id)}
                     className={`flex items-center p-4 md:p-5 border-[3px] rounded-[24px] cursor-pointer transition-all relative group ${
                       selectedOfferId === offer.id 
                         ? "border-primary-500 bg-primary-50/40 shadow-sm" 
                         : "border-slate-100 hover:border-slate-300 bg-white"
                     }`}
                   >
                     {/* Radio Button UI */}
                     <div className={`w-6 h-6 rounded-full border-[3px] flex items-center justify-center mr-4 transition-colors shrink-0 ${
                       selectedOfferId === offer.id ? "border-primary-500" : "border-slate-300 group-hover:border-slate-400"
                     }`}>
                       {selectedOfferId === offer.id && <div className="w-2.5 h-2.5 bg-primary-500 rounded-full" />}
                     </div>
                     
                     <div className="flex-1">
                       <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-1">
                         <span className="font-black text-lg text-slate-900 tracking-tight">{offer.title}</span>
                         <span className="font-black text-xl text-slate-900 tracking-tighter">{offer.price} MAD</span>
                       </div>
                       <p className={`text-sm font-bold ${selectedOfferId === offer.id ? "text-primary-600" : "text-slate-500"}`}>
                         {offer.count}x Nokia 105 + {offer.count}x M10
                       </p>
                     </div>
                     
                     {offer.isBestValue && (
                       <span className="absolute -top-3 right-5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-white">
                         Le plus prisé
                       </span>
                     )}
                   </div>
                ))}
              </div>
            </div>

            <hr className="border-slate-100 mb-10 border-t-2" />

            {/* 2. Shipping Context */}
            <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-6 tracking-tight flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm shadow-md">2</span> 
              Informations d'expédition
            </h3>
            
            {/* Scarcity Banner Plugin */}
            <div className="bg-amber-50 border-2 border-amber-200 text-amber-800 p-5 rounded-2xl mb-8 flex items-start gap-4 shadow-sm">
               <div className="bg-amber-100 p-2.5 rounded-full shrink-0"><Flame size={20} className="text-amber-600" /></div>
               <div>
                 <p className="font-black text-sm uppercase tracking-wider">Forte demande aujourd'hui</p>
                 <p className="text-xs font-bold opacity-80 mt-1.5 leading-relaxed">Réservez votre pack maintenant avant l'épuisement des stocks. Livraison express garantie si vous validez maintenant.</p>
               </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 pl-1">Nom et Prénom <span className="text-red-500">*</span></label>
                <input 
                  required 
                  name="customer_name"
                  type="text" 
                  placeholder="Ex: Yassine El Amrani"
                  className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:bg-white focus:border-slate-900 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 pl-1">Numéro de téléphone <span className="text-red-500">*</span></label>
                <div className="flex">
                  <span className="inline-flex items-center px-4 rounded-l-xl border-2 border-r-0 border-slate-200 bg-slate-100 text-slate-600 font-black">
                    +212
                  </span>
                  <input 
                    required 
                    name="customer_phone"
                    type="tel" 
                    placeholder="6 XX XX XX XX"
                    className="flex-1 p-4 bg-slate-50 border-2 border-slate-200 rounded-r-xl focus:bg-white focus:border-slate-900 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-5">
                <div className="w-full sm:w-1/2">
                  <label className="block text-sm font-bold text-slate-700 mb-1.5 pl-1">Ville <span className="text-red-500">*</span></label>
                  <input 
                    required
                    type="text"
                    name="city"
                    placeholder="Ex: Casablanca"
                    className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:bg-white focus:border-slate-900 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-400"
                  />
                </div>

                <div className="w-full sm:w-1/2">
                  <label className="block text-sm font-bold text-slate-700 mb-1.5 pl-1">Adresse complète</label>
                  <input 
                    required 
                    name="address_line"
                    type="text" 
                    placeholder="Quartier, rue..."
                    className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:bg-white focus:border-slate-900 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="pt-6">
                <button 
                  disabled={loading}
                  type="submit"
                  className="w-full bg-slate-900 text-white font-black text-xl py-5 px-6 rounded-2xl border-b-[5px] border-black hover:border-b-0 hover:translate-y-[5px] active:border-b-0 active:translate-y-[5px] transition-all flex justify-center items-center gap-3 disabled:opacity-70 disabled:transform-none disabled:border-b-[5px] group shadow-lg"
                >
                  {loading ? (
                    "Traitement..."
                  ) : (
                    <>
                      Validation COD <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
                <div className="text-center text-sm font-black text-slate-400 mt-5 flex items-center justify-center gap-2 uppercase tracking-wide">
                  <ShieldCheck className="w-5 h-5 text-green-500" /> Sécurisé & Paiement à la livraison
                </div>
              </div>
            </form>
          </div>

          {/* RIGHT SIDE: Compact Sticky Order Summary */}
          <div className="w-full lg:w-[42%] bg-slate-50 border-b lg:border-b-0 lg:border-l border-slate-200 relative">
            
            {/* The summary container stays sticky when scrolling down the form on desktop */}
            <div className="lg:sticky lg:top-12 p-8 md:p-10">
              <h2 className="text-2xl font-display font-black text-slate-900 mb-6 tracking-tight">Récapitulatif</h2>
              
              <div className="bg-white rounded-[20px] p-5 mb-6 border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-primary-100 w-16 h-16 rounded-bl-full pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden border border-slate-200">
                       <img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=150&auto=format&fit=crop" className="w-full h-full object-cover opacity-80 mix-blend-multiply" alt="product" />
                    </div>
                    <div>
                      <p className="font-black text-lg text-slate-900 leading-none">{selectedOffer.title}</p>
                      <p className="text-sm text-slate-500 font-bold mt-1">Pack sélectionné</p>
                    </div>
                  </div>
                  <div className="text-slate-600 font-bold text-sm bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                    {selectedOffer.count}x Nokia 105 + {selectedOffer.count}x M10
                  </div>
                </div>
              </div>

              <div className="space-y-3 font-bold text-slate-600 mb-6">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span className="text-slate-900">{selectedOffer.price} MAD</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Expédition</span>
                  <span className="text-green-700 bg-green-100/70 px-2 py-0.5 rounded text-xs uppercase tracking-wide">Gratuite</span>
                </div>
              </div>

              <div className="flex justify-between items-end pt-5 border-t-2 border-slate-200 mb-8">
                <span className="text-lg font-black text-slate-900">Total</span>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase font-black block leading-none mb-1">A payer à la livraison</span>
                  <span className="font-black text-4xl text-primary-500 tracking-tighter leading-none">{selectedOffer.price}</span>
                  <span className="font-bold text-sm text-slate-500 ml-1">MAD</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                  <Truck className="text-primary-500 w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-xs font-bold text-slate-600 leading-snug">Livraison gratuite partout au Maroc sous 24-48 heures.</p>
                </div>
                <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                  <ShieldCheck className="text-green-500 w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-xs font-bold text-slate-600 leading-snug">Paiement uniquement après réception et vérification.</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
