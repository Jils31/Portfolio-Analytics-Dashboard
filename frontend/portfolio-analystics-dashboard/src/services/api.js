import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/portfolio',
});

// export const fetchPortfolioOverview = () => API.get('/overview');
// export const fetchHoldings = () => API.get('/holdings');
// export const fetchAssetDistribution = () => API.get('/allo');
// export const fetchPerformance = () => API.get('/performance');

export const fetchHoldings = () => API.get('/holdings');
export const fetchAssetDistribution = () => API.get('/allocations');
export const fetchPerformance = () => API.get('/performance');
export const fetchSummary = () => API.get('/summary')
