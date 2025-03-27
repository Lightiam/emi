
import { regionToLanguages, languageDetectionPatterns, supportedLanguages } from './languageData';
import { processRegionalQuery } from '../db';

// Language detection based on text and geolocation
export const detectLanguage = (text: string, locationHint?: string): string => {
  // If location hint is provided, prioritize languages from that region
  if (locationHint) {
    const normalizedLocation = locationHint.toLowerCase();
    
    // Check for direct city/region match
    for (const [region, languages] of Object.entries(regionToLanguages)) {
      if (normalizedLocation.includes(region)) {
        // Check if text contains words from the primary language of this region
        for (const langCode of languages) {
          if (languageDetectionPatterns[langCode] && 
              languageDetectionPatterns[langCode].some(pattern => pattern.test(text))) {
            return langCode;
          }
        }
        // If no specific language pattern matched, return the primary language for the region
        return languages[0];
      }
    }
    
    // Check for country match if no specific region matched
    for (const [country, languages] of Object.entries(regionToLanguages)) {
      // Only check country entries (e.g., 'nigeria', 'kenya', etc.)
      if (country.indexOf(' ') === -1 && normalizedLocation.includes(country)) {
        return languages[0]; // Return primary language for the country
      }
    }
  }
  
  // If no location hint or no match with location, use pattern matching
  return detectLanguageFromText(text);
};

// Detect language purely from text
export const detectLanguageFromText = (text: string): string => {
  const lowerText = text.toLowerCase();
  
  // Check if it's an "emi help me" query
  if (/emi help/i.test(lowerText)) {
    return 'en'; // This is an English query format
  }
  
  // Check language patterns
  for (const [langCode, patterns] of Object.entries(languageDetectionPatterns)) {
    if (patterns.some(pattern => pattern.test(lowerText))) {
      return langCode;
    }
  }
  
  // Default to English
  return 'en';
};

// Try to extract location from query
export const extractLocationFromQuery = (query: string): string | null => {
  // Common prepositions indicating location
  const locationPatterns = [
    /(?:in|at|near|around|from) ([\w\s,]+)(?:\.|$)/i,
    /(?:à|a|en|dans|près de|autour de) ([\w\s,]+)(?:\.|$)/i,
    /(?:katika|karibu na) ([\w\s,]+)(?:\.|$)/i,
    /(?:ni|ninu) ([\w\s,]+)(?:\.|$)/i
  ];
  
  for (const pattern of locationPatterns) {
    const match = pattern.exec(query);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  // Process special query formats
  const { location } = processRegionalQuery(query);
  if (location) {
    return location;
  }
  
  return null;
};

// Get geolocation-based language preferences
export const getUserLocationLanguages = async (): Promise<string[]> => {
  // This would normally use the browser's geolocation API and a geocoding service
  // For demo purposes, we'll simulate being in Lagos, Nigeria
  
  const simulatedLocation = 'Lagos, Nigeria';
  
  // In a real implementation, you would use navigator.geolocation.getCurrentPosition
  // and then use a reverse geocoding service to get the city/country
  
  // For demo purposes, we'll return the languages for the simulated location
  const normalizedLocation = simulatedLocation.toLowerCase();
  
  for (const [region, languages] of Object.entries(regionToLanguages)) {
    if (normalizedLocation.includes(region)) {
      return languages;
    }
  }
  
  // Default to English if no location match
  return ['en'];
};

export { supportedLanguages } from './languageData';
