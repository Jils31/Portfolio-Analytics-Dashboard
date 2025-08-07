import React, { useEffect, useState } from 'react';
import { fetchSummary } from '../services/api';

const TopPerformers = () => {
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const res = await fetchSummary();
        setSummaryData(res.data);
      } catch (err) {
        console.error('Error fetching summary data:', err);
        setError('Failed to load performance data');
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low':
        return 'text-green-600 bg-green-100';
      case 'moderate':
        return 'text-yellow-600 bg-yellow-100';
      case 'high':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getDiversificationColor = (score) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getDiversificationText = (score) => {
    if (score >= 8) return 'Excellent';
    if (score >= 6) return 'Good';
    return 'Needs Improvement';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-32 bg-gray-200 rounded-xl"></div>
            <div className="h-32 bg-gray-200 rounded-xl"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="h-24 bg-gray-200 rounded-xl"></div>
            <div className="h-24 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-600 font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!summaryData) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <p className="text-center text-gray-500">No performance data available</p>
      </div>
    );
  }

  const { topPerformer, worstPerformer, diversificationScore, riskLevel } = summaryData;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Portfolio Performance</h2>
        <p className="text-gray-600">Track your top and worst performers with key insights</p>
      </div>

      {/* Top and Worst Performers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Best Performer */}
        <div className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 hover:shadow-lg transition-all duration-300">
          <div className="absolute top-0 right-0 w-20 h-20 bg-green-500 opacity-10 rounded-full -mr-10 -mt-10"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-green-800">Best Performer</h3>
                  <p className="text-sm text-green-600">Biggest Winner</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  +{topPerformer?.gainPercent?.toFixed(2)}%
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Symbol:</span>
                <span className="font-semibold text-gray-900">{topPerformer?.symbol}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Company:</span>
                <span className="font-medium text-gray-800 text-right max-w-48 truncate" title={topPerformer?.name}>
                  {topPerformer?.name}
                </span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-white/60 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-700 font-medium">Strong upward momentum</span>
              </div>
            </div>
          </div>
        </div>

        {/* Worst Performer */}
        <div className="relative overflow-hidden bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-6 border border-red-200 hover:shadow-lg transition-all duration-300">
          <div className="absolute top-0 right-0 w-20 h-20 bg-red-500 opacity-10 rounded-full -mr-10 -mt-10"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-red-800">Worst Performer</h3>
                  <p className="text-sm text-red-600">Needs Attention</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-red-600">
                  {worstPerformer?.gainPercent?.toFixed(2)}%
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Symbol:</span>
                <span className="font-semibold text-gray-900">{worstPerformer?.symbol}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Company:</span>
                <span className="font-medium text-gray-800 text-right max-w-48 truncate" title={worstPerformer?.name}>
                  {worstPerformer?.name}
                </span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-white/60 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-red-700 font-medium">Consider reviewing position</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Portfolio Insights</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Diversification Score */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Diversification Score</h4>
                  <p className="text-sm text-gray-600">Portfolio spread analysis</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-3xl font-bold text-blue-600">
                  {diversificationScore}/10
                </div>
                <div className={`text-lg font-semibold ${getDiversificationColor(diversificationScore)}`}>
                  {getDiversificationText(diversificationScore)}
                </div>
              </div>
            </div>
            
            <div className="mt-3 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${(diversificationScore / 10) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Risk Level */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Risk Level</h4>
                  <p className="text-sm text-gray-600">Investment risk assessment</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${getRiskLevelColor(riskLevel)}`}>
                <div className="w-2 h-2 rounded-full bg-current mr-2"></div>
                {riskLevel} Risk
              </div>
            </div>
            
            <div className="mt-4">
              <div className="text-xs text-gray-600">
                {riskLevel?.toLowerCase() === 'low' && 'Conservative approach with stable returns'}
                {riskLevel?.toLowerCase() === 'moderate' && 'Balanced risk with growth potential'}
                {riskLevel?.toLowerCase() === 'high' && 'Aggressive strategy with higher volatility'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopPerformers;