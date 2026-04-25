import type { Metadata } from "next";
import { generateSEO } from '@/lib/seo-utils';
import prisma from '@/lib/prisma';
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { CartProvider } from "@/context/CartContext";
import Script from "next/script";
import LayoutWrapper from "@/components/LayoutWrapper";
import GoogleAnalytics from '@/components/GoogleAnalytics';
import { ToastProvider } from "@/context/ToastContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { RecentlyViewedProvider } from "@/context/RecentlyViewedContext";
import SocialProof from "@/components/SocialProof/SocialProof";
import GeoDelivery from "@/components/GeoDelivery/GeoDelivery";

export const metadata: Metadata = {
  metadataBase: new URL("https://officialfusionshroombars.com"),
  manifest: '/manifest.json',
  title: {
    default: "Official Fusion Shroom Bars | Authentic Fusion Mushroom Chocolate",
    template: "%s | Official Fusion Shroom Bars"
  },
  description: "The Official Fusion Shroom Bars website. Experience the gold standard of fusion mushroom chocolate bars and gummies. Authentic psilocybin edibles for focus and wellness. Shipping to USA, UK, Canada, Australia, and Europe.",
  keywords: [
    "fusion bars", "fusion shroom bars", "fusion mushroom bars", "neau tropics", 
    "fusion chocolate bar", "fusion shroom bar", "fusion chocolate", "buy neau tropics", 
    "fusion mushroom chocolate", "neau tropics chocolate", "fusion chocolate mushroom",
    "fusion chocolate bars", "fusion chocolates", "fusion mushroom chocolate bar",
    "fusion mushroom chocolate bars", "fusion bar", "fusion mushroom bar", 
    "fusion shroom chocolate", "fusion bars mushroom", "where to buy fusion bars",
    "magic mushroom chocolate", "psilocybin edibles", "mushroom gummies", "buy shroom bars online",
    "microdosing chocolate", "psilocybin chocolate bar", "mushroom chocolate bar for sale",
    "lab tested mushroom chocolate", "discreet mushroom shipping", "buy psilocybin online",
    "magic mushroom edibles", "shroom chocolate", "psychedelic chocolate bar",
    "mushroom extract chocolate", "functional mushroom bar", "premium shroom bars"
  ],
  authors: [{ name: "Fusion Team" }],
  creator: "Fusion Shroom Bars",
  publisher: "Fusion Shroom Bars",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://officialfusionshroombars.com",
    siteName: "Official Fusion Shroom Bars",
    title: "Official Fusion Shroom Bars | Premium Magic Mushroom Chocolate & Gummies",
    description: "The Gold Standard in Mushroom Infusions. Gourmet chocolate and gummies with premium psilocybin extract.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Official Fusion Shroom Bars",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Official Fusion Shroom Bars | Premium Magic Mushroom Chocolate",
    description: "Premium mushroom-infused chocolate and gummies. Worldwide shipping.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://officialfusionshroombars.com',
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Official Fusion Shroom Bars",
  "url": "https://officialfusionshroombars.com",
  "logo": "https://officialfusionshroombars.com/logo.png", // Assuming logo.png exists
  "sameAs": [
    "https://twitter.com/fusionshroombar", // Placeholders
    "https://instagram.com/officialfusionshroombar"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "",
    "contactType": "customer service",
    "email": "order@officialfusionshroombars.com"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="bg-background text-foreground">
        <GeoDelivery />
        <GoogleAnalytics ga_id="G-403953413" />
        <ToastProvider>
          <WishlistProvider>
            <RecentlyViewedProvider>
              <CartProvider>
                <LayoutWrapper>
                  {children}
                </LayoutWrapper>
              </CartProvider>
            </RecentlyViewedProvider>
          </WishlistProvider>
        </ToastProvider>
        
        <SocialProof />
        
        {/* Smartsupp Live Chat script */}
        <Script id="smartsupp-chat" strategy="afterInteractive">
          {`
            var _smartsupp = _smartsupp || {};
            _smartsupp.key = '066c33c30d5a0cddcfb7a8750f96fe6b77709e72';
            if (window.innerWidth <= 768) {
              _smartsupp.offsetY = 80;
            }
            window.smartsupp||(function(d) {
              var s,c,o=smartsupp=function(){ o._.push(arguments)};o._=[];
              s=d.getElementsByTagName('script')[0];c=d.createElement('script');
              c.type='text/javascript';c.charset='utf-8';c.async=true;
              c.src='https://www.smartsuppchat.com/loader.js?';s.parentNode.insertBefore(c,s);
            })(document);
          `}
        </Script>
      </body>
    </html>
  );
}
