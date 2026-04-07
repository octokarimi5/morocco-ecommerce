"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminLeads() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    if (data) setLeads(data);
    setLoading(false);
  };

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Date,Nom,Telephone,Source\n"
      + leads.map(l => `${new Date(l.created_at).toLocaleDateString()},${l.first_name},${l.phone},${l.source}`).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "leads.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Leads d'intention (Cadeaux)</h2>
        <button onClick={exportCSV} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-bold transition shadow-sm">
          Exporter CSV
        </button>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-x-auto">
        {loading ? (
          <div className="p-10 text-center text-gray-500">Chargement...</div>
        ) : (
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-sm">
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Prénom</th>
                <th className="p-4 font-medium">Téléphone</th>
                <th className="p-4 font-medium">Source</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                 <tr><td colSpan={4} className="p-6 text-center text-gray-500">Aucun lead trouvé.</td></tr>
              ) : (
                leads.map(lead => (
                  <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4 text-sm text-gray-600">{new Date(lead.created_at).toLocaleDateString()}</td>
                    <td className="p-4 font-bold text-gray-900">{lead.first_name}</td>
                    <td className="p-4 text-gray-600 font-mono text-sm">{lead.phone}</td>
                    <td className="p-4 text-sm text-gray-500 capitalize">{lead.source.replace("_", " ")}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
