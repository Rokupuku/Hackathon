import React from 'react';
import Header from '../components/layout/Header';
import WhiteBackground from '../components/common/WhiteBackground';
import Checklist from '../components/common/Checklist';
import { useChecklist } from '../contexts/ChecklistContext';
import './DashboardPage.css';

const DashboardPage = () => {
  const { state } = useChecklist();
  const { currentChecklist } = state;

  return (
    <div className="dashboard-page">
      <Header
        greeting="나의 이사 준비 현황"
        subtitle="체크리스트를 확인하고 진행 상황을 파악해보세요"
        showProgress={true}
        progressValue={
          currentChecklist && currentChecklist.items.length > 0
            ? (currentChecklist.items.filter(item => item.completed).length / currentChecklist.items.length) * 100
            : 0
        }
        progressText={
          currentChecklist && currentChecklist.items.length > 0
            ? `${currentChecklist.items.filter(item => item.completed).length} / ${currentChecklist.items.length} 완료`
            : "체크리스트가 없습니다"
        }
      />
      
      <WhiteBackground>
        {currentChecklist ? (
          <Checklist
            title={currentChecklist.title}
            items={currentChecklist.items.map(item => ({
              id: item.id,
              title: item.title,
              subtitle: `${item.description} | ${item.category} | ${item.priority} | ${item.estimatedTime}`,
              completed: item.completed
            }))}
          />
        ) : (
          <Checklist
            title="나의 체크리스트"
            showPlaceholder={true}
            placeholderText="아직 체크리스트가 없어요. 설문조사를 완료하면 AI가 맞춤형 체크리스트를 만들어드릴게요!"
          />
        )}
        
        {currentChecklist && (
          <div className="dashboard-summary">
            <h3>📊 진행 상황 요약</h3>
            <div className="summary-grid">
              <div className="summary-card">
                <div className="summary-number">{currentChecklist.items.length}</div>
                <div className="summary-label">총 항목</div>
              </div>
              <div className="summary-card">
                <div className="summary-number">
                  {currentChecklist.items.filter(item => item.completed).length}
                </div>
                <div className="summary-label">완료된 항목</div>
              </div>
              <div className="summary-card">
                <div className="summary-number">
                  {currentChecklist.items.filter(item => item.priority === 'high').length}
                </div>
                <div className="summary-label">높은 우선순위</div>
              </div>
              <div className="summary-card">
                <div className="summary-number">
                  {Math.round(
                    (currentChecklist.items.filter(item => item.completed).length / currentChecklist.items.length) * 100
                  )}%
                </div>
                <div className="summary-label">완료율</div>
              </div>
            </div>
          </div>
        )}
      </WhiteBackground>
    </div>
  );
};

export default DashboardPage; 