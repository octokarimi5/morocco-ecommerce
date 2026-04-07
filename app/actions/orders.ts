"use server";

import { supabase } from "@/lib/supabase";

function generateOrderNumber() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'MA-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function createOrder(formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData);
    
    // Basic server-side validation
    if (!rawData.customer_name || !rawData.customer_phone || !rawData.city || !rawData.address_line) {
      return { success: false, message: "Veuillez remplir tous les champs obligatoires." };
    }

    // In a real production setup, we should query the database for the exact price
    // associated with the offer_id. Here we hardcode mapping for simplicity based on the config.
    const selectedOfferId = rawData.offer_id as string;
    let price = 249;
    let quantity = 1;
    
    if (selectedOfferId === "offre-2") {
      price = 449;
      quantity = 2;
    } else if (selectedOfferId === "offre-3") {
      price = 649;
      quantity = 3;
    }

    const orderNumber = generateOrderNumber();

    // Insert into Supabase Orders table
    const { data, error } = await supabase.from("orders").insert([
      {
        order_number: orderNumber,
        status: "new",
        customer_name: rawData.customer_name,
        customer_phone: rawData.customer_phone,
        city: rawData.city,
        address_line: rawData.address_line,
        notes: rawData.notes || "",
        quantity: quantity,
        // offer_id would be passed here if synced with the DB uuid mapping
        subtotal_mad: price,
        shipping_mad: 0,
        total_mad: price
      }
    ]);

    if (error) {
       console.error("Supabase insert error:", error);
       throw error;
    }

    return { 
      success: true, 
      message: "Commande confirmée", 
      orderNumber 
    };

  } catch (error: any) {
    console.error("Order creation failed:", error);
    return { success: false, message: "Une erreur s'est produite lors de l'enregistrement de votre commande." };
  }
}
