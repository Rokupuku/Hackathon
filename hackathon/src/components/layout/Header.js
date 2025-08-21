import React from 'react';
import './Header.css';

const Header = ({ 
  greeting, 
  subtitle, 
  showProgress = false, 
  progressValue = 0,
  progressText = '',
  showProfileIcon = true,
  showButton = false,
  buttonText = '',
  onButtonClick
}) => {
  return (
    <div className="header">
      {showProfileIcon && (
        <div className="profile-icon">
          <div className="profile-avatar"></div>
        </div>
      )}
      
      <div className="header-content">
        <h1 className="greeting">{greeting}</h1>
        {subtitle && <p className="subtitle">{subtitle}</p>}
        

        
        {showProgress && (
          <div className="progress-section">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progressValue}%` }}
              ></div>
            </div>
            {progressText && <p className="progress-text">{progressText}</p>}
          </div>
        )}
        
        {showButton && (
          <button className="header-button" onClick={onButtonClick}>
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default Header; 