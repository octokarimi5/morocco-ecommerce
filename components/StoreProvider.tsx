"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export type FeatureData = { title: string; description: string; icon: string };
export type StepData = { id: number; title: string; description: string; image: string; badge: string };
export type FaqData = { q: string; a: string };
export type ReviewData = { id: number; name: string; location: string; text: string; rating: number; date: string };
export type OfferData = { id: string; title: string; count: number; subtitle: string; price: number; badge: string; isBestValue: boolean };

export type StoreContent = {
  // General
  storeName: string;
  whatsappNumber: string;
  marqueeText: string;
  
  // Hero
  heroHeadline: string;
  heroSubheadline: string;
  heroImage: string;
  
  // Pricing/Offers
  basePrice: number;
  originalPrice: number;
  offers: OfferData[];
  
  // Benefits
  benefitsTitle: string;
  benefitsSubtitle: string;
  features: FeatureData[];

  // How It Works
  howItWorksTitle: string;
  howItWorksSubtitle: string;
  steps: StepData[];

  // Social Proof 
  socialProofTitle: string;
  socialProofSubtitle: string;
  reviews: ReviewData[];

  // FAQ
  faqTitle: string;
  faqs: FaqData[];
};

export const defaultContent: StoreContent = {
  storeName: "ARWA.",
  whatsappNumber: "212600000000",
  marqueeText: "🔥 OFFRE SPÉCIALE -50 MAD • 🚀 LIVRAISON RAPIDE GRATUITE • 🛡️ PAIEMENT À LA LIVRAISON",
  
  heroHeadline: "Restez connecté, sans limites.",
  heroSubheadline: "Le pack idéal : un téléphone Nokia durable avec 2 puces, couplé à des écouteurs sans fil M10 de haute qualité. Recevez une surprise en cadeau !",
  heroImage: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop",
  
  basePrice: 249,
  originalPrice: 299,
  offers: [
    { id: "offre-1", title: "Pack Solo", count: 1, subtitle: "Idéal pour un essai", price: 249, badge: "", isBestValue: false },
    { id: "offre-2", title: "Pack Duo", count: 2, subtitle: "Pour vous et un proche", price: 449, badge: "Économisez 49 DH", isBestValue: true },
    { id: "offre-3", title: "Pack Famille", count: 3, subtitle: "Meilleur prix unitaire", price: 649, badge: "Économisez 98 DH", isBestValue: false },
  ],
  
  benefitsTitle: "Tout ce dont vous avez besoin, rien de plus.",
  benefitsSubtitle: "Un combo parfait alliant l'indestructibilité du classique et l'expérience du sans-fil.",
  features: [
    { title: "Batterie Longue Durée", description: "Jusqu'à 25 jours en veille.", icon: "Battery" },
    { title: "Double SIM", description: "Séparez votre travail et votre vie personnelle.", icon: "Smartphone" },
    { title: "Écouteurs Bluetooth 5.1", description: "Qualité sonore HD et 4h d'autonomie continue.", icon: "Headphones" },
    { title: "Solidité Nokia", description: "Matériaux premium résistants aux chocs.", icon: "Shield" },
  ],

  howItWorksTitle: "Découvrez ce qui le rend unique.",
  howItWorksSubtitle: "L'alliance parfaite entre l'ergonomie classique du Nokia et la puissance sans fil de la technologie M10.",
  steps: [
    { id: 1, title: "Un Téléphone Indestructible", description: "Le Nokia 105 est conçu pour durer. Avec sa batterie longue durée, restez connecté pendant des jours sans avoir à recharger.", image: "https://images.unsplash.com/photo-1549420078-4db8a2b5eab6?q=80&w=800&auto=format&fit=crop", badge: "Fiabilité Légendaire" },
    { id: 2, title: "Le Son Sans Fil Parfait", description: "Associez votre téléphone avec les écouteurs sans fil M10 inclus. Profitez d'une qualité sonore exceptionnelle.", image: "https://images.unsplash.com/photo-1606220588913-b3a58eeb01f1?q=80&w=800&auto=format&fit=crop", badge: "Technologie Bluetooth" },
    { id: 3, title: "Le Duo Infaillible", description: "Pourquoi choisir entre le classique et le moderne ? Ce pack exclusif vous offre le meilleur des deux mondes.", image: "https://images.unsplash.com/photo-1616423640778-28d1b53229bd?q=80&w=800&auto=format&fit=crop", badge: "Offre Premium" }
  ],

  socialProofTitle: "Ils l'ont essayé et approuvé.",
  socialProofSubtitle: "Rejoignez des milliers de clients satisfaits partout au Maroc.",
  reviews: [
    { id: 1, name: "Youssef B.", location: "Casablanca", text: "Le pack est excellent. J'utilise le Nokia comme téléphone principal pour mon travail.", rating: 5, date: "Il y a 2 jours" },
    { id: 2, name: "Amina H.", location: "Rabat", text: "Livraison super rapide et gratuite ! J'étais sceptique mais la qualité est au rendez-vous.", rating: 5, date: "Il y a 4 jours" },
    { id: 3, name: "Karim T.", location: "Marrakech", text: "Prix incroyable pour un téléphone aussi résistant et les écouteurs inclus.", rating: 5, date: "Il y a une semaine" }
  ],

  faqTitle: "Questions Fréquentes",
  faqs: [
    { q: "Comment puis-je payer ma commande ?", a: "Nous n'acceptons que le paiement à la livraison (Cash on Delivery). Vous ne payez rien en ligne." },
    { q: "Quels sont les délais de livraison ?", a: "La livraison prend généralement 24 à 48 heures ouvrables pour les grandes villes." },
    { q: "Ce téléphone supporte-t-il WhatsApp ?", a: "Non, le Nokia 105 est un téléphone basique conçu pour la durabilité et les appels." },
    { q: "Puis-je retourner le produit si je ne suis pas satisfait ?", a: "Absolument ! Nous offrons une garantie de satisfaction de 30 jours." }
  ]
};

const StoreContext = createContext<StoreContent>(defaultContent);

export const useStoreContent = () => useContext(StoreContext);

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<StoreContent>(defaultContent);

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await supabase.from("settings").select("value").eq("key", "store_content").single();
      if (data && data.value) {
        setContent({ ...defaultContent, ...data.value });
      }
    };
    fetchContent();
  }, []);

  return (
    <StoreContext.Provider value={content}>
      {children}
    </StoreContext.Provider>
  );
}
