"use server";

import { supabase } from "@/lib/supabase";

export async function createLead(formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData);

    if (!rawData.first_name || !rawData.phone) {
      return { success: false, message: "Nom et téléphone sont obligatoires." };
    }

    const { error } = await supabase.from("leads").insert([
      {
        first_name: rawData.first_name,
        phone: rawData.phone,
        source: rawData.source || "gift_popup"
      }
    ]);

    if (error) throw error;

    return { success: true, message: "Cadeau débloqué !" };

  } catch (error) {
    console.error("Lead creation failed:", error);
    return { success: false, message: "Erreur lors de l'enregistrement." };
  }
}
