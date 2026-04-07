import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import TrackingProvider from "@/components/TrackingProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Pack Nokia 105 + M10 - Offre Spéciale Maroc",
  description: "Profitez du pack complet Nokia 105, Ecouteurs M10, et Cadeaux. Livraison partout au Maroc. Paiement à la livraison.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased min-h-screen flex flex-col relative w-full">
        <TrackingProvider>
          {children}
        </TrackingProvider>
      </body>
    </html>
  );
}
