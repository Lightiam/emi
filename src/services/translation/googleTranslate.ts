interface TranslationResponse {
  data: {
    translations: Array<{
      translatedText: string;
      detectedSourceLanguage?: string;
    }>;
  };
}

interface TranslationCache {
  [key: string]: {
    text: string;
    timestamp: number;
  };
}

// Cache for translations
const translationCache: TranslationCache = {};
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Supported languages
export const SUPPORTED_LANGUAGES = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  pt: 'Portuguese',
  ru: 'Russian',
  ja: 'Japanese',
  ko: 'Korean',
  zh: 'Chinese',
  ar: 'Arabic',
  hi: 'Hindi',
  tr: 'Turkish',
  nl: 'Dutch',
  pl: 'Polish',
  sv: 'Swedish',
  da: 'Danish',
  fi: 'Finnish',
  el: 'Greek',
  hu: 'Hungarian',
  cs: 'Czech',
  ro: 'Romanian',
  sk: 'Slovak',
  uk: 'Ukrainian',
  he: 'Hebrew',
  id: 'Indonesian',
  ms: 'Malay',
  fa: 'Persian',
  th: 'Thai',
  vi: 'Vietnamese',
  bn: 'Bengali',
  ta: 'Tamil',
  ur: 'Urdu',
  te: 'Telugu',
  mr: 'Marathi',
  sw: 'Swahili',
  fil: 'Filipino',
  km: 'Khmer',
  ne: 'Nepali',
  si: 'Sinhala',
  my: 'Burmese',
  am: 'Amharic',
  zu: 'Zulu',
  xh: 'Xhosa',
  af: 'Afrikaans',
  ka: 'Georgian',
  fo: 'Faroese',
  is: 'Icelandic',
  mt: 'Maltese',
  ga: 'Irish',
  eu: 'Basque',
  lb: 'Luxembourgish',
  cy: 'Welsh',
  haw: 'Hawaiian',
  co: 'Corsican',
  hmn: 'Hmong',
  la: 'Latin',
  sd: 'Sindhi',
  iw: 'Hebrew',
  fy: 'Frisian',
  gd: 'Scots Gaelic',
  yi: 'Yiddish',
  sm: 'Samoan',
  gl: 'Galician',
  sn: 'Shona',
  hy: 'Armenian',
  jw: 'Javanese',
  su: 'Sundanese',
  ug: 'Uyghur',
  yo: 'Yoruba',
  so: 'Somali',
  pa: 'Punjabi',
  gu: 'Gujarati',
  or: 'Odia',
  tg: 'Tajik',
  tk: 'Turkmen',
  uz: 'Uzbek',
  ps: 'Pashto',
  dv: 'Divehi',
  ff: 'Fula',
  hr: 'Croatian',
  az: 'Azerbaijani',
  be: 'Belarusian',
  bs: 'Bosnian',
  ca: 'Catalan',
  ceb: 'Cebuano',
  ny: 'Chichewa',
  eo: 'Esperanto',
  tl: 'Filipino',
  ht: 'Haitian Creole',
  ha: 'Hausa',
  ig: 'Igbo',
  kn: 'Kannada',
  kk: 'Kazakh',
  ku: 'Kurdish',
  ky: 'Kyrgyz',
  lo: 'Lao',
  lv: 'Latvian',
  lt: 'Lithuanian',
  mk: 'Macedonian',
  mg: 'Malagasy',
  ml: 'Malayalam',
  mi: 'Maori',
  mn: 'Mongolian',
  no: 'Norwegian',
  sl: 'Slovenian',
  sr: 'Serbian',
  st: 'Sesotho'
};

// Helper function to check cache
const getCachedTranslation = (key: string): string | null => {
  const cached = translationCache[key];
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.text;
  }
  return null;
};

// Helper function to set cache
const setCachedTranslation = (key: string, text: string): void => {
  translationCache[key] = {
    text,
    timestamp: Date.now()
  };
};

export const translateToEnglish = async (text: string, fromLanguage: string): Promise<string> => {
  const cacheKey = `en-${fromLanguage}-${text}`;
  const cached = getCachedTranslation(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          target: 'en',
          source: fromLanguage,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Translation failed: ${response.statusText}`);
    }

    const data: TranslationResponse = await response.json();
    const translatedText = data.data.translations[0].translatedText;
    setCachedTranslation(cacheKey, translatedText);
    return translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
};

export const translateFromEnglish = async (text: string, toLanguage: string): Promise<string> => {
  const cacheKey = `${toLanguage}-en-${text}`;
  const cached = getCachedTranslation(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          target: toLanguage,
          source: 'en',
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Translation failed: ${response.statusText}`);
    }

    const data: TranslationResponse = await response.json();
    const translatedText = data.data.translations[0].translatedText;
    setCachedTranslation(cacheKey, translatedText);
    return translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
};

export const translateBetweenLanguages = async (text: string, fromLanguage: string, toLanguage: string): Promise<string> => {
  const cacheKey = `${toLanguage}-${fromLanguage}-${text}`;
  const cached = getCachedTranslation(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          target: toLanguage,
          source: fromLanguage,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Translation failed: ${response.statusText}`);
    }

    const data: TranslationResponse = await response.json();
    const translatedText = data.data.translations[0].translatedText;
    setCachedTranslation(cacheKey, translatedText);
    return translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
};

export const detectLanguage = async (text: string): Promise<string> => {
  try {
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2/detect?key=${import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Language detection failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data.detections[0][0].language;
  } catch (error) {
    console.error('Language detection error:', error);
    throw error;
  }
}; 