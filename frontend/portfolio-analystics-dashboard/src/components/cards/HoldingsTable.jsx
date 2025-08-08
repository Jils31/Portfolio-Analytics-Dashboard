import React from 'react';

const HoldingsTable = ({ holdings, sortConfig, sortData, formatters }) => {
  const { formatCurrency, formatNumber, getGainLossColor, getGainLossIcon, getSortIcon } = formatters;

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
            {holdings.map((item, index) => (
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
          {holdings.map((item, index) => (
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
  );
};

export default HoldingsTable;