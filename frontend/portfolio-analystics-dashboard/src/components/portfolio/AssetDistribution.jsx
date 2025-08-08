import React, { useEffect, useState } from "react";
import { fetchAssetDistribution } from "../../services/api";
import SectorChart from "../charts/SectorChart";
import MarketCapChart from "../charts/MarketCapChart";
import Loader from "../common/Loader";
import ErrorMessage from "../common/ErrorMessage";

const AssetDistribution = () => {
  const [bySector, setBySector] = useState({});
  const [byMarketCap, setByMarketCap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("pie"); // 'pie' or 'bar'
  const [selectedChart, setSelectedChart] = useState("both"); // 'sector', 'marketcap', 'both'

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const res = await fetchAssetDistribution();
        setBySector(res.data.bySector || {});
        setByMarketCap(res.data.byMarketCap || {});
      } catch (err) {
        console.error("Error fetching asset distribution:", err);
        setError("Failed to load asset distribution data");
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  const handleRetry = () => {
    fetchData();
  };

  const formatCurrency = (value) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(1)}Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    } else if (value >= 1000) {
      return `₹${(value / 1000).toFixed(1)}K`;
    }
    return `₹${value.toLocaleString("en-IN")}`;
  };

  if (loading) {
    return (
      <Loader
        title="Loading Asset Distribution"
        subtitle="Analyzing your asset distribution"
        showMetricCards={false}
        showChart={true}
      />
    );
  }

  if (error) {
    return (
      <ErrorMessage
        title="Unable to Load Asset Distribution"
        message={error}
        onRetry={handleRetry}
        retryText="Reload Assets Distribution"
      />
    );
  }

  const sectorData = Object.entries(bySector);
  const marketCapData = Object.entries(byMarketCap);
  const totalValue =
    [...sectorData, ...marketCapData].reduce(
      (sum, [_, value]) => sum + value.value,
      0
    ) / 2;

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50 rounded-2xl shadow-2xl p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
        <div className="mb-4 lg:mb-0">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent mb-2">
            Asset Distribution
          </h2>
          <p className="text-gray-600">
            Portfolio allocation across sectors and market caps • Total:{" "}
            {formatCurrency(totalValue)}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* View Mode Toggle */}
          <div className="flex bg-white rounded-xl p-1 shadow-lg border border-gray-200">
            <button
              onClick={() => setViewMode("pie")}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                viewMode === "pie"
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <svg
                className="w-4 h-4 inline mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                />
              </svg>
              Pie Charts
            </button>
            <button
              onClick={() => setViewMode("bar")}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                viewMode === "bar"
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <svg
                className="w-4 h-4 inline mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Bar Charts
            </button>
          </div>

          {/* Chart Selector for Mobile */}
          <div className="flex bg-white rounded-xl p-1 shadow-lg border border-gray-200 lg:hidden">
            <button
              onClick={() => setSelectedChart("sector")}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                selectedChart === "sector"
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Sectors
            </button>
            <button
              onClick={() => setSelectedChart("marketcap")}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                selectedChart === "marketcap"
                  ? "bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Market Cap
            </button>
            <button
              onClick={() => setSelectedChart("both")}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                selectedChart === "both"
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Both
            </button>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div
        className={`grid gap-8 ${
          selectedChart === "both"
            ? "grid-cols-1 lg:grid-cols-2"
            : "grid-cols-1 max-w-4xl mx-auto"
        }`}
      >
        {/* Sector Distribution */}
        {(selectedChart === "sector" || selectedChart === "both") && (
          <SectorChart bySector={bySector} viewMode={viewMode} />
        )}

        {/* Market Cap Distribution */}
        {(selectedChart === "marketcap" || selectedChart === "both") && (
          <MarketCapChart byMarketCap={byMarketCap} viewMode={viewMode} />
        )}
      </div>
    </div>
  );
};

export default AssetDistribution;
