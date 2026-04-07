"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { LayoutDashboard, Users, Settings, LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 font-bold" dir="rtl">جاري التحميل...</div>;

  if (!session) {
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert("بيانات الدخول غير صحيحة");
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4" dir="rtl">
        <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-slate-100">
          <h2 className="text-3xl font-black font-display text-center mb-8 text-slate-900 tracking-tighter">لوحة تحكم Arwa</h2>
          <form onSubmit={handleLogin} className="space-y-5">
            <input name="email" type="email" placeholder="البريد الإلكتروني" required className="w-full p-4 border border-slate-200 rounded-xl focus:border-primary-500 focus:outline-none bg-slate-50 text-right" dir="ltr" />
            <input name="password" type="password" placeholder="كلمة المرور" required className="w-full p-4 border border-slate-200 rounded-xl focus:border-primary-500 focus:outline-none bg-slate-50 text-right" dir="ltr" />
            <button className="w-full bg-slate-900 text-white font-black py-4 rounded-xl border-b-4 border-slate-700 active:border-b-0 active:translate-y-1 transition-all shadow-md">
              تسجيل الدخول
            </button>
          </form>
        </div>
      </div>
    );
  }

  const nav = [
    { name: "الطلبات", path: "/admindashboard", icon: <LayoutDashboard size={20} /> },
    { name: "العملاء / ההלידים", path: "/admindashboard/leads", icon: <Users size={20} /> },
    { name: "الإعدادات", path: "/admindashboard/settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-row-reverse font-sans" dir="rtl">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-6 flex-col hidden md:flex border-l border-slate-800">
        <h1 className="text-2xl font-black font-display mb-10 tracking-widest text-primary-400">ARWA<span className="text-white">.</span></h1>
        <nav className="flex-1 space-y-3 mt-4">
          {nav.map(item => (
            <Link 
              key={item.path} 
              href={item.path}
              className={`flex items-center gap-3 px-5 py-4 rounded-2xl font-bold transition-all ${pathname === item.path ? 'bg-primary-500 text-slate-900 shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <div className="ml-2">{item.icon}</div> 
              {item.name}
            </Link>
          ))}
        </nav>
        <button 
          onClick={() => supabase.auth.signOut()}
          className="flex items-center justify-center gap-3 px-4 py-4 text-slate-400 font-bold hover:text-white hover:bg-rose-600 rounded-2xl transition-colors w-full mt-auto"
        >
          <LogOut size={20} className="ml-2" /> تسجيل الخروج
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-auto">
         {children}
      </main>
    </div>
  );
}
