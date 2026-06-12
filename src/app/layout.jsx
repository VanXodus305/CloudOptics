import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import Provider from "@/contexts/Provider";

const geistMono = Geist_Mono({
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "CloudOptics",
  description: "A tool to help you understand and optimize your cloud costs.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-background text-primary">
      <body className={`${inter.className} ${geistMono.className}`}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
