import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Website Audit Agent | Smart Insight Reports",
  description: "Get comprehensive AI-powered website audits for performance, SEO, accessibility, and security headers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#020617] text-white min-h-screen`}
      >
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <footer className="py-8 text-center text-slate-500 text-sm border-t border-slate-800">
              © {new Date().getFullYear()} AI Audit Agent. All rights reserved.
            </footer>
          </div>
          <Toaster position="top-center" expand={true} richColors invert theme="dark" />
        </Providers>
      </body>
    </html>
  );
}
