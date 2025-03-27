// LibreTranslate instances
export const LIBRE_TRANSLATE_INSTANCES = [
  'https://libretranslate.de',
  'https://translate.argosopentech.com',
  'https://translate.terraprint.co',
  'https://translate.fortytwo-it.com',
  'https://translate.mentality.rip'
];

// Fallback service (MyMemory Translation API)
export const MYMEMORY_API = 'https://api.mymemory.translated.net/get';

// Rate limit settings
export const RATE_LIMIT = {
  requestsPerMinute: 30,
  cooldownPeriod: 60000, // 1 minute in milliseconds
};

// Cache settings
export const CACHE_SETTINGS = {
  duration: 24 * 60 * 60 * 1000, // 24 hours
  maxSize: 1000, // Maximum number of cached translations
};

// Error messages
export const ERROR_MESSAGES = {
  RATE_LIMIT: 'Translation service is temporarily unavailable. Please try again later.',
  SERVICE_DOWN: 'Translation service is currently down. Using fallback service.',
  FALLBACK_FAILED: 'All translation services are currently unavailable. Please try again later.',
  INVALID_LANGUAGE: 'Unsupported language combination.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  TIMEOUT: 'Translation request timed out.',
}; 