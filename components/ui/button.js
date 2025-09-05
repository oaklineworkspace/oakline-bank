
import React from 'react';

export const Button = ({ children, onClick, type = "button", className = "", ...props }) => {
  const baseClasses = "px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors";
  const defaultClasses = "bg-blue-600 text-white hover:bg-blue-700";
  
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${defaultClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
