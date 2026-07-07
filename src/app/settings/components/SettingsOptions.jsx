"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LanguageIcon,
  SwatchIcon,
  ArrowRightOnRectangleIcon,
  ChevronRightIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon
} from "@heroicons/react/24/outline";
import { signOut } from "next-auth/react";
import { useTheme } from "../../../contexts/ThemeContext";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@heroui/react";

export default function SettingsOptions() {
  const { theme, setTheme } = useTheme();
  const [expandedOption, setExpandedOption] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState("en");

  const languages = [
    { code: "af", name: "Afrikaans" },
    { code: "sq", name: "Albanian (Shqip)" },
    { code: "am", name: "Amharic (አማርኛ)" },
    { code: "ar", name: "Arabic (العربية)" },
    { code: "hy", name: "Armenian (Հայերեն)" },
    { code: "az", name: "Azerbaijani (Azərbaycan)" },
    { code: "eu", name: "Basque (Euskara)" },
    { code: "be", name: "Belarusian (Беларуская)" },
    { code: "bn", name: "Bengali (বাংলা)" },
    { code: "bs", name: "Bosnian (Bosanski)" },
    { code: "bg", name: "Bulgarian (Български)" },
    { code: "ca", name: "Catalan (Català)" },
    { code: "ceb", name: "Cebuano" },
    { code: "ny", name: "Chichewa" },
    { code: "zh-CN", name: "Chinese Simplified (中文简体)" },
    { code: "zh-TW", name: "Chinese Traditional (中文繁體)" },
    { code: "co", name: "Corsican (Corsu)" },
    { code: "hr", name: "Croatian (Hrvatski)" },
    { code: "cs", name: "Czech (Čeština)" },
    { code: "da", name: "Danish (Dansk)" },
    { code: "nl", name: "Dutch (Nederlands)" },
    { code: "en", name: "English" },
    { code: "eo", name: "Esperanto" },
    { code: "et", name: "Estonian (Eesti)" },
    { code: "tl", name: "Filipino (Tagalog)" },
    { code: "fi", name: "Finnish (Suomi)" },
    { code: "fr", name: "French (Français)" },
    { code: "fy", name: "Frisian (Frysk)" },
    { code: "gl", name: "Galician (Galego)" },
    { code: "ka", name: "Georgian (ქართული)" },
    { code: "de", name: "German (Deutsch)" },
    { code: "el", name: "Greek (Ελληνικά)" },
    { code: "gu", name: "Gujarati (ગુજરાતી)" },
    { code: "ht", name: "Haitian Creole (Kreyòl Ayisyen)" },
    { code: "ha", name: "Hausa" },
    { code: "haw", name: "Hawaiian (ʻŌlelo Hawaiʻi)" },
    { code: "iw", name: "Hebrew (עברית)" },
    { code: "hi", name: "Hindi (हिन्दी)" },
    { code: "hmn", name: "Hmong" },
    { code: "hu", name: "Hungarian (Magyar)" },
    { code: "is", name: "Icelandic (Íslenska)" },
    { code: "ig", name: "Igbo" },
    { code: "id", name: "Indonesian (Bahasa Indonesia)" },
    { code: "ga", name: "Irish (Gaeilge)" },
    { code: "it", name: "Italian (Italiano)" },
    { code: "ja", name: "Japanese (日本語)" },
    { code: "jw", name: "Javanese (Basa Jawa)" },
    { code: "kn", name: "Kannada (ಕನ್ನಡ)" },
    { code: "kk", name: "Kazakh (Қазақ тілі)" },
    { code: "km", name: "Khmer (ភាសាខ្មែរ)" },
    { code: "rw", name: "Kinyarwanda" },
    { code: "ko", name: "Korean (한국어)" },
    { code: "ku", name: "Kurdish (Kurmancî)" },
    { code: "ky", name: "Kyrgyz (Кыргызча)" },
    { code: "lo", name: "Lao (ភាសាខ្មဲរ)" },
    { code: "la", name: "Latin (Latina)" },
    { code: "lv", name: "Latvian (Latviešu)" },
    { code: "lt", name: "Lithuanian (Lietuvių)" },
    { code: "lb", name: "Luxembourgish (Lëtzebuergesch)" },
    { code: "mk", name: "Macedonian (Македонски)" },
    { code: "mg", name: "Malagasy" },
    { code: "ms", name: "Malay (Bahasa Melayu)" },
    { code: "ml", name: "Malayalam (മലയാളം)" },
    { code: "mt", name: "Maltese (Malti)" },
    { code: "mi", name: "Maori (Māori)" },
    { code: "mr", name: "Marathi (मराठी)" },
    { code: "mn", name: "Mongolian (Монгол)" },
    { code: "my", name: "Myanmar (Burmese) (မြန်မာ)" },
    { code: "ne", name: "Nepali (नेपाली)" },
    { code: "no", name: "Norwegian (Norsk)" },
    { code: "or", name: "Odia (Oriya) (ଓଡ଼ିଆ)" },
    { code: "ps", name: "Pashto (پښتو)" },
    { code: "fa", name: "Persian (فارسی)" },
    { code: "pl", name: "Polish (Polski)" },
    { code: "pt", name: "Portuguese (Português)" },
    { code: "pa", name: "Punjabi (ਪੰਜਾਬੀ)" },
    { code: "ro", name: "Romanian (Română)" },
    { code: "ru", name: "Russian (Русский)" },
    { code: "sm", name: "Samoan (Gagana Sāmoa)" },
    { code: "gd", name: "Scots Gaelic (Gàidhlig)" },
    { code: "sr", name: "Serbian (Српски)" },
    { code: "st", name: "Sesotho" },
    { code: "sn", name: "Shona (Chishona)" },
    { code: "sd", name: "Sindhi (سنڌي)" },
    { code: "si", name: "Sinhala (සිංහල)" },
    { code: "sk", name: "Slovak (Slovenčina)" },
    { code: "sl", name: "Slovenian (Slovenščina)" },
    { code: "so", name: "Somali (Soomaali)" },
    { code: "es", name: "Spanish (Español)" },
    { code: "su", name: "Sundanese" },
    { code: "sw", name: "Swahili (Kiswahili)" },
    { code: "sv", name: "Swedish (Svenska)" },
    { code: "tg", name: "Tajik (Тоҷикӣ)" },
    { code: "ta", name: "Tamil (தமிழ்)" },
    { code: "tt", name: "Tatar (Татар)" },
    { code: "te", name: "Telugu (తెలుగు)" },
    { code: "th", name: "Thai (ไทย)" },
    { code: "tr", name: "Turkish (Türkçe)" },
    { code: "tk", name: "Turkmen (Türkmençe)" },
    { code: "uk", name: "Ukrainian (Українська)" },
    { code: "ur", name: "Urdu (اردو)" },
    { code: "ug", name: "Uyghur (ئۇيغۇرچە)" },
    { code: "uz", name: "Uzbek (O'zbek)" },
    { code: "vi", name: "Vietnamese (Tiếng Việt)" },
    { code: "cy", name: "Welsh (Cymraeg)" },
    { code: "xh", name: "Xhosa (isiXhosa)" },
    { code: "yi", name: "Yiddish (ייִديش)" },
    { code: "yo", name: "Yoruba (Yorùbá)" },
    { code: "zu", name: "Zulu (isiZulu)" }
  ];

  useEffect(() => {
    // Syncing Google Translate
    const storedLang = localStorage.getItem("language") || "en";
    setCurrentLanguage(storedLang);

    const timer = setInterval(() => {
      const googleSelect = document.querySelector("select.goog-te-combo");
      if (googleSelect) {
        let targetVal = storedLang;
        // by default set to english
        if (storedLang === "en") {
          targetVal = "";
        }
        
        googleSelect.value = targetVal;
        googleSelect.dispatchEvent(new Event("change"));
        clearInterval(timer);
      }
    }, 500);

    return () => clearInterval(timer);
  }, []);

  const handleLanguageChange = (langCode) => {
    setCurrentLanguage(langCode);
    const cookieValue = langCode === "en" ? "" : `/en/${langCode}`;

    // Clear any existing cookies first
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + window.location.hostname;

    if (langCode !== "en") {
      document.cookie = `googtrans=${cookieValue}; path=/;`;
      document.cookie = `googtrans=${cookieValue}; path=/; domain=${window.location.hostname}`;
    }

    localStorage.setItem("language", langCode);
    
    if (langCode === "en") {
      // For the original language,the user can just refresh the page
      window.location.reload();
    } else {
      // Soft translation refresh without page reloading
      const googleSelect = document.querySelector("select.goog-te-combo");
      if (googleSelect) {
        googleSelect.value = langCode;
        googleSelect.dispatchEvent(new Event("change"));
      }
    }
  };

  const handleOptionClick = (optionId) => {
    if (expandedOption === optionId) {
      setExpandedOption(null);
    } else {
      setExpandedOption(optionId);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.1 }}
      className="mt-6 flex flex-col gap-3"
    >
      {/*  LANGUAGE OPTION  */}
      <div className="bg-white/70 dark:bg-[#0F122B]/60 backdrop-blur-xl border border-white dark:border-white/5 rounded-2xl shadow-lg overflow-hidden transition-all duration-300">
        <button
          onClick={() => handleOptionClick("language")}
          className="w-full p-4 flex items-center justify-between group focus:outline-none"
        >
          <div className="flex items-center gap-4">
            <div className="bg-blue-500/10 text-blue-500 dark:text-blue-400 p-2.5 rounded-xl">
              <LanguageIcon className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="font-bold text-[#111844] dark:text-[#F9F7F7] block">Language</span>
              <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <span>Active:</span>
                <span className="notranslate font-bold" translate="no">
                  {languages.find(l => l.code === currentLanguage)?.name || "English"}
                </span>
              </span>
            </div>
          </div>
          <ChevronRightIcon className={`w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-[#792CA2] dark:group-hover:text-[#C084FC] transition-transform ${expandedOption === "language" ? "rotate-90 text-[#792CA2] dark:text-[#C084FC]" : ""}`} />
        </button>

        <AnimatePresence initial={false}>
          {expandedOption === "language" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/30 p-4 flex flex-col gap-2"
            >
              <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                Select Language
              </label>

              <Dropdown placement="bottom-start" className="notranslate">
                <DropdownTrigger>
                  <Button
                    variant="bordered"
                    size="md"
                    className="notranslate w-full bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-[#111844] dark:text-[#F9F7F7] font-bold rounded-xl text-xs shadow-sm hover:bg-gray-50 dark:hover:bg-slate-750 flex justify-between items-center px-4"
                    translate="no"
                  >
                    <span className="notranslate" translate="no">{languages.find(l => l.code === currentLanguage)?.name || "English"}</span>
                    <span className="text-gray-400 text-[10px]">▼</span>
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Select Language"
                  variant="flat"
                  disallowEmptySelection
                  selectionMode="single"
                  selectedKeys={new Set([currentLanguage])}
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0];
                    handleLanguageChange(selectedKey);
                  }}
                  className="notranslate max-h-60 overflow-y-auto"
                  translate="no"
                >
                  {languages.map((lang) => (
                    <DropdownItem
                      key={lang.code}
                      className="notranslate text-xs font-bold text-[#111844] dark:text-gray-300"
                      translate="no"
                    >
                      {lang.name}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/*  THEME OPTION  */}
      <div className="bg-white/70 dark:bg-[#0F122B]/60 backdrop-blur-xl border border-white dark:border-white/5 rounded-2xl shadow-lg overflow-hidden transition-all duration-300">
        <button
          onClick={() => handleOptionClick("theme")}
          className="w-full p-4 flex items-center justify-between group focus:outline-none"
        >
          <div className="flex items-center gap-4">
            <div className="bg-orange-500/10 text-orange-500 dark:text-orange-400 p-2.5 rounded-xl">
              <SwatchIcon className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="font-bold text-[#111844] dark:text-[#F9F7F7] block">Theme Mode</span>
              <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                Active: {theme}
              </span>
            </div>
          </div>
          <ChevronRightIcon className={`w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-[#792CA2] dark:group-hover:text-[#C084FC] transition-transform ${expandedOption === "theme" ? "rotate-90 text-[#792CA2] dark:text-[#C084FC]" : ""}`} />
        </button>

        <AnimatePresence initial={false}>
          {expandedOption === "theme" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/30 p-4"
            >
              <div className="flex flex-col gap-2">
                {[
                  { id: "light", label: "Light Theme", icon: SunIcon },
                  { id: "dark", label: "Dark Theme", icon: MoonIcon },
                  { id: "system", label: "System Default", icon: ComputerDesktopIcon },
                ].map((mode) => {
                  const Icon = mode.icon;
                  const isActive = theme === mode.id;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => setTheme(mode.id)}
                      className={`w-full p-3 rounded-xl text-xs font-bold transition-all border flex items-center gap-3 ${
                        isActive
                          ? "bg-[#792CA2] border-[#792CA2] text-white shadow-sm"
                          : "bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 text-gray-600 dark:text-gray-300 hover:border-[#792CA2]/30 dark:hover:border-[#C084FC]/30"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{mode.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/*  LOGOUT OPTION  */}
      <motion.button
        whileHover={{ scale: 1.01, x: 2 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => signOut({ callbackUrl: "/auth/signin" })}
        className="w-full bg-red-50/80 dark:bg-red-950/20 backdrop-blur-xl border border-red-100 dark:border-red-900/30 p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-between group mt-2"
      >
        <div className="flex items-center gap-4">
          <div className="bg-red-500/10 text-red-500 p-2.5 rounded-xl group-hover:bg-red-500 group-hover:text-white transition-colors">
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
          </div>
          <span className="font-bold text-red-600 dark:text-red-400">Log out</span>
        </div>
      </motion.button>
    </motion.div>
  );
}
