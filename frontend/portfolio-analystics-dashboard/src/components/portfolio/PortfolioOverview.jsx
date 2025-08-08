import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, PieChart,  RefreshCw } from 'lucide-react';
import { fetchPortfolioOverview } from '../../services/api';
import Loader from "../common/Loader";
import ErrorMessage from "../common/ErrorMessage";

const PortfolioOverview = () => {
  const [overviewData, setOverviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchPortfolioOverview();
      setOverviewData(res.data.data);
    } catch (err) {
      console.error('Error fetching portfolio overview:', err);
      setError('Failed to load portfolio data. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    if (value == null) return '₹0';
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value) => {
    if (value == null) return '0%';
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const handleRetry = () => {
    getData()
  }

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
        title="Unable to Load Portfolio Overview"
        message={error}
        onRetry={handleRetry}
        retryText="Reload Portfolio Overview"
      />
    );
  }

  if (!overviewData) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <PieChart className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Portfolio Data</h3>
        <p className="text-slate-500">Portfolio overview is not available at the moment.</p>
      </div>
    );
  }

  const {
    totalPortfolioValue,
    totalInvestment,
    totalGainLoss,
    totalGainLossPercent,
    numberOfHoldings
  } = overviewData;

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 transition-all duration-300 hover:shadow-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Portfolio Overview</h2>
          <p className="text-slate-600 mt-1">Track your investment performance</p>
        </div>
        <button 
          onClick={getData}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all duration-200"
          title="Refresh data"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Portfolio Value */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-600 leading-tight">Total Portfolio Value</h3>
            <div className="p-2 rounded-xl bg-blue-100 group-hover:scale-110 transition-transform duration-200">
              <DollarSign className="h-5 w-5 text-blue-700" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-blue-700">{formatCurrency(totalPortfolioValue)}</p>
            {totalInvestment && (
              <p className="text-xs text-slate-500">
                Invested: {formatCurrency(totalInvestment)}
              </p>
            )}
          </div>
        </div>

        {/* Total Gain/Loss */}
        <div className={`rounded-2xl p-6 border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group ${
          totalGainLoss >= 0
            ? 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200'
            : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-600 leading-tight">Total Gain/Loss</h3>
            <div className={`p-2 rounded-xl group-hover:scale-110 transition-transform duration-200 ${
              totalGainLoss >= 0 ? 'bg-emerald-100' : 'bg-red-100'
            }`}>
              {totalGainLoss >= 0 ? 
                <TrendingUp className={`h-5 w-5 ${totalGainLoss >= 0 ? 'text-emerald-700' : 'text-red-700'}`} /> :
                <TrendingDown className={`h-5 w-5 ${totalGainLoss >= 0 ? 'text-emerald-700' : 'text-red-700'}`} />
              }
            </div>
          </div>
          <div className="space-y-1">
            <p className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
              {formatCurrency(totalGainLoss)}
            </p>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              {totalGainLoss >= 0 ? 
                <TrendingUp className="h-3 w-3 text-emerald-500" /> : 
                <TrendingDown className="h-3 w-3 text-red-500" />
              }
              {totalGainLoss >= 0 ? 'Profit' : 'Loss'}
            </p>
          </div>
        </div>

        {/* Portfolio Performance % */}
        <div className={`rounded-2xl p-6 border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group ${
          totalGainLossPercent >= 0
            ? 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200'
            : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-600 leading-tight">Portfolio Performance</h3>
            <div className={`p-2 rounded-xl group-hover:scale-110 transition-transform duration-200 ${
              totalGainLossPercent >= 0 ? 'bg-emerald-100' : 'bg-red-100'
            }`}>
              {totalGainLossPercent >= 0 ? 
                <TrendingUp className={`h-5 w-5 ${totalGainLossPercent >= 0 ? 'text-emerald-700' : 'text-red-700'}`} /> :
                <TrendingDown className={`h-5 w-5 ${totalGainLossPercent >= 0 ? 'text-emerald-700' : 'text-red-700'}`} />
              }
            </div>
          </div>
          <div className="space-y-1">
            <p className={`text-2xl font-bold ${totalGainLossPercent >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
              {formatPercentage(totalGainLossPercent)}
            </p>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              {totalGainLossPercent >= 0 ? 
                <TrendingUp className="h-3 w-3 text-emerald-500" /> : 
                <TrendingDown className="h-3 w-3 text-red-500" />
              }
              Overall Return
            </p>
          </div>
        </div>

        {/* Number of Holdings */}
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-600 leading-tight">Number of Holdings</h3>
            <div className="p-2 rounded-xl bg-amber-100 group-hover:scale-110 transition-transform duration-200">
              <PieChart className="h-5 w-5 text-amber-700" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-amber-700">{numberOfHoldings || '0'}</p>
            <p className="text-xs text-slate-500">Active Investments</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioOverview;