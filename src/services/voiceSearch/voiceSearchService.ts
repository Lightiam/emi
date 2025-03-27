// Main voice search service implementation
import { detectLanguage } from './languageUtils';
import { translateToEnglish } from './translationService';
import { searchWorkers, searchWithGroq } from '../workers';

// Define interfaces
export interface VoiceSearchOptions {
  language?: string;
  location?: string;
  translateToEnglish?: boolean;
  onInterimResult?: (text: string) => void;
  onResult?: (text: string) => void;
  onError?: (error: Error) => void;
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
  private options: VoiceSearchOptions = {};
  
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
      this.recognition.interimResults = true;
    } else {
      console.error('Speech recognition not supported in this browser');
    }
  }
  
  start(options: VoiceSearchOptions = {}) {
    if (!this.recognition) {
      if (options.onError) {
        options.onError(new Error('Speech recognition not supported in this browser'));
      }
      return;
    }
    
    if (this.isListening) {
      this.stop();
    }
    
    this.options = options;
    const language = options.language || 'en';
    this.recognition.lang = language;
    
    this.recognition.onresult = (event) => {
      const results = event.results;
      const lastResult = results[results.length - 1];
      const transcript = lastResult[0].transcript;
      
      if (lastResult.isFinal) {
        if (this.options.onResult) {
          this.options.onResult(transcript);
        }
      } else if (this.options.onInterimResult) {
        this.options.onInterimResult(transcript);
      }
    };
    
    this.recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      if (this.options.onError) {
        this.options.onError(new Error(event.error));
      }
    };
    
    this.recognition.onend = () => {
      this.isListening = false;
    };
    
    try {
      this.recognition.start();
      this.isListening = true;
    } catch (error) {
      console.error('Error starting speech recognition', error);
      if (this.options.onError) {
        this.options.onError(error as Error);
      }
    }
  }
  
  stop() {
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
      this.start({
        ...options,
        onResult: async (transcript) => {
          if (!transcript) {
            resolve([]);
            return;
          }
          
          const detectedLanguage = options.language || detectLanguage(transcript, options.location);
          
          // Translate if needed
          let searchQuery = transcript;
          if (options.translateToEnglish && detectedLanguage !== 'en') {
            searchQuery = await translateToEnglish(transcript, detectedLanguage);
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
