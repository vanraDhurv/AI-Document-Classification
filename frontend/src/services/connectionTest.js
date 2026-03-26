import { authAPI, documentsAPI } from './api';

// Connection test utility
export const testConnection = async () => {
  const results = {
    apiHealth: false,
    authEndpoint: false,
    documentsEndpoint: false,
    corsEnabled: false,
    errors: []
  };

  try {
    // Test basic API health
    const healthResponse = await fetch('http://localhost:8000/health');
    if (healthResponse.ok) {
      results.apiHealth = true;
      results.corsEnabled = true; // If we can make the request, CORS is working
    }
  } catch (error) {
    results.errors.push(`Health check failed: ${error.message}`);
  }

  try {
    // Test auth endpoint (should return 401)
    await authAPI.getMe();
  } catch (error) {
    if (error.response?.status === 401) {
      results.authEndpoint = true; // 401 is expected without token
    } else {
      results.errors.push(`Auth endpoint error: ${error.message}`);
    }
  }

  try {
    // Test documents endpoint (should return 401)
    await documentsAPI.getDocuments();
  } catch (error) {
    if (error.response?.status === 401) {
      results.documentsEndpoint = true; // 401 is expected without token
    } else {
      results.errors.push(`Documents endpoint error: ${error.message}`);
    }
  }

  return results;
};

// Usage example:
// testConnection().then(results => console.log('Connection test results:', results));