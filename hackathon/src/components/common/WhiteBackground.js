import React from 'react';
import './WhiteBackground.css';

const WhiteBackground = ({ children, className = '' }) => {
  return (
    <div className={`white-background ${className}`}>
      {children}
    </div>
  );
};

export default WhiteBackground; 