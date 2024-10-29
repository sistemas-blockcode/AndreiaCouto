import type { Metadata } from "next";
import { Toaster } from "@/app/components/ui/toaster";
import "./globals.css";

export const metadata: Metadata = {
  title: "Andreia Couto - Terapeuta Holística",
  description: "Renascer, mude sua vida em 11 semanas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ptBR">
      <body
        className={`antialiased bg-[#F1F4FB]`}>{children} <Toaster />
      </body>
    </html>
  );
}
