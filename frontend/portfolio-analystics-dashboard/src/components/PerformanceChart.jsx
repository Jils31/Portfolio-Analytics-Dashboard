import React, { useEffect, useState } from 'react';
import { fetchPerformance } from '../services/api';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Area, AreaChart
} from 'recharts';

const PerformanceChart = () => {
  const [data, setData] = useState([]);
  const [returns, setReturns] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('1year');
  const [chartType, setChartType] = useState('line');

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const response = await fetchPerformance();
        setData(response.data.timeline || []);
        setReturns(response.data.returns || null);
      } catch (err) {
        console.error('Error fetching performance data:', err);
        setError('Failed to load performance data');
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatCurrency = (value) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(1)}Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    } else if (value >= 1000) {
      return `₹${(value / 1000).toFixed(1)}K`;
    }
    return `₹${value.toLocaleString('en-IN')}`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm p-4 border border-gray-200/50 rounded-xl shadow-2xl">
          <p className="font-semibold text-gray-800 mb-3 text-center border-b border-gray-200 pb-2">
            {formatDate(label)}
          </p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between mb-2 last:mb-0">
              <div className="flex items-center">
                <div 
                  className="w-4 h-4 rounded-full mr-3 shadow-sm" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm font-medium capitalize text-gray-700">
                  {entry.dataKey === 'nifty50' ? 'Nifty 50' : entry.dataKey}:
                </span>
              </div>
              <span className="font-bold text-gray-900 ml-4">
                {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const getReturnColor = (value) => {
    if (value > 0) return 'text-emerald-600';
    if (value < 0) return 'text-red-500';
    return 'text-gray-600';
  };

  const getReturnIcon = (value) => {
    if (value > 0) return '↗';
    if (value < 0) return '↘';
    return '→';
  };

  const periods = [
    { key: '1month', label: '1M' },
    { key: '3months', label: '3M' },
    { key: '1year', label: '1Y' }
  ];

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl shadow-xl p-8">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-8">
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/3"></div>
            <div className="flex space-x-2">
              <div className="h-8 w-16 bg-gray-200 rounded-full"></div>
              <div className="h-8 w-16 bg-gray-200 rounded-full"></div>
              <div className="h-8 w-16 bg-gray-200 rounded-full"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-6 h-32"></div>
            ))}
          </div>
          <div className="h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl shadow-xl p-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-red-700 mb-2">Unable to Load Data</h3>
          <p className="text-red-600 font-medium mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50 rounded-2xl shadow-2xl p-8 hover:shadow-3xl transition-all duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent mb-2">
            Performance Analytics
          </h2>
          <p className="text-gray-600">Compare your portfolio against market benchmarks</p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          {/* Period Selector */}
          <div className="flex bg-white rounded-xl p-1 shadow-lg border border-gray-200">
            {periods.map((period) => (
              <button
                key={period.key}
                onClick={() => setSelectedPeriod(period.key)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
                  selectedPeriod === period.key
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics Cards */}
      {returns && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Asset Performance</h3>
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Period:</span>
                <span className="font-semibold text-white">{periods.find(p => p.key === selectedPeriod)?.label}</span>
              </div>
              <div className="text-xs text-gray-400 mt-3">
                Showing returns for selected timeframe
              </div>
            </div>
          </div>

          {["portfolio", "nifty50", "gold"].map((asset, index) => {
            const colors = [
              { from: 'from-blue-500', to: 'to-indigo-600', icon: '💼' },
              { from: 'from-emerald-500', to: 'to-teal-600', icon: '📈' },
              { from: 'from-amber-500', to: 'to-orange-600', icon: '🪙' }
            ];
            const returnValue = returns[asset][selectedPeriod];
            
            return (
              <div key={asset} className={`bg-gradient-to-br ${colors[index].from} ${colors[index].to} rounded-xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{colors[index].icon}</span>
                    <h3 className="font-bold text-lg capitalize">
                      {asset === 'nifty50' ? 'Nifty 50' : asset}
                    </h3>
                  </div>
                  <span className="text-2xl font-bold">
                    {getReturnIcon(returnValue)}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="text-3xl font-bold">
                    {returnValue > 0 ? '+' : ''}{returnValue}%
                  </div>
                  <div className="text-sm text-white/80">
                    {returnValue > 0 ? 'Profit' : returnValue < 0 ? 'Loss' : 'Break Even'}
                  </div>
                </div>

                <div className="mt-4 bg-white/20 rounded-lg p-2">
                  <div className="flex justify-between text-xs">
                    <span>Performance</span>
                    <span className="font-semibold">
                      {returnValue > 0 ? 'Strong' : returnValue < 0 ? 'Weak' : 'Stable'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Chart Section */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Performance Timeline</h3>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setChartType('line')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                chartType === 'line'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Line Chart
            </button>
            <button
              onClick={() => setChartType('area')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                chartType === 'area'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Area Chart
            </button>
          </div>
        </div>

        <div className="w-full h-96">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'line' ? (
                <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <defs>
                    <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#1E40AF" stopOpacity={0.2}/>
                    </linearGradient>
                    <linearGradient id="niftyGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#059669" stopOpacity={0.2}/>
                    </linearGradient>
                    <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#D97706" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.5} />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate}
                    stroke="#6B7280"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis 
                    tickFormatter={formatCurrency}
                    stroke="#6B7280"
                    fontSize={12}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="circle"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="portfolio" 
                    stroke="#3B82F6" 
                    strokeWidth={4}
                    dot={{ r: 6, fill: "#3B82F6", strokeWidth: 2, stroke: "#ffffff" }}
                    activeDot={{ r: 8, stroke: "#3B82F6", strokeWidth: 2, fill: "#ffffff" }}
                    name="Portfolio"
                    filter="drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="nifty50" 
                    stroke="#10B981" 
                    strokeWidth={4}
                    dot={{ r: 6, fill: "#10B981", strokeWidth: 2, stroke: "#ffffff" }}
                    activeDot={{ r: 8, stroke: "#10B981", strokeWidth: 2, fill: "#ffffff" }}
                    name="Nifty 50"
                    filter="drop-shadow(0 2px 4px rgba(16, 185, 129, 0.3))"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="gold" 
                    stroke="#F59E0B" 
                    strokeWidth={4}
                    dot={{ r: 6, fill: "#F59E0B", strokeWidth: 2, stroke: "#ffffff" }}
                    activeDot={{ r: 8, stroke: "#F59E0B", strokeWidth: 2, fill: "#ffffff" }}
                    name="Gold"
                    filter="drop-shadow(0 2px 4px rgba(245, 158, 11, 0.3))"
                  />
                </LineChart>
              ) : (
                <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <defs>
                    <linearGradient id="portfolioArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05}/>
                    </linearGradient>
                    <linearGradient id="niftyArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.05}/>
                    </linearGradient>
                    <linearGradient id="goldArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.5} />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate}
                    stroke="#6B7280"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis 
                    tickFormatter={formatCurrency}
                    stroke="#6B7280"
                    fontSize={12}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="circle"
                  />
                  <Area
                    type="monotone"
                    dataKey="portfolio"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    fill="url(#portfolioArea)"
                    name="Portfolio"
                  />
                  <Area
                    type="monotone"
                    dataKey="nifty50"
                    stroke="#10B981"
                    strokeWidth={3}
                    fill="url(#niftyArea)"
                    name="Nifty 50"
                  />
                  <Area
                    type="monotone"
                    dataKey="gold"
                    stroke="#F59E0B"
                    strokeWidth={3}
                    fill="url(#goldArea)"
                    name="Gold"
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Data Available</h3>
                <p className="text-gray-500">Performance data will appear here once available</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Performance Insights */}
      {returns && (
        <div className="mt-8 bg-gradient-to-r from-indigo-50 via-white to-purple-50 rounded-xl p-6 border border-indigo-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="w-6 h-6 bg-indigo-500 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </span>
            Performance Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Best Performer</div>
              <div className="font-bold text-green-600">
                {Object.entries(returns).reduce((best, [key, values]) => 
                  values[selectedPeriod] > best.value ? { name: key, value: values[selectedPeriod] } : best, 
                  { name: '', value: -Infinity }
                ).name.charAt(0).toUpperCase() + Object.entries(returns).reduce((best, [key, values]) => 
                  values[selectedPeriod] > best.value ? { name: key, value: values[selectedPeriod] } : best, 
                  { name: '', value: -Infinity }
                ).name.slice(1)}
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Volatility</div>
              <div className="font-bold text-blue-600">
                {returns.portfolio[selectedPeriod] > returns.nifty50[selectedPeriod] ? 'Higher' : 'Lower'} than Market
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Risk Profile</div>
              <div className="font-bold text-purple-600">
                {Math.abs(returns.portfolio[selectedPeriod]) > 10 ? 'High Risk' : 'Moderate Risk'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceChart;