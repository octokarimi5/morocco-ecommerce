"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { StoreContent, defaultContent } from "@/components/StoreProvider";
import { Save, ChevronDown, Plus, Trash2, LayoutTemplate } from "lucide-react";
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
            <LayoutTemplate className="text-primary-500" size={32} /> تعديل المحتوى
         </h2>
         <p className="text-slate-500">قم بتغيير أي نص أو صورة في المتجر من هنا. التغييرات تظهر فوراً.</p>
       </div>
       
       <form onSubmit={handleSave} className="space-y-4">
         
         <Accordion id="general" title="1. الإعدادات العامة (اللوجو، الواتساب، الشريط الإعلاني)">
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">اسم المتجر / اللوجو (Store Name)</label>
               <input type="text" required value={content.storeName} onChange={e => setContent({...content, storeName: e.target.value})} className="w-full p-3.5 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-primary-500 outline-none text-left" dir="ltr" />
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">رقم الواتساب (WhatsApp Number)</label>
               <input type="text" required value={content.whatsappNumber} onChange={e => setContent({...content, whatsappNumber: e.target.value})} className="w-full p-3.5 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-primary-500 outline-none text-left" dir="ltr" />
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">نص الشريط الإعلاني المتحرك (Marquee - استخدم • للفصل)</label>
               <input type="text" required value={content.marqueeText} onChange={e => setContent({...content, marqueeText: e.target.value})} className="w-full p-3.5 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-primary-500 outline-none text-left" dir="ltr" />
            </div>
         </Accordion>

         <Accordion id="hero" title="2. القسم الرئيسي (الهيرو - Hero Section)">
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">العنوان الرئيسي (Headline)</label>
               <input type="text" required value={content.heroHeadline} onChange={e => setContent({...content, heroHeadline: e.target.value})} className="w-full p-3.5 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-primary-500 outline-none text-left" dir="ltr" />
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">الوصف (Subheadline)</label>
               <textarea rows={3} required value={content.heroSubheadline} onChange={e => setContent({...content, heroSubheadline: e.target.value})} className="w-full p-3.5 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-primary-500 outline-none text-left" dir="ltr" />
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">صورة المنتج الرئيسية (Hero Image URL)</label>
               <input type="url" required value={content.heroImage} onChange={e => setContent({...content, heroImage: e.target.value})} placeholder="https://..." className="w-full p-3.5 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-primary-500 outline-none text-left" dir="ltr" />
               {content.heroImage && <img src={content.heroImage} className="mt-4 h-32 rounded-xl object-cover" />}
            </div>
         </Accordion>

         <Accordion id="benefits" title="3. قسم المميزات (Benefits)">
            <div className="grid grid-cols-2 gap-4">
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">عنوان القسم</label>
                 <input type="text" required value={content.benefitsTitle} onChange={e => setContent({...content, benefitsTitle: e.target.value})} className="w-full p-3.5 border border-gray-300 rounded-xl bg-gray-50 outline-none text-left" dir="ltr" />
              </div>
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">وصف القسم</label>
                 <input type="text" required value={content.benefitsSubtitle} onChange={e => setContent({...content, benefitsSubtitle: e.target.value})} className="w-full p-3.5 border border-gray-300 rounded-xl bg-gray-50 outline-none text-left" dir="ltr" />
              </div>
            </div>
            <div className="space-y-4 pt-4">
              <label className="block text-md font-bold text-gray-900 border-t pt-4">المميزات (Features)</label>
              {content.features.map((feature, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex gap-4 items-start">
                   <div className="flex-1 space-y-3">
                     <input type="text" value={feature.title} onChange={e => { const newF = [...content.features]; newF[idx].title = e.target.value; setContent({...content, features: newF}); }} className="w-full p-2 border border-gray-300 rounded-lg text-left" dir="ltr" />
                     <input type="text" value={feature.description} onChange={e => { const newF = [...content.features]; newF[idx].description = e.target.value; setContent({...content, features: newF}); }} className="w-full p-2 border border-gray-300 rounded-lg text-left" dir="ltr" />
                     <select value={feature.icon} onChange={e => { const newF = [...content.features]; newF[idx].icon = e.target.value; setContent({...content, features: newF}); }} className="p-2 border rounded-lg" dir="ltr">
                        <option value="Battery">Battery</option>
                        <option value="Smartphone">Smartphone</option>
                        <option value="Headphones">Headphones</option>
                        <option value="Shield">Shield</option>
                     </select>
                   </div>
                </div>
              ))}
            </div>
         </Accordion>

         <Accordion id="howitworks" title="4. قسم كيفية العمل (How It Works)">
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
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex gap-4 items-start">
                   <div className="flex-1 space-y-3">
                     <input type="text" placeholder="Title" value={step.title} onChange={e => { const newS = [...content.steps]; newS[idx].title = e.target.value; setContent({...content, steps: newS}); }} className="w-full p-2 border border-gray-300 rounded-lg text-left" dir="ltr" />
                     <textarea placeholder="Description" value={step.description} onChange={e => { const newS = [...content.steps]; newS[idx].description = e.target.value; setContent({...content, steps: newS}); }} className="w-full p-2 border border-gray-300 rounded-lg text-left" dir="ltr" />
                     <div className="flex gap-2 text-left">
                       <input type="text" placeholder="Badge" value={step.badge} onChange={e => { const newS = [...content.steps]; newS[idx].badge = e.target.value; setContent({...content, steps: newS}); }} className="w-1/3 p-2 border rounded-lg text-left" dir="ltr" />
                       <input type="url" placeholder="Image URL" value={step.image} onChange={e => { const newS = [...content.steps]; newS[idx].image = e.target.value; setContent({...content, steps: newS}); }} className="flex-1 p-2 border rounded-lg text-left" dir="ltr" />
                     </div>
                     {step.image && <img src={step.image} className="mt-2 h-20 rounded-md object-cover" />}
                   </div>
                </div>
              ))}
            </div>
         </Accordion>

         <Accordion id="social" title="5. قسم آراء العملاء (Reviews)">
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
                   <button type="button" onClick={() => setContent({...content, reviews: content.reviews.filter((_, i) => i !== idx)})} className="absolute top-2 left-2 text-red-500 hover:text-red-700"><Trash2 size={18}/></button>
                   <div className="flex gap-2">
                     <input type="text" placeholder="Name" value={rev.name} onChange={e => { const newR = [...content.reviews]; newR[idx].name = e.target.value; setContent({...content, reviews: newR}); }} className="flex-1 p-2 border rounded-lg text-left" dir="ltr" />
                     <input type="text" placeholder="Location" value={rev.location} onChange={e => { const newR = [...content.reviews]; newR[idx].location = e.target.value; setContent({...content, reviews: newR}); }} className="flex-1 p-2 border rounded-lg text-left" dir="ltr" />
                   </div>
                   <textarea placeholder="Review Text" value={rev.text} onChange={e => { const newR = [...content.reviews]; newR[idx].text = e.target.value; setContent({...content, reviews: newR}); }} className="w-full p-2 border rounded-lg text-left" dir="ltr" />
                </div>
              ))}
              <button type="button" onClick={() => setContent({...content, reviews: [...content.reviews, { id: Date.now(), name: "John D.", location: "City", text: "Great!", rating: 5, date: "Recently" }]})} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-bold hover:bg-gray-50 hover:text-primary-500 transition-colors flex justify-center items-center gap-2">
                <Plus size={20}/> إضافة تعليق
              </button>
            </div>
         </Accordion>

         <Accordion id="faq" title="6. قسم الأسئلة الشائعة (FAQ)">
            <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">عنوان القسم</label>
                 <input type="text" required value={content.faqTitle} onChange={e => setContent({...content, faqTitle: e.target.value})} className="w-full p-3.5 border border-gray-300 rounded-xl bg-gray-50 outline-none text-left" dir="ltr" />
            </div>
            <div className="space-y-4 pt-4">
              {content.faqs.map((faq, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 relative">
                   <button type="button" onClick={() => setContent({...content, faqs: content.faqs.filter((_, i) => i !== idx)})} className="absolute top-2 left-2 text-red-500 hover:text-red-700"><Trash2 size={18}/></button>
                   <input type="text" placeholder="Question" value={faq.q} onChange={e => { const newF = [...content.faqs]; newF[idx].q = e.target.value; setContent({...content, faqs: newF}); }} className="w-full p-2 border rounded-lg text-left font-bold" dir="ltr" />
                   <textarea placeholder="Answer" value={faq.a} onChange={e => { const newF = [...content.faqs]; newF[idx].a = e.target.value; setContent({...content, faqs: newF}); }} className="w-full p-2 border rounded-lg text-left" dir="ltr" />
                </div>
              ))}
              <button type="button" onClick={() => setContent({...content, faqs: [...content.faqs, { q: "New Question?", a: "Answer here." }]})} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-bold hover:bg-gray-50 hover:text-primary-500 transition-colors flex justify-center items-center gap-2">
                <Plus size={20}/> إضافة سؤال
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
