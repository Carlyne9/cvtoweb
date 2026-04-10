import type { Metadata } from "next";
import { Source_Sans_3, Geist_Mono } from "next/font/google";
import "./globals.css";

const sourceSans3 = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CV to Web - Transform Your CV into a Portfolio Website",
  description: "Upload your CV and instantly get a beautiful portfolio website with a shareable link. No coding required.",
  keywords: ["CV", "resume", "portfolio", "website builder", "career"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sourceSans3.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
