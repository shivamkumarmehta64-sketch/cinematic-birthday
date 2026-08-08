import type { Metadata } from "next";
import { Cormorant_Garamond, Quicksand } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});

const quicksand = Quicksand({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-quicksand",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Happy Birthday",
  description: "A special surprise website",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${quicksand.variable} h-full antialiased`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
