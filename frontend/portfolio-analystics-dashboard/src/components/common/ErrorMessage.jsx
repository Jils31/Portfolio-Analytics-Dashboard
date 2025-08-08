import React from 'react';

const ErrorMessage = ({ 
  title = "Unable to Load Data",
  message = "Something went wrong while fetching the data",
  onRetry = null,
  retryText = "Try Again",
  className = "",
  icon = null
}) => {
  const defaultIcon = (
    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  return (
    <div className={`bg-gradient-to-br from-red-50 to-red-100 rounded-2xl shadow-2xl p-8 ${className}`}>
      <div className="text-center">
        {/* Error Icon */}
        <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          {icon || defaultIcon}
        </div>

        {/* Error Title */}
        <h3 className="text-xl font-bold text-red-700 mb-2">{title}</h3>

        {/* Error Message */}
        <p className="text-red-600 font-medium mb-6 max-w-md mx-auto">{message}</p>

        {/* Retry Button */}
        {onRetry && (
          <button 
            onClick={onRetry}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            {retryText}
          </button>
        )}

        {/* Alternative action if no retry */}
        {!onRetry && (
          <div className="text-sm text-red-500">
            Please refresh the page or contact support if the problem persists
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;