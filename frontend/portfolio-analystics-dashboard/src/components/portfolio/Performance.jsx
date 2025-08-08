import React, { useEffect, useState } from 'react';
import { fetchPerformance } from '../../services/api';
import PerformanceChart from '../charts/PerformanceChart';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';

const Performance = () => {
  const [data, setData] = useState([]);
  const [returns, setReturns] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchPerformance();
      setData(response.data.timeline || []);
      setReturns(response.data.returns || null);
    } catch (err) {
      console.error('Error fetching performance data:', err);
      setError('Failed to load performance data. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRetry = () => {
    fetchData();
  };

  if (loading) {
    return (
      <Loader 
        title="Loading Performance Data"
        subtitle="Analyzing your portfolio performance against market benchmarks"
        showMetricCards={true}
        showChart={true}
      />
    );
  }

  if (error) {
    return (
      <ErrorMessage
        title="Unable to Load Performance Data"
        message={error}
        onRetry={handleRetry}
        retryText="Reload Performance Data"
      />
    );
  }

  return (
    <PerformanceChart 
      data={data} 
      returns={returns} 
    />
  );
};

export default Performance;