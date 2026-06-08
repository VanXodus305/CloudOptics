import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
// @ts-expect-error - Ignore import error for now, as this is a Next.js 15 app and the import path is correct.
import "./globals.css";
import Provider from "@/contexts/Provider";

const geistMono = Geist_Mono({
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CloudOptics",
  description: "A tool to help you understand and optimize your cloud costs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-background text-primary">
      <body className={`${inter.className} ${geistMono.className}`}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
