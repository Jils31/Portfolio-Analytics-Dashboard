import React from 'react';

const Loader = ({ 
  title = "Loading...", 
  subtitle = "Please wait while we fetch your data",
  showMetricCards = false,
  showChart = true,
  className = ""
}) => {
  return (
    <div className={`bg-gradient-to-br from-slate-50 via-white to-blue-50 rounded-2xl shadow-2xl p-8 ${className}`}>
      <div className="animate-pulse">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex-1">
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
          <div className="flex space-x-2">
            <div className="h-8 w-20 bg-gray-200 rounded-full"></div>
            <div className="h-8 w-20 bg-gray-200 rounded-full"></div>
            <div className="h-8 w-20 bg-gray-200 rounded-full"></div>
          </div>
        </div>

        {/* Metric Cards */}
        {showMetricCards && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-6 h-32">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                  <div className="w-8 h-8 bg-gray-300 rounded-lg"></div>
                </div>
                <div className="h-6 bg-gray-300 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        )}

        {/* Chart Area */}
        {showChart && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="h-6 bg-gray-300 rounded w-1/4"></div>
              <div className="flex space-x-2">
                <div className="h-8 w-20 bg-gray-200 rounded-lg"></div>
                <div className="h-8 w-20 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
            <div className="h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm">{subtitle}</p>
              </div>
            </div>
          </div>
        )}

        {/* Simple loader for components without chart */}
        {!showChart && !showMetricCards && (
          <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">{title}</h3>
              <p className="text-gray-500 text-sm">{subtitle}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Loader;