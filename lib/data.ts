export const productData = {
  name: "Pack Nokia 105 + Écouteurs M10 + Cadeau",
  basePrice: 249,
  originalPrice: 299,
  description: "Le pack idéal : un téléphone Nokia durable avec 2 puces, couplé à des écouteurs sans fil M10 de haute qualité. Recevez une surprise (parfum ou sac) en cadeau !",
  rating: 4.9,
  reviewsCount: 124,
  features: [
    { title: "Batterie Longue Durée", description: "Jusqu'à 25 jours en veille.", icon: "Battery" },
    { title: "Double SIM", description: "Séparez votre travail et votre vie personnelle.", icon: "Smartphone" },
    { title: "Écouteurs Bluetooth 5.1", description: "Qualité sonore HD et 4h d'autonomie continue.", icon: "Headphones" },
    { title: "Solidité Nokia", description: "Matériaux premium résistants aux chocs.", icon: "Shield" },
  ],
  offers: [
    { id: "offre-1", title: "Pack Solo", count: 1, subtitle: "Idéal pour un essai", price: 249, badge: "", isBestValue: false },
    { id: "offre-2", title: "Pack Duo", count: 2, subtitle: "Pour vous et un proche", price: 449, badge: "Économisez 49 DH", isBestValue: true },
    { id: "offre-3", title: "Pack Famille", count: 3, subtitle: "Meilleur prix unitaire", price: 649, badge: "Économisez 98 DH", isBestValue: false },
  ],
  cities: [
    "Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir", "Meknès", "Oujda", "Kenitra", "Tétouan", "Salé", "Autre..."
  ]
};
