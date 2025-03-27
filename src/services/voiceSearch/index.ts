
// Main entry point that re-exports functionality from the other modules
import voiceSearchInstance, { searchWithVoice } from './voiceSearchService';
import { supportedLanguages, getUserLocationLanguages } from './languageUtils';

export {
  voiceSearchInstance as default,
  searchWithVoice,
  supportedLanguages,
  getUserLocationLanguages
};
