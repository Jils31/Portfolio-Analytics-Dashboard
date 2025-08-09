import React, { useEffect, useState, useCallback } from 'react';
import { fetchHoldings } from '../../services/api';
import HoldingsTable from '../cards/HoldingsTable';
import HoldingsCard from '../cards/HoldingsCard';
import Loader from "../common/Loader";
import ErrorMessage from "../common/ErrorMessage";

const Holdings = () => {
  const [holdings, setHoldings] = useState([]);
  const [filteredHoldings, setFilteredHoldings] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'

  const getData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchHoldings();
      setHoldings(res.data || []);
      setFilteredHoldings(res.data || []);
    } catch (err) {
      console.error('Error fetching holdings:', err);
      setError('Failed to load holdings data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  const sortData = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }

    const sorted = [...filteredHoldings].sort((a, b) => {
      const valA = isNaN(a[key]) ? a[key] : parseFloat(a[key]);
      const valB = isNaN(b[key]) ? b[key] : parseFloat(b[key]);

      if (valA < valB) return direction === 'ascending' ? -1 : 1;
      if (valA > valB) return direction === 'ascending' ? 1 : -1;
      return 0;
    });

    setFilteredHoldings(sorted);
    setSortConfig({ key, direction });
  };

  const quickSort = (key, direction = 'descending') => {
    const sorted = [...filteredHoldings].sort((a, b) => {
      const valA = isNaN(a[key]) ? a[key] : parseFloat(a[key]);
      const valB = isNaN(b[key]) ? b[key] : parseFloat(b[key]);

      if (valA < valB) return direction === 'ascending' ? -1 : 1;
      if (valA > valB) return direction === 'ascending' ? 1 : -1;
      return 0;
    });

    setFilteredHoldings(sorted);
    setSortConfig({ key, direction });
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = holdings.filter((h) =>
      h.symbol?.toLowerCase().includes(query) ||
      h.companyName?.toLowerCase().includes(query)
    );
    setFilteredHoldings(filtered);
    // Reset sort when searching
    setSortConfig({ key: '', direction: '' });
  };

  const formatCurrency = (value) => {
    const numValue = parseFloat(value) || 0;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(numValue);
  };

  const formatNumber = (value) => {
    const numValue = parseFloat(value) || 0;
    return numValue.toLocaleString('en-IN');
  };

  const getGainLossColor = (value) => {
    const numValue = parseFloat(value) || 0;
    if (numValue > 0) return 'text-emerald-600';
    if (numValue < 0) return 'text-red-500';
    return 'text-gray-600';
  };

  const getGainLossIcon = (value) => {
    const numValue = parseFloat(value) || 0;
    if (numValue > 0) return '↗️';
    if (numValue < 0) return '↘️';
    return '➡️';
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    return sortConfig.direction === 'ascending' ? (
      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
      </svg>
    );
  };

  const clearSearch = () => {
    setSearchQuery('');
    setFilteredHoldings(holdings);
    setSortConfig({ key: '', direction: '' });
  };

  const formatters = {
    formatCurrency,
    formatNumber,
    getGainLossColor,
    getGainLossIcon,
    getSortIcon
  };

  const handleRetry = () => {
    getData();
  };

  // Quick sort options - adjust these field names based on your data structure
  const sortOptions = [
    { key: 'symbol', label: 'Symbol A-Z', direction: 'ascending' },
    { key: 'companyName', label: 'Company A-Z', direction: 'ascending' },
    { key: 'currentPrice', label: 'Highest Price', direction: 'descending' },
    { key: 'currentPrice', label: 'Lowest Price', direction: 'ascending' },
    { key: 'totalGainLoss', label: 'Highest Gain', direction: 'descending' },
    { key: 'totalGainLoss', label: 'Highest Loss', direction: 'ascending' },
    { key: 'totalGainLossPercent', label: 'Best Performance %', direction: 'descending' },
    { key: 'value', label: 'Highest Value', direction: 'descending' },
    { key: 'quantity', label: 'Most Shares', direction: 'descending' },
  ];

  if (loading) {
    return (
      <Loader 
        title="Loading Performance Data"
        subtitle="Analyzing your portfolio performance against market benchmarks"
        showMetricCards={true}
        showChart={false}
      />
    );
  }

  if (error) {
    return (
      <ErrorMessage
        title="Unable to Load Holdings"
        message={error}
        onRetry={handleRetry}
        retryText="Reload Holdings"
      />
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50 rounded-2xl shadow-2xl p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div className="mb-4 md:mb-0">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent mb-2">
            Portfolio Holdings
          </h2>
          <p className="text-gray-600">
            {filteredHoldings.length} holdings • Total Value: {formatCurrency(filteredHoldings.reduce((sum, h) => sum + parseFloat(h.value || 0), 0))}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
          {/* Search Bar */}
          <div className="relative flex-1 min-w-0 sm:min-w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by symbol or company..."
              className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              value={searchQuery}
              onChange={handleSearch}
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          
          {/* View Toggle */}
          <div className="flex bg-white rounded-xl p-1 shadow-lg border border-gray-200">
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                viewMode === 'table'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 6h18m-18 8h18m-18 4h18" />
              </svg>
              Table
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                viewMode === 'cards'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z" />
              </svg>
              Cards
            </button>
          </div>
        </div>
      </div>

      {/* Quick Sort Options */}
      {filteredHoldings.length > 0 && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-600 py-2 pr-2">Sort by:</span>
            {sortOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => quickSort(option.key, option.direction)}
                className={`px-3 py-2 text-sm rounded-lg border transition-all duration-200 ${
                  sortConfig.key === option.key && sortConfig.direction === option.direction
                    ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-600 hover:shadow-sm'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Render appropriate view */}
      {viewMode === 'table' ? (
        <HoldingsTable 
          holdings={filteredHoldings}
          sortConfig={sortConfig}
          sortData={sortData}
          formatters={formatters}
        />
      ) : (
        <HoldingsCard 
          holdings={filteredHoldings}
          formatters={formatters}
          sortConfig={sortConfig}
          sortData={sortData}
        />
      )}

      {/* Empty State */}
      {filteredHoldings.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchQuery ? 'No holdings found' : 'No holdings available'}
          </h3>
          <p className="text-gray-500">
            {searchQuery 
              ? 'Try adjusting your search criteria' 
              : 'Your holdings will appear here once you make investments'
            }
          </p>
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Search
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Holdings;