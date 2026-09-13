import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  variable: "--font-recomecar-sans",
  subsets: ["latin"],
  display: "swap",
});

const display = Fraunces({
  variable: "--font-recomecar-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Recomeçar — uma nova história pode começar hoje",
  description:
    "Conheça pessoas, crie conexões e descubra novas possibilidades. O Recomeçar é uma plataforma de relacionamento feita para quem acredita em novas chances.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${sans.variable} ${display.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
