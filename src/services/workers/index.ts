
// Barrel file to re-export all functionality from the workers service

// Export types
export * from './types';

// Export data (for debugging or testing)
export { workers } from './data';

// Export query processing
export { processRegionalQuery } from './queryProcessing';

// Export search functions
export { 
  searchWorkers, 
  getWorkerById, 
  getAllWorkers,
  searchWithGroq
} from './search';
