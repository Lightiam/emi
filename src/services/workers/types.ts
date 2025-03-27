
// Define worker type and match types
export interface Worker {
  id: string;
  name: string;
  profession: string;
  skills: string[];
  languages: string[];
  location: string;
  rating: number;
  imageUrl: string;
  hourlyRate: number;
}

// Define the possible match types for query processing
export type MatchType = 'standard' | 'emi-help' | 'regional';
