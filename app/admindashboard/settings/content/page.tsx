"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { StoreContent, defaultContent } from "@/components/StoreProvider";
import { Save, ChevronDown, Plus, Trash2, LayoutTemplate, Upload, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ContentSettings() {
  const [content, setContent] = useState<StoreContent>(defaultContent);
  const [saving, setSaving] = useState(false);
  const [openSection, setOpenSection] = useState<string>("general");

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from("settings").select("value").eq("key", "store_content").single();
      if (data && data.value) setContent({ ...defaultContent, ...data.value });
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const { data } = await supabase.from("settings").select("id").eq("key", "store_content").single();
    if (data) {
      await supabase.from("settings").update({ value: content }).eq("key", "store_content");
    } else {
      await supabase.from("settings").insert([{ key: "store_content", value: content }]);
    }

    alert("تم حفظ المحتوى بنجاح!");
    setSaving(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `public/${fileName}`;

    try {
      setSaving(true);
      const { data, error } = await supabase.storage
        .from('store_assets')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (error) {
         if (error.message.includes("Bucket not found")) {
            alert("خطأ: دلو التخزين 'store_assets' غير موجود في Supabase! يرجى إنشاؤه أولاً عبر SQL.");
         } else {
            alert("فشل الرفع: " + error.message);
         }
         throw error;
      }

      const { data: publicUrlData } = supabase.storage
        .from('store_assets')
        .getPublicUrl(filePath);

      callback(publicUrlData.publicUrl);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
      e.target.value = ''; // Reset input
    }
  };

  const ImageUploadUI = ({ url, onUpload, onRemove }: { url: string; onUpload: (url: string) => void; onRemove: () => void }) => (
    <div className="flex items-center gap-4 mt-2 p-4 bg-white border border-dashed border-gray-300 rounded-xl">
       {url ? (
         <div className="relative group">
           <img src={url} className="h-20 w-20 rounded-xl object-cover border border-gray-200" alt="Preview" />
           <button type="button" onClick={onRemove} className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-md hover:bg-red-600 transition-colors" title="إزالة الصورة">
             <Trash2 size={14}/>
           </button>
         </div>
       ) : (
         <div className="h-20 w-20 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400">
           <ImageIcon size={24} />
         </div>
       )}
       <div className="flex flex-col gap-1 items-start">
         <label className="cursor-pointer bg-slate-900 border border-transparent text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 flex items-center gap-2 shadow-sm transition-all active:scale-95">
           <Upload size={16} /> {url ? 'تغيير الصورة' : 'رفع صورة من الجهاز'}
           <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, onUpload)} disabled={saving} />
         </label>
         <span className="text-xs text-gray-400">يدعم: JPG, PNG, WEBP. الحد الأقصى: 2MB</span>
       </div>
    </div>
  );

  const Accordion = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => {
    const isOpen = openSection === id;
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <button 
          type="button"
          onClick={() => setOpenSection(isOpen ? "" : id)}
          className={`w-full px-8 py-5 flex items-center justify-between text-right font-bold transition-all ${isOpen ? 'bg-slate-50 text-primary-600 border-b border-gray-200' : 'text-slate-800 hover:bg-slate-50'}`}
        >
          <div className="flex items-center gap-3">
             <span className="text-xl">{title}</span>
          </div>
          <ChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
              <div className="p-8 space-y-6">{children}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="pb-24 max-w-4xl">
       <div className="flex flex-col mb-8 font-display">
         <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <LayoutTemplate className="text-primary-500" size={32} /> تعديل المحتوى الذكي
         </h2>
         <p className="text-slate-500">من هنا يمكنك تعديل النصوص ورفع الصور مباشرة إلى متجرك بكل سهولة.</p>
       </div>
       
       <form onSubmit={handleSave} className="space-y-4">
         
         <Accordion id="general" title="1. الإعدادات العامة (اللوجو، الواتساب)">
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">اسم المتجر / اللوجو (Store Name)</label>
               <input type="text" required value={content.storeName} onChange={e => setContent({...content, storeName: e.target.value})} className="w-full p-3.5 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-primary-500 outline-none text-left" dir="ltr" />
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">رقم الواتساب (WhatsApp Number)</label>
               <input type="text" required value={content.whatsappNumber} onChange={e => setContent({...content, whatsappNumber: e.target.value})} className="w-full p-3.5 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-primary-500 outline-none text-left" dir="ltr" />
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">الشريط الإعلاني أعلى الصفحة (Marquee)</label>
               <input type="text" required value={content.marqueeText} onChange={e => setContent({...content, marqueeText: e.target.value})} className="w-full p-3.5 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-primary-500 outline-none text-left" dir="ltr" />
            </div>
         </Accordion>

         <Accordion id="hero" title="2. القسم الرئيسي (الهيرو - Hero Section)">
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">الصورة الرئيسية للمنتج</label>
               <ImageUploadUI 
                  url={content.heroImage} 
                  onUpload={(url) => setContent({...content, heroImage: url})} 
                  onRemove={() => setContent({...content, heroImage: ""})} 
               />
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">العنوان الرئيسي (Headline)</label>
               <input type="text" required value={content.heroHeadline} onChange={e => setContent({...content, heroHeadline: e.target.value})} className="w-full p-3.5 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-primary-500 outline-none text-left" dir="ltr" />
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">الوصف (Subheadline)</label>
               <textarea rows={3} required value={content.heroSubheadline} onChange={e => setContent({...content, heroSubheadline: e.target.value})} className="w-full p-3.5 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-primary-500 outline-none text-left" dir="ltr" />
            </div>
         </Accordion>

         <Accordion id="howitworks" title="3. قسم مميزات المنتج (How It Works)">
            <div className="grid grid-cols-2 gap-4">
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">عنوان القسم</label>
                 <input type="text" required value={content.howItWorksTitle} onChange={e => setContent({...content, howItWorksTitle: e.target.value})} className="w-full p-3.5 border border-gray-300 rounded-xl bg-gray-50 outline-none text-left" dir="ltr" />
              </div>
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">وصف القسم</label>
                 <input type="text" required value={content.howItWorksSubtitle} onChange={e => setContent({...content, howItWorksSubtitle: e.target.value})} className="w-full p-3.5 border border-gray-300 rounded-xl bg-gray-50 outline-none text-left" dir="ltr" />
              </div>
            </div>
            <div className="space-y-4 pt-4">
              {content.steps.map((step, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col gap-4">
                   <div className="flex gap-4">
                     <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex justify-center items-center font-bold">{idx + 1}</span>
                     <div className="flex-1 space-y-3">
                       <input type="text" placeholder="عنوان الخطوة" value={step.title} onChange={e => { const newS = [...content.steps]; newS[idx].title = e.target.value; setContent({...content, steps: newS}); }} className="w-full p-2 border border-gray-300 rounded-lg text-left" dir="ltr" />
                       <textarea rows={2} placeholder="تفاصيل الخطوة" value={step.description} onChange={e => { const newS = [...content.steps]; newS[idx].description = e.target.value; setContent({...content, steps: newS}); }} className="w-full p-2 border border-gray-300 rounded-lg text-left" dir="ltr" />
                       <input type="text" placeholder="Badge (مثل: تقنية البلوتوث)" value={step.badge} onChange={e => { const newS = [...content.steps]; newS[idx].badge = e.target.value; setContent({...content, steps: newS}); }} className="w-1/3 p-2 border border-gray-300 rounded-lg text-left" dir="ltr" />
                     </div>
                   </div>
                   <div className="mr-12">
                     <label className="block text-xs font-bold text-gray-500 mb-1">صورة الخطوة:</label>
                     <ImageUploadUI 
                        url={step.image} 
                        onUpload={(url) => { const newS = [...content.steps]; newS[idx].image = url; setContent({...content, steps: newS}); }} 
                        onRemove={() => { const newS = [...content.steps]; newS[idx].image = ""; setContent({...content, steps: newS}); }} 
                     />
                   </div>
                </div>
              ))}
            </div>
         </Accordion>

         <Accordion id="social" title="4. قسم آراء العملاء (مع إمكانية رفع صور)">
            <div className="grid grid-cols-2 gap-4">
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">عنوان القسم</label>
                 <input type="text" required value={content.socialProofTitle} onChange={e => setContent({...content, socialProofTitle: e.target.value})} className="w-full p-3.5 border border-gray-300 rounded-xl bg-gray-50 outline-none text-left" dir="ltr" />
              </div>
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">وصف القسم</label>
                 <input type="text" required value={content.socialProofSubtitle} onChange={e => setContent({...content, socialProofSubtitle: e.target.value})} className="w-full p-3.5 border border-gray-300 rounded-xl bg-gray-50 outline-none text-left" dir="ltr" />
              </div>
            </div>
            <div className="space-y-4 pt-4">
              {content.reviews.map((rev, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 relative">
                   <button type="button" onClick={() => setContent({...content, reviews: content.reviews.filter((_, i) => i !== idx)})} className="absolute top-2 left-2 text-red-500 bg-white p-1 rounded-full shadow hover:text-red-700 hover:bg-gray-50"><Trash2 size={16}/></button>
                   <div className="flex gap-2 mr-6">
                     <input type="text" placeholder="Name" value={rev.name} onChange={e => { const newR = [...content.reviews]; newR[idx].name = e.target.value; setContent({...content, reviews: newR}); }} className="flex-1 p-2 border border-gray-300 rounded-lg text-left" dir="ltr" />
                     <input type="text" placeholder="Location" value={rev.location} onChange={e => { const newR = [...content.reviews]; newR[idx].location = e.target.value; setContent({...content, reviews: newR}); }} className="flex-1 p-2 border border-gray-300 rounded-lg text-left" dir="ltr" />
                   </div>
                   <textarea rows={2} placeholder="Review Text" value={rev.text} onChange={e => { const newR = [...content.reviews]; newR[idx].text = e.target.value; setContent({...content, reviews: newR}); }} className="w-full p-2 border border-gray-300 rounded-lg text-left" dir="ltr" />
                   
                   <div className="pt-2">
                     <label className="block text-xs font-bold text-gray-500 mb-1">صورة رأي العميل (اختياري):</label>
                     <ImageUploadUI 
                        url={rev.image || ""} 
                        onUpload={(url) => { const newR = [...content.reviews]; newR[idx].image = url; setContent({...content, reviews: newR}); }} 
                        onRemove={() => { const newR = [...content.reviews]; newR[idx].image = ""; setContent({...content, reviews: newR}); }} 
                     />
                   </div>
                </div>
              ))}
              <button type="button" onClick={() => setContent({...content, reviews: [...content.reviews, { id: Date.now(), name: "Youssef", location: "Casablanca", text: "ممتاز جداً!", rating: 5, date: "الآن" }]})} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-bold hover:bg-gray-50 hover:text-primary-500 transition-colors flex justify-center items-center gap-2">
                <Plus size={20}/> إضافة عميل جديد
              </button>
            </div>
         </Accordion>

         <div className="pt-4 flex sticky bottom-4 z-50">
          <button type="submit" disabled={saving} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 px-6 rounded-2xl transition disabled:opacity-70 shadow-2xl flex justify-center items-center gap-2">
            {saving ? <div className="animate-spin w-5 h-5 border-2 border-white/40 border-t-white rounded-full"></div> : <><Save size={20}/> حفظ المحتوى بالكامل</>}
          </button>
         </div>
       </form>
    </div>
  );
}
