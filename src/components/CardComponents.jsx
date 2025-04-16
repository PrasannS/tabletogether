import React from 'react';

// Custom Card Component
export const Card = ({ 
  children, 
  className = '', 
  ...props 
}) => {
  return (
    <div 
      className={`border rounded-lg shadow-md bg-white ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

// Custom Card Header Component
export const CardHeader = ({ 
  children, 
  className = '', 
  ...props 
}) => {
  return (
    <div 
      className={`p-4 border-b ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

// Custom Card Title Component
export const CardTitle = ({ 
  children, 
  className = '', 
  ...props 
}) => {
  return (
    <h2 
      className={`text-xl font-semibold text-gray-800 ${className}`} 
      {...props}
    >
      {children}
    </h2>
  );
};

// Custom Card Content Component
export const CardContent = ({ 
  children, 
  className = '', 
  ...props 
}) => {
  return (
    <div 
      className={`p-4 ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

// Custom Button Component
export const Button = ({ 
  children, 
  onClick, 
  variant = 'default', 
  className = '', 
  ...props 
}) => {
  const variantStyles = {
    default: 'bg-[#455932] text-white hover:text-[#455932] hover:bg-white',
    outline: 'border border-[#455932] text-white hover:bg-white',
    ghost: 'text-gray-500 hover:bg-[#455932]',
    link: 'text-[#455932] underline'
  };

  // className="px-3 py-1 bg-[#455932] text-white rounded hover:text-[#455932] hover:bg-white"

  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 rounded-md transition-colors 
        flex items-center justify-center
        ${variantStyles[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

