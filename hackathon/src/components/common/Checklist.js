import React from 'react';
import './Checklist.css';
import checklistService from '../../services/ChecklistService';

const Checklist = ({ 
  title, 
  items = [], 
  showPlaceholder = false, 
  placeholderText = "체크리스트가 없습니다.",
  onItemToggle 
}) => {
  const handleItemClick = async (itemId) => {
    // 현재 항목의 완료 상태 확인
    const currentItem = items.find(item => item.id === itemId);
    if (!currentItem) return;

    try {
      // 백엔드로 항목 상태 업데이트
      await checklistService.toggleChecklistItem(itemId, !currentItem.completed);
      
      // 성공 시 로컬 콜백 호출
      if (onItemToggle) {
        onItemToggle(itemId);
      }
    } catch (error) {
      console.error('체크리스트 항목 업데이트 실패:', error);
      // 에러가 발생해도 로컬 콜백 호출 (로컬 처리)
      if (onItemToggle) {
        onItemToggle(itemId);
      }
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