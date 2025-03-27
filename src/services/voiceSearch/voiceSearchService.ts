// Main voice search service implementation
import { detectLanguage } from './languageUtils';
import { translateToEnglish } from './translationService';
import { searchWorkers, searchWithGroq } from '../workers';
import { toast } from 'sonner';

// Define interfaces
interface VoiceSearchOptions {
  language?: string;
  location?: string;
  translateToEnglish?: boolean;
  onInterimResult?: (text: string) => void;
  onResult?: (text: string) => void;
  onError?: (error: Error) => void;
  onPermissionDenied?: () => void;
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

// Define supported service types
const supportedServices = [
  'electrician',
  'plumber',
  'carpenter',
  'painter',
  'mason',
  'technician',
  'cleaner',
  'gardener'
];

// Define simple commands
const simpleCommands = {
  'find': 'search',
  'look for': 'search',
  'search for': 'search',
  'need': 'search',
  'want': 'search',
  'get': 'search'
};

interface SearchOptions {
  query: string;
  language?: string;
  translateToEnglish?: boolean;
}

interface ServiceProvider {
  id: string;
  name: string;
  title: string;
  rating: number;
  location: string;
  imageUrl: string;
}

declare global {
  interface Window {
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

// Create a class to handle voice search functionality
class VoiceSearchService {
  private recognition: SpeechRecognition | null = null;
  private isListening: boolean = false;
  private onResultCallback: ((text: string) => void) | null = null;
  private onErrorCallback: ((error: Error) => void) | null = null;
  private onPermissionDeniedCallback: (() => void) | null = null;

  constructor() {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new window.webkitSpeechRecognition();
      this.setupRecognition();
    }
  }

  private setupRecognition() {
    if (!this.recognition) return;

    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US';

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      this.processVoiceCommand(transcript);
    };

    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (this.onErrorCallback) {
        this.onErrorCallback(new Error(event.error));
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };
  }

  private processVoiceCommand(transcript: string) {
    // Check for simple commands
    for (const [command, action] of Object.entries(simpleCommands)) {
      if (transcript.includes(command)) {
        // Extract the service type from the transcript
        const serviceMatch = supportedServices.find(service => 
          transcript.includes(service)
        );

        if (serviceMatch) {
          // Found a valid service type
          const command = `find ${serviceMatch}`;
          if (this.onResultCallback) {
            this.onResultCallback(command);
          }
          return;
        }
      }
    }

    // If no valid command or service found, show error
    if (this.onErrorCallback) {
      this.onErrorCallback(new Error('Please say "find" followed by a service type (e.g., "find plumber")'));
    }
  }

  start(options: VoiceSearchOptions) {
    if (!this.recognition) {
      if (options.onError) {
        options.onError(new Error('Speech recognition is not supported in this browser'));
      }
      return;
    }

    this.onResultCallback = options.onResult;
    this.onErrorCallback = options.onError;
    this.onPermissionDeniedCallback = options.onPermissionDenied;

    if (options.language) {
      this.recognition.lang = options.language;
    }

    try {
      this.recognition.start();
      this.isListening = true;
    } catch (error) {
      if (options.onError) {
        options.onError(new Error('Failed to start speech recognition'));
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
