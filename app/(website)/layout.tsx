import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import { Header } from "@/components/layout/website/Header";
import { Footer } from "@/components/layout/website/Footer";
import { CartProvider } from "@/contexts/CardContext";

export const metadata: Metadata = {
  title: "BookMyTourGuide",
  description:
    "Connect with certified local guides for authentic eco tours, heritage walks, cooking classes, and cultural experiences worldwide.",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <CartProvider>
          <Header />
          <Suspense fallback={null}>{children}</Suspense>
          <Footer />
          <Analytics />
        </CartProvider>
  );
}
