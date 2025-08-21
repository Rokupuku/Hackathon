import React from 'react';
import './Checklist.css';

const Checklist = ({ 
  title, 
  items = [], 
  showPlaceholder = false, 
  placeholderText = "체크리스트가 없습니다.",
  onItemToggle 
}) => {
  const handleItemClick = (itemId) => {
    if (onItemToggle) {
      onItemToggle(itemId);
    }
  };

  if (showPlaceholder) {
    return (
      <div className="checklist">
        <h3 className="checklist-title">{title}</h3>
        <div className="checklist-placeholder">
          <p>{placeholderText}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="checklist">
      {title && <h3 className="checklist-title">{title}</h3>}
      <div className="checklist-items">
        {items.map((item) => (
          <div 
            key={item.id} 
            className={`checklist-item ${item.completed ? 'completed' : ''}`}
            onClick={() => handleItemClick(item.id)}
          >
            <div className="checkbox">
              {item.completed && <span className="checkmark">✓</span>}
            </div>
            <div className="item-content">
              <div className="item-title">{item.title}</div>
              {item.subtitle && (
                <div className="item-subtitle">{item.subtitle}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Checklist; 