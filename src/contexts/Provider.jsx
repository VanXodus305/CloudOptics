"use client";

import { HeroUIProvider } from "@heroui/react";
import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ThemeProvider } from "./ThemeContext";

const Provider = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    if (document.getElementById("google-translate-script")) return;

    // Create the hidden Google Translate container div if it doesn't exist
    if (!document.getElementById("google_translate_element")) {
      const translateDiv = document.createElement("div");
      translateDiv.id = "google_translate_element";
      translateDiv.style.display = "none";
      document.body.appendChild(translateDiv);
    }

    // Setup global callback
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };

    // Load google translate script
    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <SessionProvider>
      <ThemeProvider>
        <HeroUIProvider navigate={router.push}>{children}</HeroUIProvider>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default Provider;
