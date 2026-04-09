"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Save } from "lucide-react";

export default function PixelsSettings() {
  const [pixels, setPixels] = useState({ facebook: "", tiktok: "", google: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from("settings").select("value").eq("key", "tracking_pixels").single();
      if (data && data.value) setPixels(data.value);
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const { data } = await supabase.from("settings").select("id").eq("key", "tracking_pixels").single();
    if (data) {
      await supabase.from("settings").update({ value: pixels }).eq("key", "tracking_pixels");
    } else {
      await supabase.from("settings").insert([{ key: "tracking_pixels", value: pixels }]);
    }

    alert("تم حفظ إعدادات البيكسل بنجاح!");
    setSaving(false);
  };

  return (
    <div className="pb-24 max-w-3xl">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 font-display">إعدادات البيكسل</h2>
       
      <form onSubmit={handleSave} className="space-y-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h3 className="text-xl font-bold mb-6 text-gray-800">معرفات التتبع (Tracking IDs)</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pixel Facebook (Meta) ID</label>
              <input 
                type="text" 
                value={pixels.facebook || ""}
                onChange={e => setPixels({...pixels, facebook: e.target.value})}
                placeholder="123456789012345"
                className="w-full p-3.5 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-primary-500 outline-none text-left" dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pixel TikTok ID</label>
              <input 
                type="text" 
                value={pixels.tiktok || ""}
                onChange={e => setPixels({...pixels, tiktok: e.target.value})}
                placeholder="C123456789"
                className="w-full p-3.5 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-primary-500 outline-none text-left" dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Google Analytics / Ads ID</label>
              <input 
                type="text" 
                value={pixels.google || ""}
                onChange={e => setPixels({...pixels, google: e.target.value})}
                placeholder="G-XXXXXXXXXX"
                className="w-full p-3.5 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-primary-500 outline-none text-left" dir="ltr"
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
            {saving ? <div className="animate-spin w-5 h-5 border-2 border-white/40 border-t-white rounded-full"></div> : <><Save size={20}/> حفظ إعدادات البيكسل</>}
          </button>
        </div>
      </form>
    </div>
  );
}
