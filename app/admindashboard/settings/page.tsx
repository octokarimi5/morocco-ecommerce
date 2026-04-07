"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminSettings() {
  const [pixels, setPixels] = useState({ facebook: "", tiktok: "", google: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from("settings").select("value").eq("key", "tracking_pixels").single();
      if (data && data.value) {
        setPixels(data.value);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Uses upsert logic or simple update
    await supabase.from("settings").update({ value: pixels }).eq("key", "tracking_pixels");
    alert("Paramètres enregistrés !");
    setSaving(false);
  };

  return (
    <div>
       <h2 className="text-3xl font-bold text-gray-900 mb-8">Paramètres de Suivi (Pixels)</h2>
       
       <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-2xl">
         <h3 className="text-xl font-bold mb-6 text-gray-800">Identifiants des Pixels Tracking</h3>
         
         <form onSubmit={handleSave} className="space-y-6">
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

           <div className="pt-2">
            <button 
              type="submit" 
              disabled={saving}
              className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-3.5 px-6 rounded-xl transition disabled:opacity-70"
            >
              {saving ? "Modification..." : "Enregistrer les modifications"}
            </button>
           </div>
         </form>
       </div>
    </div>
  );
}
