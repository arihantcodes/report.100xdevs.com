import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "100xDevs",
  description: "Join Our courses and get the firsthand knowledge about web and web3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`inter.className bg-black text-white` }>
      <Analytics/>
        
        {children}</body>
      
    </html>
  );
}
