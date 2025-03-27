import { translateToEnglish as libreTranslateToEnglish, translateFromEnglish as libreTranslateFromEnglish, detectLanguage as libreDetectLanguage } from '../translation/libreTranslate';

// Implement translation functions
export const translateToEnglish = async (text: string, fromLanguage: string = 'auto'): Promise<string> => {
  try {
    return await libreTranslateToEnglish(text, fromLanguage);
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text if translation fails
  }
};

export const translateFromEnglish = async (text: string, toLanguage: string): Promise<string> => {
  try {
    return await libreTranslateFromEnglish(text, toLanguage);
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text if translation fails
  }
};

export const detectLanguage = async (text: string): Promise<string> => {
  try {
    return await libreDetectLanguage(text);
  } catch (error) {
    console.error('Language detection error:', error);
    return 'en'; // Default to English if detection fails
  }
};
