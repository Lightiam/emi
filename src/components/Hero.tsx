
import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import voiceSearchInstance, { 
  searchWithVoice, 
  supportedLanguages,
  getUserLocationLanguages
} from '../services/voiceSearch';

// Define a type for our worker images
interface WorkerImage {
  id: number;
  src: string;
  alt: string;
}

// Sample worker images using the uploaded files
const leftImages: WorkerImage[] = [
  { id: 1, src: "/lovable-uploads/048d1c23-d27d-4406-ade3-471a6d24a70c.png", alt: "Professional tech worker analyzing data" },
  { id: 2, src: "/lovable-uploads/ff3e073f-f3ef-417e-bdbc-3010a8a80a24.png", alt: "Professional female technician with laptop" },
  { id: 3, src: "/lovable-uploads/fdfb621b-5ad8-4ba5-b9bf-7bf2d11015f0.png", alt: "Maintenance professional working" }
];

const rightImages: WorkerImage[] = [
  { id: 4, src: "/lovable-uploads/8b3c299c-abcf-4fff-8cb2-b1da3cf60b03.png", alt: "Female craftsman with safety equipment" },
  { id: 5, src: "/lovable-uploads/98983439-7614-4880-88e0-e3ace1184681.png", alt: "Male workers checking inventory" },
  { id: 6, src: "/lovable-uploads/2445fe07-21dd-4442-b847-d276a6e415bb.png", alt: "Professional male technician" }
];

const Hero = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('auto');
  const [detectedLocation, setDetectedLocation] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  // Initialize location detection and setup online/offline listeners
  useEffect(() => {
    const detectLocation = async () => {
      try {
        // This is a simplified simulation - in reality would use browser geolocation
        // and a geocoding service to get the actual location name
        setDetectedLocation('Lagos, Nigeria'); // Simulated location
        
        // Get preferred languages based on location
        const locationLanguages = await getUserLocationLanguages();
        if (locationLanguages.length > 0) {
          // Update UI with detected location information
          const primaryLanguage = supportedLanguages.find(l => l.code === locationLanguages[0])?.name;
          console.log(`Location detected: Lagos, Nigeria. Primary language: ${primaryLanguage}`);
        }
      } catch (error) {
        console.error('Error detecting location:', error);
      }
    };
    
    detectLocation();
    
    // Set up listeners for online/offline status
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("You're back online", {
        description: "Voice search will now use full capabilities",
        duration: 3000, 
      });
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      toast.warning("You're offline", {
        description: "Voice search will use offline mode",
        duration: 3000,
      });
      
      // If currently listening, switch to offline mode
      if (isListening) {
        voiceSearchInstance.stop();
        setTimeout(() => {
          voiceSearchInstance.start({
            language: selectedLanguage,
            onInterimResult: (text) => setQuery(text),
            onResult: (text) => {
              setQuery(text);
              setIsListening(false);
              handleSearch(null, text);
            },
            onError: (error) => {
              setIsListening(false);
              toast.error("Voice recognition failed", {
                description: error.message,
                duration: 3000,
              });
            }
          });
        }, 500);
      }
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isListening, selectedLanguage]);

  // Voice recognition with multilingual support
  const toggleVoiceRecognition = () => {
    if (!isListening) {
      setIsListening(true);
      
      voiceSearchInstance.start({
        language: selectedLanguage,
        onInterimResult: (text) => {
          setQuery(text);
        },
        onResult: async (text) => {
          setQuery(text);
          setIsListening(false);
          
          // Use the enhanced search with auto language detection if needed
          handleSearch(null, text);
        },
        onError: (error) => {
          setIsListening(false);
          toast.error("Voice recognition failed", {
            description: error.message,
            duration: 3000,
          });
        }
      });
    } else {
      voiceSearchInstance.stop();
      setIsListening(false);
    }
  };

  const handleSearch = async (e: React.FormEvent | null, voiceText?: string) => {
    if (e) e.preventDefault();
    
    const searchQuery = voiceText || query;
    
    if (searchQuery.trim()) {
      try {
        toast.info(`Searching for: ${searchQuery}`, {
          description: "Processing your request...",
          duration: 2000,
        });
        
        const results = await searchWithVoice(searchQuery, selectedLanguage);
        toast.success(`Found ${results.length} results matching your query`, {
          description: "Search complete",
          duration: 3000,
        });
        
        // Navigate to worker details if exactly one worker is found
        if (results.length === 1) {
          navigate(`/worker/${results[0].id}`);
        } else if (results.length > 1) {
          // In a real app, we would show a list of results
          // For now, just navigate to the first result
          navigate(`/worker/${results[0].id}`);
        }
      } catch (error) {
        toast.error("Search failed", {
          description: "Could not complete your search request",
          duration: 3000,
        });
      }
    }
  };

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-[20px] p-6 md:p-10 shadow-sm overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <div className="floating-images grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 items-center mb-10">
              {/* Left images column */}
              <div className="left-images hidden md:flex flex-col space-y-4 justify-center items-end">
                {leftImages.map((img) => (
                  <div key={img.id} className="image-container animate-fade-in" style={{ animationDelay: `${img.id * 0.1}s` }}>
                    <img src={img.src} alt={img.alt} loading="lazy" className="transition-transform hover:scale-105 duration-700" />
                  </div>
                ))}
              </div>
              
              <div className="text-center animate-fade-in-up">
                <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
                  Discover Your Project Dream Team Here.
                </h1>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                  This platform connects homeowners, contractors, businesses, and
                  customers with skilled artisans, handymen, and project experts for
                  renovations, custom-builds, and repairs.
                </p>
                <form onSubmit={handleSearch} className="hero-search relative mx-auto">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={detectedLocation ? `Try "Emi help me look for a plumber in ${detectedLocation}"` : "Ask AI anything"}
                    className="flex-1 bg-transparent border-none focus:outline-none text-gray-800 placeholder:text-gray-400"
                  />
                  <div className="flex items-center gap-2">
                    <select 
                      className="text-sm text-gray-500 bg-transparent border-none"
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                    >
                      <option value="auto">Auto-detect</option>
                      {supportedLanguages.map(lang => (
                        <option key={lang.code} value={lang.code}>{lang.name}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={toggleVoiceRecognition}
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${isListening ? 'bg-destructive' : 'bg-gray-100'} text-gray-600`}
                      aria-label="Voice search"
                    >
                      {isListening ? (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="6" y="4" width="12" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 15C13.6569 15 15 13.6569 15 12V6C15 4.34315 13.6569 3 12 3C10.3431 3 9 4.34315 9 6V12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M19 10V12C19 15.866 15.866 19 12 19C8.13401 19 5 15.866 5 12V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 19V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8 22H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </form>
                {!isOnline && (
                  <div className="mt-2 text-amber-500 text-sm flex items-center justify-center">
                    <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 9V13M12 17H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0378 2.66667 10.268 4L3.33978 16C2.56998 17.3333 3.53223 19 5.07183 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    You're offline - using voice search simulation mode
                  </div>
                )}
              </div>
              
              {/* Right images column */}
              <div className="right-images hidden md:flex flex-col space-y-4 justify-center items-start">
                {rightImages.map((img) => (
                  <div key={img.id} className="image-container animate-fade-in" style={{ animationDelay: `${img.id * 0.1}s` }}>
                    <img src={img.src} alt={img.alt} loading="lazy" className="transition-transform hover:scale-105 duration-700" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
