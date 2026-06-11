import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
});

export const metadata = {
  title: "CloudOptics",
  description: "Cloud Cost Optimization Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={jakarta.className}>
        {children}
      </body>
    </html>
  );
}