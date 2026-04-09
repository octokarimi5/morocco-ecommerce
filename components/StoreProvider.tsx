"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export type StoreContent = {
  storeName: string;
  marqueeText: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroImage: string;
  whatsappNumber: string;
};

export const defaultContent: StoreContent = {
  storeName: "ARWA.",
  marqueeText: "🔥 OFFRE SPÉCIALE -50 MAD • 🚀 LIVRAISON RAPIDE GRATUITE • 🛡️ PAIEMENT À LA LIVRAISON",
  heroHeadline: "Restez connecté, sans limites.",
  heroSubheadline: "Le pack idéal : un téléphone Nokia durable avec 2 puces, couplé à des écouteurs sans fil M10 de haute qualité. Recevez une surprise en cadeau !",
  heroImage: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop",
  whatsappNumber: "212600000000"
};

const StoreContext = createContext<StoreContent>(defaultContent);

export const useStoreContent = () => useContext(StoreContext);

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<StoreContent>(defaultContent);

  useEffect(() => {
    const fetchContent = async () => {
      // Fetch dynamic store content from Supabase
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
