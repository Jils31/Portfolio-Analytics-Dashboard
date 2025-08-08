import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Area, AreaChart
} from 'recharts';

const PerformanceChart = ({ data = [], returns = null }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('1year');
  const [chartType, setChartType] = useState('line');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: isMobile ? 'numeric' : 'short', 
      day: 'numeric' 
    });
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
        <div className={`bg-white/95 backdrop-blur-sm border border-gray-200/50 rounded-xl shadow-2xl ${
          isMobile ? 'p-2 max-w-[200px]' : 'p-4'
        }`}>
          <p className={`font-semibold text-gray-800 text-center border-b border-gray-200 pb-2 ${
            isMobile ? 'text-xs mb-2' : 'mb-3'
          }`}>
            {formatDate(label)}
          </p>
          {payload.map((entry, index) => (
            <div key={index} className={`flex items-center justify-between ${
              isMobile ? 'mb-1 last:mb-0' : 'mb-2 last:mb-0'
            }`}>
              <div className="flex items-center">
                <div 
                  className={`rounded-full shadow-sm ${isMobile ? 'w-3 h-3 mr-2' : 'w-4 h-4 mr-3'}`} 
                  style={{ backgroundColor: entry.color }}
                />
                <span className={`font-medium capitalize text-gray-700 ${
                  isMobile ? 'text-xs' : 'text-sm'
                }`}>
                  {entry.dataKey === 'nifty50' ? 'Nifty 50' : entry.dataKey}:
                </span>
              </div>
              <span className={`font-bold text-gray-900 ${
                isMobile ? 'text-xs ml-2' : 'ml-4'
              }`}>
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

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className={`flex ${isMobile ? 'flex-col space-y-4' : 'flex-col md:flex-row md:items-center justify-between'} mb-6 sm:mb-8`}>
        <div>
          <h2 className={`font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent mb-2 ${
            isMobile ? 'text-xl' : 'text-3xl'
          }`}>
            Performance Analytics
          </h2>
          <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>
            Compare your portfolio against market benchmarks
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Period Selector */}
          <div className={`flex bg-white rounded-xl shadow-lg border border-gray-200 ${
            isMobile ? 'p-0.5' : 'p-1'
          }`}>
            {periods.map((period) => (
              <button
                key={period.key}
                onClick={() => setSelectedPeriod(period.key)}
                className={`rounded-lg font-semibold transition-all duration-300 ${
                  isMobile ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'
                } ${
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
        <div className={`grid gap-4 mb-6 sm:mb-8 ${
          isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-4'
        } ${isMobile ? 'gap-3' : 'gap-6'}`}>
          <div className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl text-white shadow-xl ${
            isMobile ? 'p-4' : 'p-6'
          }`}>
            <div className={`flex items-center justify-between ${isMobile ? 'mb-3' : 'mb-4'}`}>
              <h3 className={`font-bold ${isMobile ? 'text-base' : 'text-lg'}`}>
                Asset Performance
              </h3>
              <div className={`bg-white/20 rounded-lg flex items-center justify-center ${
                isMobile ? 'w-6 h-6' : 'w-8 h-8'
              }`}>
                <svg className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className={`space-y-2 ${isMobile ? 'text-xs' : 'text-sm'}`}>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Period:</span>
                <span className="font-semibold text-white">
                  {periods.find(p => p.key === selectedPeriod)?.label}
                </span>
              </div>
              <div className={`text-gray-400 mt-3 ${isMobile ? 'text-xs' : 'text-xs'}`}>
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
              <div key={asset} className={`bg-gradient-to-br ${colors[index].from} ${colors[index].to} rounded-xl text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 ${
                isMobile ? 'p-4' : 'p-6'
              }`}>
                <div className={`flex items-center justify-between ${isMobile ? 'mb-3' : 'mb-4'}`}>
                  <div className="flex items-center space-x-3">
                    <span className={isMobile ? 'text-lg' : 'text-2xl'}>
                      {colors[index].icon}
                    </span>
                    <h3 className={`font-bold capitalize ${isMobile ? 'text-sm' : 'text-lg'}`}>
                      {asset === 'nifty50' ? 'Nifty 50' : asset}
                    </h3>
                  </div>
                  <span className={`font-bold ${isMobile ? 'text-lg' : 'text-2xl'}`}>
                    {getReturnIcon(returnValue)}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className={`font-bold ${isMobile ? 'text-xl' : 'text-3xl'}`}>
                    {returnValue > 0 ? '+' : ''}{returnValue}%
                  </div>
                  <div className={`text-white/80 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                    {returnValue > 0 ? 'Profit' : returnValue < 0 ? 'Loss' : 'Break Even'}
                  </div>
                </div>

                <div className={`bg-white/20 rounded-lg p-2 ${isMobile ? 'mt-3' : 'mt-4'}`}>
                  <div className={`flex justify-between ${isMobile ? 'text-xs' : 'text-xs'}`}>
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
      <div className={`bg-white rounded-xl shadow-lg border border-gray-200/50 ${
        isMobile ? 'p-4' : 'p-6'
      }`}>
        <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'items-center justify-between'} mb-4 sm:mb-6`}>
          <h3 className={`font-bold text-gray-800 ${isMobile ? 'text-lg' : 'text-xl'}`}>
            Performance Timeline
          </h3>
          <div className={`flex bg-gray-100 rounded-lg ${isMobile ? 'p-0.5 self-start' : 'p-1'}`}>
            <button
              onClick={() => setChartType('line')}
              className={`rounded-md font-medium transition-all duration-200 ${
                isMobile ? 'px-2.5 py-1 text-xs' : 'px-3 py-1 text-sm'
              } ${
                chartType === 'line'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Line Chart
            </button>
            <button
              onClick={() => setChartType('area')}
              className={`rounded-md font-medium transition-all duration-200 ${
                isMobile ? 'px-2.5 py-1 text-xs' : 'px-3 py-1 text-sm'
              } ${
                chartType === 'area'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Area Chart
            </button>
          </div>
        </div>

        <div className={`w-full ${isMobile ? 'h-72' : 'h-96'}`}>
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'line' ? (
                <LineChart 
                  data={data} 
                  margin={{ 
                    top: 20, 
                    right: isMobile ? 10 : 30, 
                    left: isMobile ? 10 : 20, 
                    bottom: isMobile ? 30 : 20 
                  }}
                >
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
                    fontSize={isMobile ? 10 : 12}
                    tickLine={false}
                    interval={isMobile ? 'preserveStartEnd' : 0}
                  />
                  <YAxis 
                    tickFormatter={formatCurrency}
                    stroke="#6B7280"
                    fontSize={isMobile ? 10 : 12}
                    tickLine={false}
                    width={isMobile ? 50 : 60}
                  />
                  <Tooltip 
                    content={<CustomTooltip />}
                    position={isMobile ? { x: 10, y: 10 } : undefined}
                  />
                  <Legend 
                    wrapperStyle={{ 
                      paddingTop: isMobile ? '15px' : '20px',
                      fontSize: isMobile ? '11px' : '12px'
                    }}
                    iconType="circle"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="portfolio" 
                    stroke="#3B82F6" 
                    strokeWidth={isMobile ? 3 : 4}
                    dot={{ r: isMobile ? 4 : 6, fill: "#3B82F6", strokeWidth: 2, stroke: "#ffffff" }}
                    activeDot={{ r: isMobile ? 6 : 8, stroke: "#3B82F6", strokeWidth: 2, fill: "#ffffff" }}
                    name="Portfolio"
                    filter="drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="nifty50" 
                    stroke="#10B981" 
                    strokeWidth={isMobile ? 3 : 4}
                    dot={{ r: isMobile ? 4 : 6, fill: "#10B981", strokeWidth: 2, stroke: "#ffffff" }}
                    activeDot={{ r: isMobile ? 6 : 8, stroke: "#10B981", strokeWidth: 2, fill: "#ffffff" }}
                    name="Nifty 50"
                    filter="drop-shadow(0 2px 4px rgba(16, 185, 129, 0.3))"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="gold" 
                    stroke="#F59E0B" 
                    strokeWidth={isMobile ? 3 : 4}
                    dot={{ r: isMobile ? 4 : 6, fill: "#F59E0B", strokeWidth: 2, stroke: "#ffffff" }}
                    activeDot={{ r: isMobile ? 6 : 8, stroke: "#F59E0B", strokeWidth: 2, fill: "#ffffff" }}
                    name="Gold"
                    filter="drop-shadow(0 2px 4px rgba(245, 158, 11, 0.3))"
                  />
                </LineChart>
              ) : (
                <AreaChart 
                  data={data} 
                  margin={{ 
                    top: 20, 
                    right: isMobile ? 10 : 30, 
                    left: isMobile ? 10 : 20, 
                    bottom: isMobile ? 30 : 20 
                  }}
                >
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
                    fontSize={isMobile ? 10 : 12}
                    tickLine={false}
                    interval={isMobile ? 'preserveStartEnd' : 0}
                  />
                  <YAxis 
                    tickFormatter={formatCurrency}
                    stroke="#6B7280"
                    fontSize={isMobile ? 10 : 12}
                    tickLine={false}
                    width={isMobile ? 50 : 60}
                  />
                  <Tooltip 
                    content={<CustomTooltip />}
                    position={isMobile ? { x: 10, y: 10 } : undefined}
                  />
                  <Legend 
                    wrapperStyle={{ 
                      paddingTop: isMobile ? '15px' : '20px',
                      fontSize: isMobile ? '11px' : '12px'
                    }}
                    iconType="circle"
                  />
                  <Area
                    type="monotone"
                    dataKey="portfolio"
                    stroke="#3B82F6"
                    strokeWidth={isMobile ? 2 : 3}
                    fill="url(#portfolioArea)"
                    name="Portfolio"
                  />
                  <Area
                    type="monotone"
                    dataKey="nifty50"
                    stroke="#10B981"
                    strokeWidth={isMobile ? 2 : 3}
                    fill="url(#niftyArea)"
                    name="Nifty 50"
                  />
                  <Area
                    type="monotone"
                    dataKey="gold"
                    stroke="#F59E0B"
                    strokeWidth={isMobile ? 2 : 3}
                    fill="url(#goldArea)"
                    name="Gold"
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          ) : (
            <div className={`flex items-center justify-center h-full text-gray-500`}>
              <div className="text-center">
                <div className={`bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  isMobile ? 'w-16 h-16' : 'w-20 h-20'
                }`}>
                  <svg className={`text-gray-400 ${isMobile ? 'w-8 h-8' : 'w-10 h-10'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className={`font-semibold text-gray-600 mb-2 ${isMobile ? 'text-base' : 'text-lg'}`}>
                  No Data Available
                </h3>
                <p className={`text-gray-500 ${isMobile ? 'text-sm' : ''}`}>
                  Performance data will appear here once available
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Performance Insights */}
      {returns && (
        <div className={`bg-gradient-to-r from-indigo-50 via-white to-purple-50 rounded-xl border border-indigo-200 ${
          isMobile ? 'mt-6 p-4' : 'mt-8 p-6'
        }`}>
          <h3 className={`font-semibold text-gray-800 flex items-center ${
            isMobile ? 'text-base mb-3' : 'text-lg mb-4'
          }`}>
            <span className={`bg-indigo-500 rounded-lg flex items-center justify-center mr-3 ${
              isMobile ? 'w-5 h-5' : 'w-6 h-6'
            }`}>
              <svg className={`text-white ${isMobile ? 'w-2.5 h-2.5' : 'w-3 h-3'}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </span>
            Performance Insights
          </h3>
          <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'}`}>
            <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${
              isMobile ? 'p-3' : 'p-4'
            }`}>
              <div className={`text-gray-600 mb-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                Best Performer
              </div>
              <div className={`font-bold text-green-600 ${isMobile ? 'text-sm' : ''}`}>
                {Object.entries(returns).reduce((best, [key, values]) => 
                  values[selectedPeriod] > best.value ? { name: key, value: values[selectedPeriod] } : best, 
                  { name: '', value: -Infinity }
                ).name.charAt(0).toUpperCase() + Object.entries(returns).reduce((best, [key, values]) => 
                  values[selectedPeriod] > best.value ? { name: key, value: values[selectedPeriod] } : best, 
                  { name: '', value: -Infinity }
                ).name.slice(1)}
              </div>
            </div>
            <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${
              isMobile ? 'p-3' : 'p-4'
            }`}>
              <div className={`text-gray-600 mb-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                Volatility
              </div>
              <div className={`font-bold text-blue-600 ${isMobile ? 'text-sm' : ''}`}>
                {returns.portfolio[selectedPeriod] > returns.nifty50[selectedPeriod] ? 'Higher' : 'Lower'} than Market
              </div>
            </div>
            <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${
              isMobile ? 'p-3' : 'p-4'
            }`}>
              <div className={`text-gray-600 mb-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                Risk Profile
              </div>
              <div className={`font-bold text-purple-600 ${isMobile ? 'text-sm' : ''}`}>
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