"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { StoreContent, defaultContent } from "@/components/StoreProvider";

export default function AdminSettings() {
  const [pixels, setPixels] = useState({ facebook: "", tiktok: "", google: "" });
  const [content, setContent] = useState<StoreContent>(defaultContent);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data: pixelsData } = await supabase.from("settings").select("value").eq("key", "tracking_pixels").single();
      if (pixelsData && pixelsData.value) setPixels(pixelsData.value);

      const { data: contentData } = await supabase.from("settings").select("value").eq("key", "store_content").single();
      if (contentData && contentData.value) setContent({ ...defaultContent, ...contentData.value });
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Save pixels
    const { data: pData } = await supabase.from("settings").select("id").eq("key", "tracking_pixels").single();
    if (pData) {
      await supabase.from("settings").update({ value: pixels }).eq("key", "tracking_pixels");
    } else {
      await supabase.from("settings").insert([{ key: "tracking_pixels", value: pixels }]);
    }

    // Save content
    const { data: cData } = await supabase.from("settings").select("id").eq("key", "store_content").single();
    if (cData) {
      await supabase.from("settings").update({ value: content }).eq("key", "store_content");
    } else {
      await supabase.from("settings").insert([{ key: "store_content", value: content }]);
    }

    alert("Tous les paramètres ont été enregistrés !");
    setSaving(false);
  };

  return (
    <div className="pb-24">
       <h2 className="text-3xl font-bold text-gray-900 mb-8">Paramètres de la Boutique</h2>
       
       <form onSubmit={handleSave} className="space-y-8 max-w-3xl">
         
         {/* Store Content Settings */}
         <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
           <h3 className="text-xl font-bold mb-6 text-gray-800">Contenu et Apparence</h3>
           <div className="space-y-6">
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la boutique (Logo Texte)</label>
               <input 
                 type="text" 
                 required
                 value={content.storeName}
                 onChange={e => setContent({...content, storeName: e.target.value})}
                 className="w-full p-3.5 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-primary-500 outline-none"
               />
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Numéro WhatsApp (ex: 212600000000)</label>
               <input 
                 type="text" 
                 required
                 value={content.whatsappNumber}
                 onChange={e => setContent({...content, whatsappNumber: e.target.value})}
                 className="w-full p-3.5 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-primary-500 outline-none"
               />
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Texte du Bandeau Défilant (Marquee)</label>
               <input 
                 type="text" 
                 required
                 value={content.marqueeText}
                 onChange={e => setContent({...content, marqueeText: e.target.value})}
                 className="w-full p-3.5 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-primary-500 outline-none"
               />
             </div>

             <hr className="border-gray-200 my-6" />

             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Titre Principal (Hero Headline)</label>
               <input 
                 type="text" 
                 required
                 value={content.heroHeadline}
                 onChange={e => setContent({...content, heroHeadline: e.target.value})}
                 className="w-full p-3.5 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-primary-500 outline-none"
               />
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Sous-titre / Description (Hero Subheadline)</label>
               <textarea 
                 required
                 rows={3}
                 value={content.heroSubheadline}
                 onChange={e => setContent({...content, heroSubheadline: e.target.value})}
                 className="w-full p-3.5 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-primary-500 outline-none"
               />
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Lien de l'Image du Produit (Image URL)</label>
               <input 
                 type="url" 
                 required
                 value={content.heroImage}
                 onChange={e => setContent({...content, heroImage: e.target.value})}
                 placeholder="https://..."
                 className="w-full p-3.5 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-primary-500 outline-none text-sm"
               />
               <img src={content.heroImage} alt="Preview" className="mt-4 h-32 rounded-xl object-contain border border-gray-200 p-2" onError={(e) => (e.currentTarget.style.display = 'none')} onLoad={(e) => (e.currentTarget.style.display = 'block')} />
             </div>
           </div>
         </div>

         {/* Pixels Settings */}
         <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
           <h3 className="text-xl font-bold mb-6 text-gray-800">Identifiants des Pixels Tracking</h3>
           <div className="space-y-6">
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Pixel Facebook (Meta) ID</label>
               <input 
                 type="text" 
                 value={pixels.facebook || ""}
                 onChange={e => setPixels({...pixels, facebook: e.target.value})}
                 placeholder="123456789012345"
                 className="w-full p-3.5 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-primary-500 outline-none"
               />
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Pixel TikTok ID</label>
               <input 
                 type="text" 
                 value={pixels.tiktok || ""}
                 onChange={e => setPixels({...pixels, tiktok: e.target.value})}
                 placeholder="C123456789"
                 className="w-full p-3.5 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-primary-500 outline-none"
               />
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Google Analytics / Ads ID</label>
               <input 
                 type="text" 
                 value={pixels.google || ""}
                 onChange={e => setPixels({...pixels, google: e.target.value})}
                 placeholder="G-XXXXXXXXXX"
                 className="w-full p-3.5 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-primary-500 outline-none"
               />
             </div>
           </div>
         </div>

         <div className="pt-4 flex sticky bottom-4 z-50">
          <button 
            type="submit" 
            disabled={saving}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 px-6 rounded-2xl transition disabled:opacity-70 shadow-2xl flex justify-center items-center gap-2"
          >
            {saving ? <div className="animate-spin w-5 h-5 border-2 border-white/40 border-t-white rounded-full"></div> : "Enregistrer toutes les modifications"}
          </button>
         </div>
         
       </form>
    </div>
  );
}
