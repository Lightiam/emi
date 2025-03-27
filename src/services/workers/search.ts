
import { Worker } from './types';
import { workers } from './data';
import { processRegionalQuery } from './queryProcessing';

// Search functionality
export const searchWorkers = async (query: string): Promise<Worker[]> => {
  const lowerQuery = query.toLowerCase();
  
  // Process the query for regional patterns
  const { profession, location, matchType } = processRegionalQuery(query);
  
  // If we identified a profession and/or location, prioritize those in search
  if (profession || location) {
    return workers.filter(worker => {
      let matches = true;
      
      if (profession) {
        const professionMatch = worker.profession.toLowerCase().includes(profession.toLowerCase()) ||
                               worker.skills.some(skill => skill.toLowerCase().includes(profession.toLowerCase()));
        matches = matches && professionMatch;
      }
      
      if (location) {
        const locationMatch = worker.location.toLowerCase().includes(location.toLowerCase());
        matches = matches && locationMatch;
      }
      
      return matches;
    });
  }
  
  // Simple search implementation (fallback)
  return workers.filter(worker => 
    worker.name.toLowerCase().includes(lowerQuery) ||
    worker.profession.toLowerCase().includes(lowerQuery) ||
    worker.skills.some(skill => skill.toLowerCase().includes(lowerQuery)) ||
    worker.languages.some(lang => lang.toLowerCase().includes(lowerQuery)) ||
    worker.location.toLowerCase().includes(lowerQuery)
  );
};

export const getWorkerById = async (id: string): Promise<Worker | undefined> => {
  return workers.find(worker => worker.id === id);
};

export const getAllWorkers = async (): Promise<Worker[]> => {
  return [...workers];
};

// This would be used with GROQ AI for voice search in a real implementation
export const searchWithGroq = async (query: string, lang: string = 'en'): Promise<Worker[]> => {
  console.log(`GROQ AI search in language: ${lang} for query: ${query}`);
  // In a real implementation, this would use the GROQ API
  // For now, we'll just use our simple search
  return searchWorkers(query);
};
