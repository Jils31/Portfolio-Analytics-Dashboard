import React, { useEffect, useState } from 'react';
import { fetchHoldings } from '../services/api';

const HoldingsTable = () => {
  const [holdings, setHoldings] = useState([]);
  const [filteredHoldings, setFilteredHoldings] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const res = await fetchHoldings();
        setHoldings(res.data || []);
        setFilteredHoldings(res.data || []);
      } catch (err) {
        console.error('Error fetching holdings:', err);
        setError('Failed to load holdings data');
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

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

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = holdings.filter((h) =>
      h.symbol?.toLowerCase().includes(query) ||
      h.companyName?.toLowerCase().includes(query)
    );
    setFilteredHoldings(filtered);
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

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="animate-pulse">
          <div className="flex justify-between items-center mb-8">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded w-1/3"></div>
          </div>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
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

  const columns = [
    { label: 'Symbol', key: 'symbol', mobile: true },
    { label: 'Company', key: 'companyName', mobile: false },
    { label: 'Qty', key: 'quantity', mobile: true },
    { label: 'Avg Price', key: 'avgPrice', mobile: false },
    { label: 'Current Price', key: 'currentPrice', mobile: true },
    { label: 'Value', key: 'value', mobile: true },
    { label: 'Gain/Loss', key: 'gainLoss', mobile: true },
    { label: 'Gain %', key: 'gainLossPercent', mobile: true },
  ];

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

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200/50 overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                <tr>
                  {columns.map(col => (
                    <th
                      key={col.key}
                      onClick={() => sortData(col.key)}
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-2">
                        <span>{col.label}</span>
                        {getSortIcon(col.key)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredHoldings.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-gray-900">{item.symbol}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-48 truncate" title={item.companyName}>
                        {item.companyName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatNumber(item.quantity)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(item.avgPrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {formatCurrency(item.currentPrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {formatCurrency(item.value)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${getGainLossColor(item.gainLoss)}`}>
                      <div className="flex items-center">
                        <span className="mr-1">{getGainLossIcon(item.gainLoss)}</span>
                        {formatCurrency(item.gainLoss)}
                      </div>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${getGainLossColor(item.gainLossPercent)}`}>
                      {item.gainLossPercent}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Table */}
          <div className="lg:hidden">
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-4 py-3">
              <div className="flex space-x-4 overflow-x-auto pb-2">
                {columns.filter(col => col.mobile).map(col => (
                  <button
                    key={col.key}
                    onClick={() => sortData(col.key)}
                    className="flex items-center space-x-1 text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap px-3 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-100 transition-colors duration-200"
                  >
                    <span>{col.label}</span>
                    {getSortIcon(col.key)}
                  </button>
                ))}
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {filteredHoldings.map((item, index) => (
                <div key={index} className="p-4 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-bold text-lg text-gray-900">{item.symbol}</div>
                    <div className={`text-sm font-semibold flex items-center ${getGainLossColor(item.gainLossPercent)}`}>
                      <span className="mr-1">{getGainLossIcon(item.gainLossPercent)}</span>
                      {item.gainLossPercent}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-3 truncate">{item.companyName}</div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Qty:</span>
                      <span className="font-medium">{formatNumber(item.quantity)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Current:</span>
                      <span className="font-medium">{formatCurrency(item.currentPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Value:</span>
                      <span className="font-semibold">{formatCurrency(item.value)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Gain/Loss:</span>
                      <span className={`font-semibold ${getGainLossColor(item.gainLoss)}`}>
                        {formatCurrency(item.gainLoss)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Cards View */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredHoldings.map((item, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{item.symbol}</h3>
                  <p className="text-sm text-gray-600 truncate max-w-48" title={item.companyName}>
                    {item.companyName}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold flex items-center ${getGainLossColor(item.gainLossPercent)}`}>
                    <span className="mr-1">{getGainLossIcon(item.gainLossPercent)}</span>
                    {item.gainLossPercent}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Quantity</span>
                  <span className="font-medium">{formatNumber(item.quantity)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Avg Price</span>
                  <span className="font-medium">{formatCurrency(item.avgPrice)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Current Price</span>
                  <span className="font-semibold">{formatCurrency(item.currentPrice)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Total Value</span>
                  <span className="font-bold text-lg">{formatCurrency(item.value)}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Gain/Loss</span>
                  <span className={`font-bold ${getGainLossColor(item.gainLoss)}`}>
                    {formatCurrency(item.gainLoss)}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      parseFloat(item.gainLossPercent) >= 0 
                        ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' 
                        : 'bg-gradient-to-r from-red-400 to-red-600'
                    }`}
                    style={{ 
                      width: `${Math.min(Math.abs(parseFloat(item.gainLossPercent) || 0) * 2, 100)}%` 
                    }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1 text-center">
                  Performance Indicator
                </div>
              </div>
            </div>
          ))}
        </div>
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
              onClick={() => {setSearchQuery(''); setFilteredHoldings(holdings);}}
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

export default HoldingsTable;