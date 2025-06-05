// Corrected session service
let testResults = {};
let sessionTimestamp = Date.now();

const session = {
  // Save a test result
  saveResult: (module, score) => {
    testResults[module] = score;
    sessionTimestamp = Date.now();
    return session.getResults();
  },

  // Get all results with timestamp
  getResults: () => ({
    results: {...testResults},
    timestamp: sessionTimestamp
  }),

  // Clear all results
  clearResults: () => {
    testResults = {};
    sessionTimestamp = Date.now();
  },

  // Check if session is expired (24 hours)
  isExpired: () => {
    return Date.now() - sessionTimestamp > 86400000; // 24 hours
  },

  // Get count of completed modules
  getCompletedCount: () => Object.keys(testResults).length,

  // Get array of completed modules (excluding special ones)
  getCompletedModules: () => {
    const results = session.getResults().results;
    return Object.keys(results).filter(mod => 
      mod !== 'All-in-One' && mod !== 'Complete Diagnostic'
    );
  }
};

export default session;