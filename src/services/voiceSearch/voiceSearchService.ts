// Main voice search service implementation
import { detectLanguage } from './languageUtils';
import { translateToEnglish } from './translationService';
import { searchWorkers, searchWithGroq } from '../workers';

// Define interfaces
export interface VoiceSearchOptions {
  language?: string;
  location?: string;
  translateToEnglish?: boolean;
}

interface SpeechRecognitionEvent extends Event {
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

interface Window {
  SpeechRecognition: new () => SpeechRecognition;
  webkitSpeechRecognition: new () => SpeechRecognition;
  mozSpeechRecognition: new () => SpeechRecognition;
  msSpeechRecognition: new () => SpeechRecognition;
}

// Create a class to handle voice search functionality
class VoiceSearchService {
  private recognition: SpeechRecognition | null = null;
  private isListening: boolean = false;
  
  constructor() {
    this.initRecognition();
  }
  
  private initRecognition() {
    // Try to get the SpeechRecognition object from various browser implementations
    const SpeechRecognition = window.SpeechRecognition || 
                            window.webkitSpeechRecognition || 
                            window.mozSpeechRecognition || 
                            window.msSpeechRecognition;

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
    } else {
      console.error('Speech recognition not supported in this browser');
    }
  }
  
  startListening(options: VoiceSearchOptions = {}, callback: (result: string | null) => void) {
    if (!this.recognition) {
      callback(null);
      return;
    }
    
    if (this.isListening) {
      this.stopListening();
    }
    
    const language = options.language || 'en';
    this.recognition.lang = language;
    
    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      callback(transcript);
    };
    
    this.recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      callback(null);
    };
    
    this.recognition.onend = () => {
      this.isListening = false;
    };
    
    try {
      this.recognition.start();
      this.isListening = true;
    } catch (error) {
      console.error('Error starting speech recognition', error);
      callback(null);
    }
  }
  
  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }
  
  isSupported(): boolean {
    return !!this.recognition;
  }
  
  async searchWithVoice(options: VoiceSearchOptions = {}): Promise<Array<Record<string, unknown>>> {
    if (!this.isSupported()) {
      console.warn('Speech recognition is not supported in this browser');
      return [];
    }

    return new Promise((resolve) => {
      this.startListening(options, async (transcript) => {
        if (!transcript) {
          resolve([]);
          return;
        }
        
        const detectedLanguage = options.language || detectLanguage(transcript, options.location);
        
        // Translate if needed
        let searchQuery = transcript;
        if (options.translateToEnglish && detectedLanguage !== 'en') {
          searchQuery = translateToEnglish(transcript, detectedLanguage);
        }
        
        // Use GROQ for advanced search or fall back to regular search
        try {
          const results = await searchWithGroq(searchQuery, detectedLanguage);
          resolve(results);
        } catch (error) {
          console.error('Error with AI search, falling back to regular search', error);
          const results = await searchWorkers(searchQuery);
          resolve(results);
        }
      });
    });
  }
}

// Create a singleton instance
const voiceSearchInstance = new VoiceSearchService();

// Helper function to make it easier to use the voice search
export const searchWithVoice = (options: VoiceSearchOptions = {}) => {
  return voiceSearchInstance.searchWithVoice(options);
};

export default voiceSearchInstance;
