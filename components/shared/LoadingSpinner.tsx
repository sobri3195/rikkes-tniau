
import React from 'react';

const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center space-x-2">
    <div className="w-4 h-4 rounded-full animate-pulse bg-tni-au-dark"></div>
    <div className="w-4 h-4 rounded-full animate-pulse bg-tni-au-dark" style={{ animationDelay: '0.2s' }}></div>
    <div className="w-4 h-4 rounded-full animate-pulse bg-tni-au-dark" style={{ animationDelay: '0.4s' }}></div>
    <span className="ml-2 text-tni-au-dark font-semibold">Loading...</span>
  </div>
);

export default LoadingSpinner;
