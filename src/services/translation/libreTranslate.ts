import {
  LIBRE_TRANSLATE_INSTANCES,
  MYMEMORY_API,
  RATE_LIMIT,
  CACHE_SETTINGS,
  ERROR_MESSAGES,
} from './config';

// Cache interface
interface TranslationCache {
  [key: string]: {
    text: string;
    timestamp: number;
  };
}

// Rate limiting interface
interface RateLimitState {
  requests: number;
  lastReset: number;
}

// Cache for translations
const translationCache: TranslationCache = {};
const rateLimitState: RateLimitState = {
  requests: 0,
  lastReset: Date.now(),
};

// Helper function to check cache
const getCachedTranslation = (key: string): string | null => {
  const cached = translationCache[key];
  if (cached && Date.now() - cached.timestamp < CACHE_SETTINGS.duration) {
    return cached.text;
  }
  return null;
};

// Helper function to set cache
const setCachedTranslation = (key: string, text: string): void => {
  // Clean up old cache entries if we're at the limit
  const cacheKeys = Object.keys(translationCache);
  if (cacheKeys.length >= CACHE_SETTINGS.maxSize) {
    const oldestKey = cacheKeys.reduce((oldest, current) => 
      translationCache[current].timestamp < translationCache[oldest].timestamp ? current : oldest
    );
    delete translationCache[oldestKey];
  }
  
  translationCache[key] = {
    text,
    timestamp: Date.now(),
  };
};

// Helper function to check rate limit
const checkRateLimit = (): boolean => {
  const now = Date.now();
  if (now - rateLimitState.lastReset >= RATE_LIMIT.cooldownPeriod) {
    rateLimitState.requests = 0;
    rateLimitState.lastReset = now;
  }
  
  if (rateLimitState.requests >= RATE_LIMIT.requestsPerMinute) {
    return false;
  }
  
  rateLimitState.requests++;
  return true;
};

// Helper function to try LibreTranslate instances
const tryLibreTranslate = async (
  text: string,
  source: string,
  target: string,
  instance: string
): Promise<string> => {
  try {
    const response = await fetch(`${instance}/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source,
        target,
      }),
    });

    if (!response.ok) {
      throw new Error('Translation failed');
    }

    const data = await response.json();
    return data.translatedText;
  } catch (error) {
    console.error(`Translation error with instance ${instance}:`, error);
    throw error;
  }
};

// Helper function to try MyMemory fallback
const tryMyMemoryFallback = async (
  text: string,
  source: string,
  target: string
): Promise<string> => {
  try {
    const response = await fetch(
      `${MYMEMORY_API}?q=${encodeURIComponent(text)}&langpair=${source}|${target}`
    );

    if (!response.ok) {
      throw new Error('Fallback translation failed');
    }

    const data = await response.json();
    return data.responseData.translatedText;
  } catch (error) {
    console.error('Fallback translation error:', error);
    throw error;
  }
};

// LibreTranslate API endpoint
const LIBRE_TRANSLATE_API = 'https://libretranslate.de/translate';

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

// Translate text to English
export const translateToEnglish = async (text: string, fromLanguage: string): Promise<string> => {
  const cacheKey = `to_en_${fromLanguage}_${text}`;
  const cached = getCachedTranslation(cacheKey);
  if (cached) return cached;

  if (!checkRateLimit()) {
    throw new Error(ERROR_MESSAGES.RATE_LIMIT);
  }

  let lastError: Error | null = null;

  // Try each LibreTranslate instance
  for (const instance of LIBRE_TRANSLATE_INSTANCES) {
    try {
      const translatedText = await tryLibreTranslate(text, fromLanguage, 'en', instance);
      setCachedTranslation(cacheKey, translatedText);
      return translatedText;
    } catch (error) {
      lastError = error as Error;
      console.warn(`Failed with instance ${instance}, trying next...`);
    }
  }

  // If all LibreTranslate instances fail, try MyMemory fallback
  try {
    const translatedText = await tryMyMemoryFallback(text, fromLanguage, 'en');
    setCachedTranslation(cacheKey, translatedText);
    return translatedText;
  } catch (error) {
    console.error('All translation services failed:', error);
    throw new Error(ERROR_MESSAGES.FALLBACK_FAILED);
  }
};

// Translate text from English
export const translateFromEnglish = async (text: string, toLanguage: string): Promise<string> => {
  const cacheKey = `from_en_${toLanguage}_${text}`;
  const cached = getCachedTranslation(cacheKey);
  if (cached) return cached;

  if (!checkRateLimit()) {
    throw new Error(ERROR_MESSAGES.RATE_LIMIT);
  }

  let lastError: Error | null = null;

  // Try each LibreTranslate instance
  for (const instance of LIBRE_TRANSLATE_INSTANCES) {
    try {
      const translatedText = await tryLibreTranslate(text, 'en', toLanguage, instance);
      setCachedTranslation(cacheKey, translatedText);
      return translatedText;
    } catch (error) {
      lastError = error as Error;
      console.warn(`Failed with instance ${instance}, trying next...`);
    }
  }

  // If all LibreTranslate instances fail, try MyMemory fallback
  try {
    const translatedText = await tryMyMemoryFallback(text, 'en', toLanguage);
    setCachedTranslation(cacheKey, translatedText);
    return translatedText;
  } catch (error) {
    console.error('All translation services failed:', error);
    throw new Error(ERROR_MESSAGES.FALLBACK_FAILED);
  }
};

// Translate between any two languages
export const translateBetweenLanguages = async (
  text: string,
  fromLanguage: string,
  toLanguage: string
): Promise<string> => {
  const cacheKey = `${fromLanguage}_${toLanguage}_${text}`;
  const cached = getCachedTranslation(cacheKey);
  if (cached) return cached;

  if (!checkRateLimit()) {
    throw new Error(ERROR_MESSAGES.RATE_LIMIT);
  }

  let lastError: Error | null = null;

  // Try each LibreTranslate instance
  for (const instance of LIBRE_TRANSLATE_INSTANCES) {
    try {
      const translatedText = await tryLibreTranslate(text, fromLanguage, toLanguage, instance);
      setCachedTranslation(cacheKey, translatedText);
      return translatedText;
    } catch (error) {
      lastError = error as Error;
      console.warn(`Failed with instance ${instance}, trying next...`);
    }
  }

  // If all LibreTranslate instances fail, try MyMemory fallback
  try {
    const translatedText = await tryMyMemoryFallback(text, fromLanguage, toLanguage);
    setCachedTranslation(cacheKey, translatedText);
    return translatedText;
  } catch (error) {
    console.error('All translation services failed:', error);
    throw new Error(ERROR_MESSAGES.FALLBACK_FAILED);
  }
};

// Detect language
export const detectLanguage = async (text: string): Promise<string> => {
  let lastError: Error | null = null;

  // Try each LibreTranslate instance
  for (const instance of LIBRE_TRANSLATE_INSTANCES) {
    try {
      const response = await fetch(`${instance}/detect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
        }),
      });

      if (!response.ok) {
        throw new Error('Language detection failed');
      }

      const data = await response.json();
      return data[0].language;
    } catch (error) {
      lastError = error as Error;
      console.warn(`Failed with instance ${instance}, trying next...`);
    }
  }

  // If all instances fail, return English as default
  console.warn('Language detection failed, defaulting to English');
  return 'en';
}; 