/* Locale registry for BioExcela Global.
 *
 * The whole page is translated at runtime by the Google Translate element,
 * which reaches every string on the page — headings, cards, modal bodies, FAQ
 * answers — rather than only the ones we hand-authored. This file supplies the
 * branded picker: which languages to offer, how to name them in their own
 * script, and which ones need right-to-left layout.
 *
 * Codes are Google Translate language codes, not ISO in every case
 * (zh-CN / zh-TW / tl / iw are Google's spellings).
 */

export type Locale = {
  code: string;
  label: string;   // in the language itself
  english: string; // so the list stays scannable
  flag: string;
  rtl?: boolean;
};

export type LocaleGroup = { region: string; locales: Locale[] };

export const localeGroups: LocaleGroup[] = [
  {
    region: "Asia Pacific",
    locales: [
      { code: "zh-CN", label: "简体中文",         english: "Chinese (Simplified)",  flag: "🇨🇳" },
      { code: "zh-TW", label: "繁體中文",         english: "Chinese (Traditional)", flag: "🇹🇼" },
      { code: "th",    label: "ไทย",              english: "Thai",                  flag: "🇹🇭" },
      { code: "vi",    label: "Tiếng Việt",       english: "Vietnamese",            flag: "🇻🇳" },
      { code: "tl",    label: "Filipino",          english: "Filipino",              flag: "🇵🇭" },
      { code: "id",    label: "Bahasa Indonesia",  english: "Indonesian",            flag: "🇮🇩" },
      { code: "ms",    label: "Bahasa Melayu",     english: "Malay",                 flag: "🇲🇾" },
      { code: "ja",    label: "日本語",            english: "Japanese",              flag: "🇯🇵" },
      { code: "ko",    label: "한국어",            english: "Korean",                flag: "🇰🇷" },
      { code: "km",    label: "ភាសាខ្មែរ",           english: "Khmer",                 flag: "🇰🇭" },
      { code: "lo",    label: "ລາວ",              english: "Lao",                   flag: "🇱🇦" },
      { code: "my",    label: "မြန်မာ",             english: "Burmese",               flag: "🇲🇲" },
      { code: "hi",    label: "हिन्दी",              english: "Hindi",                 flag: "🇮🇳" },
      { code: "bn",    label: "বাংলা",             english: "Bengali",               flag: "🇧🇩" },
      { code: "ta",    label: "தமிழ்",             english: "Tamil",                 flag: "🇱🇰" },
      { code: "si",    label: "සිංහල",            english: "Sinhala",               flag: "🇱🇰" },
      { code: "ne",    label: "नेपाली",             english: "Nepali",                flag: "🇳🇵" }
    ]
  },
  {
    region: "Middle East",
    locales: [
      { code: "ar", label: "العربية",  english: "Arabic",  flag: "🇦🇪", rtl: true },
      { code: "fa", label: "فارسی",    english: "Persian", flag: "🇮🇷", rtl: true },
      { code: "ur", label: "اردو",     english: "Urdu",    flag: "🇵🇰", rtl: true },
      { code: "iw", label: "עברית",    english: "Hebrew",  flag: "🇮🇱", rtl: true },
      { code: "tr", label: "Türkçe",   english: "Turkish", flag: "🇹🇷" }
    ]
  },
  {
    region: "Europe",
    locales: [
      { code: "es", label: "Español",     english: "Spanish",    flag: "🇪🇸" },
      { code: "fr", label: "Français",    english: "French",     flag: "🇫🇷" },
      { code: "de", label: "Deutsch",     english: "German",     flag: "🇩🇪" },
      { code: "it", label: "Italiano",    english: "Italian",    flag: "🇮🇹" },
      { code: "pt", label: "Português",   english: "Portuguese", flag: "🇵🇹" },
      { code: "nl", label: "Nederlands",  english: "Dutch",      flag: "🇳🇱" },
      { code: "pl", label: "Polski",      english: "Polish",     flag: "🇵🇱" },
      { code: "ru", label: "Русский",     english: "Russian",    flag: "🇷🇺" },
      { code: "uk", label: "Українська",  english: "Ukrainian",  flag: "🇺🇦" },
      { code: "el", label: "Ελληνικά",    english: "Greek",      flag: "🇬🇷" },
      { code: "sv", label: "Svenska",     english: "Swedish",    flag: "🇸🇪" },
      { code: "da", label: "Dansk",       english: "Danish",     flag: "🇩🇰" },
      { code: "no", label: "Norsk",       english: "Norwegian",  flag: "🇳🇴" },
      { code: "fi", label: "Suomi",       english: "Finnish",    flag: "🇫🇮" },
      { code: "cs", label: "Čeština",     english: "Czech",      flag: "🇨🇿" },
      { code: "sk", label: "Slovenčina",  english: "Slovak",     flag: "🇸🇰" },
      { code: "hu", label: "Magyar",      english: "Hungarian",  flag: "🇭🇺" },
      { code: "ro", label: "Română",      english: "Romanian",   flag: "🇷🇴" },
      { code: "bg", label: "Български",   english: "Bulgarian",  flag: "🇧🇬" },
      { code: "hr", label: "Hrvatski",    english: "Croatian",   flag: "🇭🇷" },
      { code: "sr", label: "Српски",      english: "Serbian",    flag: "🇷🇸" },
      { code: "sl", label: "Slovenščina", english: "Slovenian",  flag: "🇸🇮" },
      { code: "lt", label: "Lietuvių",    english: "Lithuanian", flag: "🇱🇹" },
      { code: "lv", label: "Latviešu",    english: "Latvian",    flag: "🇱🇻" },
      { code: "et", label: "Eesti",       english: "Estonian",   flag: "🇪🇪" }
    ]
  }
];

export const englishLocale: Locale = {
  code: "en", label: "English", english: "English", flag: "🇬🇧"
};

export const allLocales: Locale[] = [
  englishLocale,
  ...localeGroups.flatMap(g => g.locales)
];

/** Comma-separated list handed to the translate element. */
export const includedLanguages = allLocales.map(l => l.code).join(",");
