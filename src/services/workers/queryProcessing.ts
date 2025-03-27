
import { MatchType } from './types';

// Helper function to match regional-specific search patterns
export const processRegionalQuery = (query: string): { 
  profession: string | null, 
  location: string | null,
  matchType: MatchType
} => {
  const lowerQuery = query.toLowerCase();
  let result = { profession: null, location: null, matchType: 'standard' as MatchType };
  
  // Match pattern: "Emi help me look for a [profession] in [location]"
  const emiHelpPattern = /emi help(?: me)? look for an? ([\w\s]+?)(?: in| at| near| around) ([\w\s,]+)/i;
  const emiMatch = emiHelpPattern.exec(query);
  
  if (emiMatch) {
    result.profession = emiMatch[1].trim();
    result.location = emiMatch[2].trim();
    result.matchType = 'emi-help';
    return result;
  }
  
  // Match regional patterns (examples from different African language patterns)
  const regionalPatterns = [
    // Naija pidgin
    { pattern: /abeg find ([\w\s]+) for ([\w\s,]+)/i, lang: 'pidgin' },
    // Swahili-like
    { pattern: /tafuta ([\w\s]+) katika ([\w\s,]+)/i, lang: 'swahili' },
    // Yoruba-like
    { pattern: /wa ([\w\s]+) ni ([\w\s,]+)/i, lang: 'yoruba' },
    // French-like (West/Central Africa)
    { pattern: /cherche(?:r|z)? (?:un|une) ([\w\s]+) (?:à|a|en|dans|pres de) ([\w\s,]+)/i, lang: 'french' }
  ];
  
  for (const { pattern, lang } of regionalPatterns) {
    const match = pattern.exec(lowerQuery);
    if (match) {
      result.profession = match[1].trim();
      result.location = match[2].trim();
      result.matchType = 'regional';
      return result;
    }
  }
  
  // Standard search - try to extract profession and location if possible
  const professions = [
    'plumber', 'developer', 'carpenter', 'electrician', 'vulcanizer', 
    'mechanic', 'car electrician', 'hvac', 'painter', 'fashion designer',
    'bricklayer', 'panel beater', 'scaffolder', 'cook', 'driver', 'rigger', 'climber'
  ];
  
  for (const profession of professions) {
    if (lowerQuery.includes(profession)) {
      result.profession = profession;
      
      // Try to find location after profession
      const locationPattern = new RegExp(`${profession}.*?(in|at|near|around) ([\\w\\s,]+)`, 'i');
      const locationMatch = locationPattern.exec(lowerQuery);
      
      if (locationMatch) {
        result.location = locationMatch[2].trim();
      }
      
      break;
    }
  }
  
  return result;
};
