import React from 'react';

const HoldingsCard = ({ holdings, formatters }) => {
  const { formatCurrency, formatNumber, getGainLossColor, getGainLossIcon } = formatters;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {holdings.map((item, index) => (
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
  );
};

export default HoldingsCard;