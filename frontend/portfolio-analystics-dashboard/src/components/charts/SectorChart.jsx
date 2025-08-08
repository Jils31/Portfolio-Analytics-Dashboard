import React, { useState, useEffect } from 'react';
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

const SECTOR_COLORS = [
  '#6366F1', '#8B5CF6', '#EC4899', '#EF4444', '#F97316', 
  '#F59E0B', '#EAB308', '#84CC16', '#22C55E', '#10B981',
  '#14B8A6', '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1'
];

const SectorChart = ({ bySector, viewMode }) => {
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const convertToChartData = (dataObj) => {
    return Object.entries(dataObj).map(([name, value], index) => ({
      name,
      value: value.value,
      percentage: value.percentage,
      color: SECTOR_COLORS[index % SECTOR_COLORS.length]
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
        <div className={`bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-200/50 ${
          isMobile ? 'p-2 max-w-[200px]' : 'p-4'
        }`}>
          <div className={`font-bold text-gray-800 border-b border-gray-200 pb-2 ${
            isMobile ? 'text-xs mb-1 text-center break-words' : 'mb-2 text-center'
          }`}>
            {name}
          </div>
          <div className={`space-y-${isMobile ? '1' : '2'}`}>
            <div className="flex items-center justify-between">
              <span className={`text-gray-600 ${isMobile ? 'text-xs' : ''}`}>Value:</span>
              <span className={`font-bold text-blue-600 ${isMobile ? 'text-xs' : ''}`}>
                {formatCurrency(value)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-gray-600 ${isMobile ? 'text-xs' : ''}`}>Share:</span>
              <span className={`font-bold text-green-600 ${isMobile ? 'text-xs' : ''}`}>
                {percentage}%
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage, name }) => {
    // On mobile, only show labels for segments > 8% to reduce clutter
    const minPercentage = isMobile ? 8 : 5;
    if (percentage < minPercentage) return null;
    
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
        fontSize={isMobile ? 10 : 12}
        fontWeight="600"
        filter="drop-shadow(0 1px 2px rgba(0,0,0,0.5))"
      >
        {`${percentage}%`}
      </text>
    );
  };

  const onPieEnter = (data, index) => {
    // Disable hover effects on mobile to prevent tooltip issues
    if (!isMobile) {
      setHoveredSegment({ index, data });
    }
  };

  const onPieLeave = () => {
    if (!isMobile) {
      setHoveredSegment(null);
    }
  };

  const sectorData = convertToChartData(bySector);

  return (
    <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-200/50 p-4 sm:p-6 lg:p-8">
      <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'items-center justify-between'} mb-4 sm:mb-6`}>
        <div>
          <h3 className={`font-bold text-gray-800 mb-1 ${isMobile ? 'text-lg' : 'text-2xl'}`}>
            Sector Distribution
          </h3>
          <p className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>
            Investment allocation across industry sectors
          </p>
        </div>
        <div className={`bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-xl font-semibold shadow-sm ${
          isMobile ? 'px-3 py-1 text-xs self-start' : 'px-4 py-2 text-sm'
        }`}>
          {sectorData.length} Sectors
        </div>
      </div>
      
      {sectorData.length === 0 ? (
        <div className={`flex items-center justify-center text-gray-500 ${isMobile ? 'h-60' : 'h-80'}`}>
          <div className="text-center">
            <div className={`bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 ${
              isMobile ? 'w-16 h-16' : 'w-20 h-20'
            }`}>
              <svg className={`text-gray-400 ${isMobile ? 'w-8 h-8' : 'w-10 h-10'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h4 className={`font-semibold text-gray-600 mb-2 ${isMobile ? 'text-base' : 'text-lg'}`}>
              No Sector Data
            </h4>
            <p className={`text-gray-500 ${isMobile ? 'text-sm' : ''}`}>
              Sector distribution will appear here
            </p>
          </div>
        </div>
      ) : (
        <div className="relative">
          <ResponsiveContainer width="100%" height={isMobile ? (viewMode === 'pie' ? 320 : 250) : (viewMode === 'pie' ? 400 : 300)}>
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
                  outerRadius={isMobile ? 100 : 140}
                  innerRadius={isMobile ? 60 : 80}
                  paddingAngle={2}
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                  labelLine={false}
                  label={renderCustomLabel}
                >
                  {sectorData.map((entry, index) => (
                    <Cell 
                      key={`sector-cell-${index}`} 
                      fill={`url(#sectorGradient-${index})`}
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
                <Tooltip 
                  content={renderCustomTooltip}
                  position={isMobile ? { x: 10, y: 10 } : undefined}
                />
                <Legend 
                  layout={isMobile ? "horizontal" : "vertical"}
                  align={isMobile ? "center" : "right"}
                  verticalAlign={isMobile ? "bottom" : "middle"}
                  wrapperStyle={{ 
                    paddingLeft: isMobile ? '0px' : '20px', 
                    paddingTop: isMobile ? '10px' : '0px',
                    fontSize: isMobile ? '10px' : '12px',
                    lineHeight: isMobile ? '1.2' : 'normal'
                  }}
                  iconType="circle"
                />
              </PieChart>
            ) : (
              <BarChart 
                data={sectorData} 
                margin={{ 
                  top: 20, 
                  right: isMobile ? 10 : 30, 
                  left: isMobile ? 20 : 40, 
                  bottom: isMobile ? 80 : 60 
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.5} />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={isMobile ? 100 : 80}
                  fontSize={isMobile ? 8 : 10}
                  stroke="#6B7280"
                  interval={0}
                />
                <YAxis 
                  tickFormatter={formatCurrency}
                  fontSize={isMobile ? 8 : 10}
                  stroke="#6B7280"
                  width={isMobile ? 50 : 60}
                />
                <Tooltip 
                  content={renderCustomTooltip}
                  position={isMobile ? { x: 10, y: 10 } : undefined}
                />
                <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]}>
                  {sectorData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>

          {/* Desktop hover info - hidden on mobile */}
          {hoveredSegment && viewMode === 'pie' && !isMobile && (
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

export default SectorChart;