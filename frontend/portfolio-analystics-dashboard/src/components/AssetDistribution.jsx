import React, { useEffect, useState } from 'react';
import { fetchAssetDistribution } from '../services/api';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

// Enhanced color palettes
const SECTOR_COLORS = [
  '#6366F1', '#8B5CF6', '#EC4899', '#EF4444', '#F97316', 
  '#F59E0B', '#EAB308', '#84CC16', '#22C55E', '#10B981',
  '#14B8A6', '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1'
];

const MARKET_CAP_COLORS = [
  '#1E40AF', // Large Cap - Deep Blue
  '#7C3AED', // Mid Cap - Purple
  '#DC2626', // Small Cap - Red
];

const AssetDistribution = () => {
  const [bySector, setBySector] = useState({});
  const [byMarketCap, setByMarketCap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const [viewMode, setViewMode] = useState('pie'); // 'pie' or 'bar'
  const [selectedChart, setSelectedChart] = useState('both'); // 'sector', 'marketcap', 'both'

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const res = await fetchAssetDistribution();
        setBySector(res.data.bySector || {});
        setByMarketCap(res.data.byMarketCap || {});
      } catch (err) {
        console.error('Error fetching asset distribution:', err);
        setError('Failed to load asset distribution data');
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  const convertToChartData = (dataObj, type = 'sector') => {
    return Object.entries(dataObj).map(([name, value], index) => ({
      name,
      value: value.value,
      percentage: value.percentage,
      color: type === 'sector' 
        ? SECTOR_COLORS[index % SECTOR_COLORS.length] 
        : MARKET_CAP_COLORS[index % MARKET_CAP_COLORS.length]
    }));
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

  const renderCustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      const { name, value, percentage } = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-gray-200/50">
          <div className="font-bold text-gray-800 mb-2 text-center border-b border-gray-200 pb-2">
            {name}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Value:</span>
              <span className="font-bold text-blue-600">{formatCurrency(value)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Share:</span>
              <span className="font-bold text-green-600">{percentage}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage, name }) => {
    if (percentage < 5) return null; // Don't show labels for small segments
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="600"
        filter="drop-shadow(0 1px 2px rgba(0,0,0,0.5))"
      >
        {`${percentage}%`}
      </text>
    );
  };

  const onPieEnter = (data, index, type) => {
    setHoveredSegment({ type, index, data });
  };

  const onPieLeave = () => {
    setHoveredSegment(null);
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50 rounded-2xl shadow-2xl p-8">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-8">
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/3"></div>
            <div className="flex space-x-2">
              <div className="h-8 w-20 bg-gray-200 rounded-full"></div>
              <div className="h-8 w-20 bg-gray-200 rounded-full"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-6 h-96"></div>
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-6 h-96"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl shadow-2xl p-8">
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

  const sectorData = convertToChartData(bySector, 'sector');
  const marketCapData = convertToChartData(byMarketCap, 'marketcap');
  const totalValue = [...sectorData, ...marketCapData].reduce((sum, item) => sum + item.value, 0) / 2;

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50 rounded-2xl shadow-2xl p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
        <div className="mb-4 lg:mb-0">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent mb-2">
            Asset Distribution
          </h2>
          <p className="text-gray-600">
            Portfolio allocation across sectors and market caps • Total: {formatCurrency(totalValue)}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          {/* View Mode Toggle */}
          <div className="flex bg-white rounded-xl p-1 shadow-lg border border-gray-200">
            <button
              onClick={() => setViewMode('pie')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                viewMode === 'pie'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
              Pie Charts
            </button>
            <button
              onClick={() => setViewMode('bar')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                viewMode === 'bar'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Bar Charts
            </button>
          </div>

          {/* Chart Selector for Mobile */}
          <div className="flex bg-white rounded-xl p-1 shadow-lg border border-gray-200 lg:hidden">
            <button
              onClick={() => setSelectedChart('sector')}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                selectedChart === 'sector'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sectors
            </button>
            <button
              onClick={() => setSelectedChart('marketcap')}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                selectedChart === 'marketcap'
                  ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Market Cap
            </button>
            <button
              onClick={() => setSelectedChart('both')}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                selectedChart === 'both'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Both
            </button>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className={`grid gap-8 ${
        selectedChart === 'both' 
          ? 'grid-cols-1 lg:grid-cols-2' 
          : 'grid-cols-1 max-w-4xl mx-auto'
      }`}>
        {/* Sector Distribution */}
        {(selectedChart === 'sector' || selectedChart === 'both') && (
          <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 hover:shadow-2xl transition-all duration-500 border border-gray-200/50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-1">Sector Distribution</h3>
                <p className="text-gray-600 text-sm">Investment allocation across industry sectors</p>
              </div>
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-4 py-2 rounded-xl text-sm font-semibold shadow-sm">
                {sectorData.length} Sectors
              </div>
            </div>
            
            {sectorData.length === 0 ? (
              <div className="flex items-center justify-center h-80 text-gray-500">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-600 mb-2">No Sector Data</h4>
                  <p className="text-gray-500">Sector distribution will appear here</p>
                </div>
              </div>
            ) : (
              <div className="relative">
                <ResponsiveContainer width="100%" height={viewMode === 'pie' ? 400 : 300}>
                  {viewMode === 'pie' ? (
                    <PieChart>
                      <defs>
                        {sectorData.map((entry, index) => (
                          <linearGradient key={`gradient-${index}`} id={`sectorGradient-${index}`} x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor={entry.color} stopOpacity={1}/>
                            <stop offset="100%" stopColor={entry.color} stopOpacity={0.7}/>
                          </linearGradient>
                        ))}
                      </defs>
                      <Pie
                        data={sectorData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={140}
                        innerRadius={80}
                        paddingAngle={2}
                        onMouseEnter={(data, index) => onPieEnter(data, index, 'sector')}
                        onMouseLeave={onPieLeave}
                        labelLine={false}
                        label={renderCustomLabel}
                      >
                        {sectorData.map((entry, index) => (
                          <Cell 
                            key={`sector-cell-${index}`} 
                            fill={`url(#sectorGradient-${index})`}
                            stroke={hoveredSegment?.type === 'sector' && hoveredSegment?.index === index ? '#1F2937' : 'none'}
                            strokeWidth={hoveredSegment?.type === 'sector' && hoveredSegment?.index === index ? 3 : 0}
                            style={{
                              filter: hoveredSegment?.type === 'sector' && hoveredSegment?.index === index 
                                ? 'brightness(1.1) drop-shadow(0 8px 16px rgba(0,0,0,0.25))' 
                                : 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
                              transform: hoveredSegment?.type === 'sector' && hoveredSegment?.index === index 
                                ? 'scale(1.05)' 
                                : 'scale(1)',
                              transformOrigin: 'center',
                              transition: 'all 0.3s ease-in-out'
                            }}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={renderCustomTooltip} />
                      <Legend 
                        layout="vertical" 
                        align="right" 
                        verticalAlign="middle"
                        wrapperStyle={{ paddingLeft: '20px', fontSize: '12px' }}
                        iconType="circle"
                      />
                    </PieChart>
                  ) : (
                    <BarChart data={sectorData} margin={{ top: 20, right: 30, left: 40, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.5} />
                      <XAxis 
                        dataKey="name" 
                        angle={-45} 
                        textAnchor="end" 
                        height={80}
                        fontSize={10}
                        stroke="#6B7280"
                      />
                      <YAxis 
                        tickFormatter={formatCurrency}
                        fontSize={10}
                        stroke="#6B7280"
                      />
                      <Tooltip content={renderCustomTooltip} />
                      <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]}>
                        {sectorData.map((entry, index) => (
                          <Cell key={`bar-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  )}
                </ResponsiveContainer>

                {hoveredSegment?.type === 'sector' && viewMode === 'pie' && (
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-gray-200/50 min-w-48">
                    <div className="text-sm font-bold text-gray-800 mb-1">
                      {hoveredSegment.data.name}
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>Value: {formatCurrency(hoveredSegment.data.value)}</div>
                      <div>Share: {hoveredSegment.data.percentage}%</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Market Cap Distribution */}
        {(selectedChart === 'marketcap' || selectedChart === 'both') && (
          <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 hover:shadow-2xl transition-all duration-500 border border-gray-200/50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-1">Market Cap Distribution</h3>
                <p className="text-gray-600 text-sm">Investment allocation by company size</p>
              </div>
              <div className="bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700 px-4 py-2 rounded-xl text-sm font-semibold shadow-sm">
                Cap Sizes
              </div>
            </div>
            
            {marketCapData.length === 0 ? (
              <div className="flex items-center justify-center h-80 text-gray-500">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-600 mb-2">No Market Cap Data</h4>
                  <p className="text-gray-500">Market cap distribution will appear here</p>
                </div>
              </div>
            ) : (
              <div className="relative">
                <ResponsiveContainer width="100%" height={viewMode === 'pie' ? 400 : 300}>
                  {viewMode === 'pie' ? (
                    <PieChart>
                      <defs>
                        {marketCapData.map((entry, index) => (
                          <linearGradient key={`mcap-gradient-${index}`} id={`mcapGradient-${index}`} x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor={entry.color} stopOpacity={1}/>
                            <stop offset="100%" stopColor={entry.color} stopOpacity={0.7}/>
                          </linearGradient>
                        ))}
                      </defs>
                      <Pie
                        data={marketCapData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={140}
                        paddingAngle={4}
                        onMouseEnter={(data, index) => onPieEnter(data, index, 'marketcap')}
                        onMouseLeave={onPieLeave}
                        labelLine={false}
                        label={renderCustomLabel}
                      >
                        {marketCapData.map((entry, index) => (
                          <Cell 
                            key={`mcap-cell-${index}`} 
                            fill={`url(#mcapGradient-${index})`}
                            stroke={hoveredSegment?.type === 'marketcap' && hoveredSegment?.index === index ? '#1F2937' : 'none'}
                            strokeWidth={hoveredSegment?.type === 'marketcap' && hoveredSegment?.index === index ? 3 : 0}
                            style={{
                              filter: hoveredSegment?.type === 'marketcap' && hoveredSegment?.index === index 
                                ? 'brightness(1.1) drop-shadow(0 8px 16px rgba(0,0,0,0.25))' 
                                : 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
                              transform: hoveredSegment?.type === 'marketcap' && hoveredSegment?.index === index 
                                ? 'scale(1.05)' 
                                : 'scale(1)',
                              transformOrigin: 'center',
                              transition: 'all 0.3s ease-in-out'
                            }}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={renderCustomTooltip} />
                      <Legend 
                        layout="horizontal" 
                        align="center" 
                        verticalAlign="bottom"
                        wrapperStyle={{ paddingTop: '20px', fontSize: '14px' }}
                        iconType="circle"
                      />
                    </PieChart>
                  ) : (
                    <BarChart data={marketCapData} margin={{ top: 20, right: 30, left: 40, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.5} />
                      <XAxis 
                        dataKey="name" 
                        fontSize={12}
                        stroke="#6B7280"
                      />
                      <YAxis 
                        tickFormatter={formatCurrency}
                        fontSize={12}
                        stroke="#6B7280"
                      />
                      <Tooltip content={renderCustomTooltip} />
                      <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]}>
                        {marketCapData.map((entry, index) => (
                          <Cell key={`mcap-bar-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  )}
                </ResponsiveContainer>

                {hoveredSegment?.type === 'marketcap' && viewMode === 'pie' && (
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-gray-200/50 min-w-48">
                    <div className="text-sm font-bold text-gray-800 mb-1">
                      {hoveredSegment.data.name}
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>Value: {formatCurrency(hoveredSegment.data.value)}</div>
                      <div>Share: {hoveredSegment.data.percentage}%</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  )}

  export default AssetDistribution;