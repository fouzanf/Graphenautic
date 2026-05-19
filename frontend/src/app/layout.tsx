import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Graphenautic — Intelligent Research Architecture",
  description: "Transform your documents into living knowledge graphs with GraphRAG, Gemini, and Neo4j.",
};

import AuthProvider from "@/components/AuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} dark antialiased`}>
      <body className="min-h-screen flex flex-col bg-background text-foreground font-sans antialiased">
        <div className="noise-overlay" />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}


