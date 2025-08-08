import React, { useState } from 'react';
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

const MARKET_CAP_COLORS = [
  '#1E40AF', // Large Cap - Deep Blue
  '#7C3AED', // Mid Cap - Purple
  '#DC2626', // Small Cap - Red
];

const MarketCapChart = ({ byMarketCap, viewMode }) => {
  const [hoveredSegment, setHoveredSegment] = useState(null);

  const convertToChartData = (dataObj) => {
    return Object.entries(dataObj).map(([name, value], index) => ({
      name,
      value: value.value,
      percentage: value.percentage,
      color: MARKET_CAP_COLORS[index % MARKET_CAP_COLORS.length]
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

  const onPieEnter = (data, index) => {
    setHoveredSegment({ index, data });
  };

  const onPieLeave = () => {
    setHoveredSegment(null);
  };

  const marketCapData = convertToChartData(byMarketCap);

  return (
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
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                  labelLine={false}
                  label={renderCustomLabel}
                >
                  {marketCapData.map((entry, index) => (
                    <Cell 
                      key={`mcap-cell-${index}`} 
                      fill={`url(#mcapGradient-${index})`}
                      stroke={hoveredSegment?.index === index ? '#1F2937' : 'none'}
                      strokeWidth={hoveredSegment?.index === index ? 3 : 0}
                      style={{
                        filter: hoveredSegment?.index === index 
                          ? 'brightness(1.1) drop-shadow(0 8px 16px rgba(0,0,0,0.25))' 
                          : 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
                        transform: hoveredSegment?.index === index 
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

          {hoveredSegment && viewMode === 'pie' && (
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
  );
};

export default MarketCapChart;