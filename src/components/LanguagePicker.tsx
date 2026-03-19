"use client";

import { useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Globe, X, Check } from "lucide-react";

type LanguageOption = {
  code: string;
  nativeName: string;
  englishName: string;
  flag: string;
};

const LANGUAGES: LanguageOption[] = [
  { code: "en",  nativeName: "English",      englishName: "English",        flag: "🇬🇧" },
  { code: "sq",  nativeName: "Shqip",        englishName: "Albanian",       flag: "🇦🇱" },
  { code: "rom", nativeName: "Romani",       englishName: "Romani",         flag: "🎡" },
  { code: "ro",  nativeName: "Română",       englishName: "Romanian",       flag: "🇷🇴" },
  { code: "hu",  nativeName: "Magyar",       englishName: "Hungarian",      flag: "🇭🇺" },
  { code: "sk",  nativeName: "Slovenčina",   englishName: "Slovak",         flag: "🇸🇰" },
  { code: "cs",  nativeName: "Čeština",      englishName: "Czech",          flag: "🇨🇿" },
  { code: "bg",  nativeName: "Български",    englishName: "Bulgarian",      flag: "🇧🇬" },
  { code: "sr",  nativeName: "Српски",       englishName: "Serbian",        flag: "🇷🇸" },
  { code: "hr",  nativeName: "Hrvatski",     englishName: "Croatian",       flag: "🇭🇷" },
  { code: "bs",  nativeName: "Bosanski",     englishName: "Bosnian",        flag: "🇧🇦" },
  { code: "mk",  nativeName: "Македонски",   englishName: "Macedonian",     flag: "🇲🇰" },
  { code: "sl",  nativeName: "Slovenščina",  englishName: "Slovenian",      flag: "🇸🇮" },
  { code: "el",  nativeName: "Ελληνικά",     englishName: "Greek",          flag: "🇬🇷" },
  { code: "tr",  nativeName: "Türkçe",       englishName: "Turkish",        flag: "🇹🇷" },
];

export function LanguagePicker() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();
  const t = useTranslations("language");
  const router = useRouter();
  const pathname = usePathname();

  const current = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0];

  function selectLanguage(code: string) {
    setOpen(false);
    startTransition(() => {
      // Strip current locale prefix and push with new locale
      const segments = pathname.split("/");
      // If current locale is in URL, remove it
      const cleanPath =
        segments[1] && LANGUAGES.some((l) => l.code === segments[1])
          ? "/" + segments.slice(2).join("/")
          : pathname;

      const newPath = code === "en" ? cleanPath || "/" : `/${code}${cleanPath}`;
      router.push(newPath);
      router.refresh();
    });
  }

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:shadow active:scale-95"
        aria-label={t("select")}
        disabled={isPending}
      >
        <Globe className="h-3.5 w-3.5 text-gray-500" />
        <span>{current.flag}</span>
        <span className="uppercase text-xs tracking-wide">{current.code}</span>
      </button>

      {/* Full-screen sheet */}
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col" onClick={() => setOpen(false)}>
          {/* Backdrop */}
          <div className="flex-1 bg-black/40 backdrop-blur-sm" />

          {/* Sheet */}
          <div
            className="mx-auto w-full max-w-lg rounded-t-3xl bg-white pb-safe-bottom"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="h-1 w-10 rounded-full bg-gray-200" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-3 pt-2">
              <h2 className="text-base font-semibold text-gray-900">{t("select")}</h2>
              <button
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Language list */}
            <ul className="max-h-[60vh] overflow-y-auto px-3 pb-6">
              {LANGUAGES.map((lang) => {
                const isActive = lang.code === locale;
                return (
                  <li key={lang.code}>
                    <button
                      onClick={() => selectLanguage(lang.code)}
                      className={`flex w-full items-center gap-3.5 rounded-2xl px-3 py-3 text-left transition-colors ${
                        isActive
                          ? "bg-[#FDF2F2] text-[#C0392B]"
                          : "text-gray-800 hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-2xl leading-none">{lang.flag}</span>
                      <span className="flex-1">
                        <span className="block text-sm font-semibold leading-tight">
                          {lang.nativeName}
                        </span>
                        <span className="block text-xs text-gray-400">{lang.englishName}</span>
                      </span>
                      {isActive && (
                        <Check className="h-4 w-4 flex-shrink-0 text-[#C0392B]" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
