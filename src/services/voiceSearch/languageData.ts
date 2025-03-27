
// Data structures for languages and regions

// Define supported languages
export const supportedLanguages = [
  { code: 'en', name: 'English' },
  { code: 'sw', name: 'Swahili' },
  { code: 'yo', name: 'Yoruba' },
  { code: 'ha', name: 'Hausa' },
  { code: 'zu', name: 'Zulu' },
  { code: 'xh', name: 'Xhosa' },
  { code: 'ig', name: 'Igbo' },
  { code: 'tw', name: 'Twi' },
  { code: 'ga', name: 'Ga' },
  { code: 'fr', name: 'French' },
  { code: 'wo', name: 'Wolof' },
  { code: 'ar', name: 'Arabic' },
  { code: 'ba', name: 'Bambara' },
  { code: 'pi', name: 'Pidgin' },
  { code: 'so', name: 'Sotho' }
];

// Region to likely languages mapping
export const regionToLanguages: Record<string, string[]> = {
  // Nigeria
  'lagos': ['en', 'yo', 'pi', 'ha'],
  'abuja': ['en', 'ha', 'pi'],
  'kano': ['ha', 'en', 'ar'],
  'ibadan': ['yo', 'en', 'pi'],
  'enugu': ['ig', 'en', 'pi'],
  'onitsha': ['ig', 'en', 'pi'],
  'calabar': ['en', 'pi'],
  
  // Kenya
  'nairobi': ['sw', 'en'],
  'mombasa': ['sw', 'en', 'ar'],
  'kisumu': ['sw', 'en'],
  
  // South Africa
  'johannesburg': ['en', 'zu', 'xh', 'so'],
  'cape town': ['en', 'xh', 'zu'],
  'durban': ['en', 'zu'],
  'pretoria': ['en', 'so', 'zu'],
  
  // Ghana
  'accra': ['en', 'tw', 'ga'],
  'kumasi': ['en', 'tw'],
  
  // Senegal
  'dakar': ['fr', 'wo'],
  
  // Mali
  'bamako': ['fr', 'ba'],
  
  // Default for each country
  'nigeria': ['en', 'pi', 'ha', 'yo', 'ig'],
  'kenya': ['sw', 'en'],
  'south africa': ['en', 'zu', 'xh', 'so'],
  'ghana': ['en', 'tw', 'ga'],
  'senegal': ['fr', 'wo'],
  'mali': ['fr', 'ba']
};

// Patterns for language detection
export const languageDetectionPatterns: Record<string, RegExp[]> = {
  'sw': [/jambo|habari|asante|tafuta|karibu|sasa|nzuri/i],
  'yo': [/bawo ni|joor|kini|wa|pẹlẹ|e kaabo/i],
  'ha': [/sannu|yaya|ina|kwai|kana|na gode/i],
  'zu': [/sawubona|ngiyabonga|unjani|yebo|hambani/i],
  'xh': [/molo|enkosi|unjani|ewe|hayi/i],
  'ig': [/kedu|biko|daalu|ndewo|ọdịmma/i],
  'tw': [/akwaaba|medaase|ɛte sɛn|yɛ/i],
  'ga': [/ŋɛɛ|ojekoo|akpe|ayekoo/i],
  'fr': [/bonjour|merci|comment|cherche|trouve/i],
  'wo': [/nangadef|mangi fi|na nga def|jërëjëf/i],
  'ar': [/salam|shukran|kaifa|afwan|sabah/i],
  'ba': [/i ni ce|i ka kɛnɛ|a ni baara/i],
  'pi': [/abeg|wetin|dey|na|make/i],
  'so': [/dumela|re teng|kea leboha/i]
};
