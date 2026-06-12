import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import Provider from "@/contexts/Provider";
import { Plus_Jakarta_Sans } from "next/font/google";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
});

export const metadata = {
  title: "CloudOptics",
  description: "A tool to help you understand and optimize your cloud costs.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={jakarta.className}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
