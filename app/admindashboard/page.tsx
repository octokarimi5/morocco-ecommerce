"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Download, TrendingUp, Package, CheckCircle, Clock } from "lucide-react";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all"); 
  const [showDuplicatesOnly, setShowDuplicatesOnly] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
      
    if (data) setOrders(data);
    setLoading(false);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    await supabase.from("orders").update({ status: newStatus }).eq("id", id);
    fetchOrders();
  };

  const processedOrders = orders.map(order => {
    const occurrences = orders.filter(o => o.customer_phone === order.customer_phone);
    const isDuplicate = occurrences.length > 1;

    const orderDate = new Date(order.created_at);
    const now = new Date();
    
    const isToday = orderDate.getDate() === now.getDate() && 
                    orderDate.getMonth() === now.getMonth() && 
                    orderDate.getFullYear() === now.getFullYear();

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const isWeek = orderDate >= sevenDaysAgo;

    const isMonth = orderDate.getMonth() === now.getMonth() && 
                    orderDate.getFullYear() === now.getFullYear();

    return { ...order, isDuplicate, isToday, isWeek, isMonth, orderDate };
  });

  const filteredOrders = processedOrders.filter(order => {
    if (statusFilter !== "all" && order.status !== statusFilter) return false;
    
    if (dateFilter === "today" && !order.isToday) return false;
    if (dateFilter === "week" && !order.isWeek) return false;
    if (dateFilter === "month" && !order.isMonth) return false;

    if (showDuplicatesOnly && !order.isDuplicate) return false;

    return true;
  });

  const downloadCSV = () => {
    const headers = ["Order ID", "Date", "Customer Name", "Phone Number", "City", "Total MAD", "Status", "Notes/Address"];
    const rows = filteredOrders.map(order => [
      `"${order.order_number}"`,
      `"${order.orderDate.toLocaleString('ar-MA')}"`,
      `"${order.customer_name}"`,
      `"${order.customer_phone}"`,
      `"${order.city}"`,
      order.total_mad,
      `"${order.status}"`,
      `"${order.address || ''}"`
    ]);

    let csvContent = "data:text/csv;charset=utf-8," 
      + "\uFEFF" // BOM for Arabic support
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // KPI Calculations
  const totalRevenue = orders.filter(o => o.status !== 'canceled').reduce((acc, curr) => acc + (curr.total_mad || 0), 0);
  const confirmedCount = orders.filter(o => ['confirmed', 'shipped', 'delivered'].includes(o.status)).length;
  const newCount = orders.filter(o => o.status === 'new').length;

  return (
    <div dir="rtl" className="font-sans pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
           <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">إدارة الطلبات</h2>
           <p className="text-slate-500 font-bold">لوحة تحكم احترافية لإدارة مبيعاتك.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <label className="flex items-center gap-2 bg-rose-50 text-rose-700 px-5 py-3 rounded-2xl font-bold border border-rose-200 cursor-pointer shadow-sm hover:bg-rose-100 transition-colors">
            <input 
              type="checkbox" 
              checked={showDuplicatesOnly} 
              onChange={(e) => setShowDuplicatesOnly(e.target.checked)} 
              className="w-5 h-5 text-rose-600 rounded bg-white"
            />
            إظهار المكررة ⚠️
          </label>
          <button 
            onClick={downloadCSV}
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-black transition-colors shadow-lg shadow-emerald-200"
          >
            <Download size={20} />
            تصدير إلى Excel/CSV
          </button>
        </div>
      </div>

      {/* KPIs Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
           <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
             <TrendingUp size={28} />
           </div>
           <div>
              <p className="text-sm text-slate-500 font-bold">المداخيل الإجمالية</p>
              <h3 className="text-2xl font-black text-slate-900">{totalRevenue.toLocaleString()} درهم</h3>
           </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
           <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
             <Package size={28} />
           </div>
           <div>
              <p className="text-sm text-slate-500 font-bold">إجمالي الطلبات</p>
              <h3 className="text-2xl font-black text-slate-900">{orders.length}</h3>
           </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
           <div className="w-14 h-14 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center">
             <CheckCircle size={28} />
           </div>
           <div>
              <p className="text-sm text-slate-500 font-bold">الطلبات المؤكدة+</p>
              <h3 className="text-2xl font-black text-slate-900">{confirmedCount}</h3>
           </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
           <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center">
             <Clock size={28} />
           </div>
           <div>
              <p className="text-sm text-slate-500 font-bold">طلبات قيد الانتظار (جديدة)</p>
              <h3 className="text-2xl font-black text-slate-900">{newCount}</h3>
           </div>
        </div>
      </div>
      
      {/* Filtering Section */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <span className="text-sm font-black text-slate-800 mb-3 block flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            تصفية حسب التاريخ:
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "كل الوقت" },
              { id: "today", label: "اليوم" },
              { id: "week", label: "آخر 7 أيام" },
              { id: "month", label: "هذا الشهر" }
            ].map(d => (
              <button 
                key={d.id} 
                onClick={() => setDateFilter(d.id)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${dateFilter === d.id ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'}`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 md:border-r border-slate-100 md:pr-8 pt-4 md:pt-0">
          <span className="text-sm font-black text-slate-800 mb-3 block flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
            تصفية حسب الحالة:
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "الكل" },
              { id: "new", label: "جديد" },
              { id: "confirmed", label: "مؤكد" },
              { id: "shipped", label: "مشحون" },
              { id: "delivered", label: "تم التوصيل" },
              { id: "canceled", label: "ملغى" }
            ].map(s => (
              <button 
                key={s.id} 
                onClick={() => setStatusFilter(s.id)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${statusFilter === s.id ? 'bg-primary-500 text-slate-900 shadow-md border-b-[3px] border-primary-700' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-24 text-center flex flex-col items-center justify-center text-slate-500">
             <div className="w-12 h-12 border-4 border-slate-200 border-t-primary-500 rounded-full animate-spin mb-4"></div>
             <p className="font-bold text-lg">جاري تحميل الطلبات بذكاء...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 text-sm">
                  <th className="p-5 font-black">المرجع</th>
                  <th className="p-5 font-black">التاريخ</th>
                  <th className="p-5 font-black">العميل</th>
                  <th className="p-5 font-black">المدينة / العنوان</th>
                  <th className="p-5 font-black">المبلغ</th>
                  <th className="p-5 font-black">الحالة</th>
                  <th className="p-5 font-black text-center">تحديث الحالة</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                   <tr><td colSpan={7} className="p-16 text-center text-slate-500 font-bold text-lg">لا توجد طلبات تطابق بحثك حالياً.</td></tr>
                ) : (
                  filteredOrders.map(order => (
                    <tr key={order.id} className={`border-b border-slate-100/50 hover:bg-slate-50 transition-colors ${order.isDuplicate ? 'bg-rose-50/30 hover:bg-rose-50/60' : ''}`}>
                      <td className="p-5 font-mono text-sm text-slate-500 font-bold whitespace-nowrap">
                        {order.order_number}
                      </td>
                      <td className="p-5 text-sm text-slate-600">
                        <div className="font-bold whitespace-nowrap">{order.orderDate.toLocaleDateString('ar-MA')}</div>
                        <div className="text-xs text-slate-400 mt-1 font-mono">{order.orderDate.toLocaleTimeString('ar-MA', { hour: '2-digit', minute: '2-digit' })}</div>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-black text-slate-900 text-base">{order.customer_name}</p>
                          {order.isDuplicate && (
                            <span className="bg-rose-100 text-rose-700 text-[10px] font-black px-2.5 py-0.5 rounded-lg uppercase tracking-wider border border-rose-200" title="يوجد طلب آخر بنفس رقم الهاتف">
                              مكرر
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-bold text-slate-600 bg-slate-100 inline-block px-3 py-1 rounded-lg border border-slate-200" dir="ltr">{order.customer_phone}</p>
                      </td>
                      <td className="p-5 text-sm max-w-[200px]">
                        <p className="font-black text-slate-800">{order.city}</p>
                        {order.address && <p className="text-slate-500 mt-1 truncate" title={order.address}>{order.address}</p>}
                      </td>
                      <td className="p-5 font-black text-primary-600 text-xl whitespace-nowrap">
                        {order.total_mad} <span className="text-xs font-bold text-slate-400">MAD</span>
                      </td>
                      <td className="p-5">
                        <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wide inline-flex items-center justify-center ${
                          order.status === 'new' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          order.status === 'confirmed' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          order.status === 'shipped' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                          order.status === 'delivered' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {
                            order.status === 'new' ? "🆕 جديد" :
                            order.status === 'confirmed' ? "✅ مؤكد" :
                            order.status === 'shipped' ? "📦 مشحون" :
                            order.status === 'delivered' ? "🎉 اكتمل" : "❌ ملغى"
                          }
                        </span>
                      </td>
                      <td className="p-5 text-center">
                        <select 
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          className="text-sm font-bold border-2 border-slate-200 rounded-xl p-2.5 w-[140px] bg-white cursor-pointer hover:border-slate-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-50 transition-all shadow-sm"
                        >
                          <option value="new">إلى جديد</option>
                          <option value="confirmed">تأكيد الطلب</option>
                          <option value="shipped">تحديد كمشحون</option>
                          <option value="delivered">التوصيل بنجاح</option>
                          <option value="canceled">إلغاء الطلب</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
