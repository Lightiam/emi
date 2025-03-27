import { translateToEnglish as libreTranslateToEnglish, translateFromEnglish as libreTranslateFromEnglish, detectLanguage as libreDetectLanguage } from '../translation/libreTranslate';

// Re-export the translation functions with unique names
export const translateToEnglish = libreTranslateToEnglish;
export const translateFromEnglish = libreTranslateFromEnglish;
export const detectLanguage = libreDetectLanguage;
