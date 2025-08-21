import React, { useEffect, useState } from 'react';
import Header from '../components/layout/Header';
import WhiteBackground from '../components/common/WhiteBackground';
import Checklist from '../components/common/Checklist';
import { useChecklist } from '../contexts/ChecklistContext';
import aiService from '../services/aiService';
import './AIChecklistPage.css';

const AIChecklistPage = ({ surveyAnswers, onBackToSurvey }) => {
  const { state, actions } = useChecklist();
  const [generating, setGenerating] = useState(false);
  const [generatedChecklist, setGeneratedChecklist] = useState(null);

  useEffect(() => {
    if (surveyAnswers && Object.keys(surveyAnswers).length > 0) {
      generateAIChecklist();
    }
  }, [surveyAnswers]);

  const generateAIChecklist = async () => {
    setGenerating(true);
    try {
      const checklist = await aiService.generateChecklist(surveyAnswers);
      
      // 체크리스트에 고유 ID 추가
      const checklistWithId = {
        ...checklist,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        surveyAnswers: surveyAnswers
      };
      
      setGeneratedChecklist(checklistWithId);
      actions.addChecklist(checklistWithId);
    } catch (error) {
      console.error('AI 체크리스트 생성 실패:', error);
      // 에러가 발생해도 기본 체크리스트는 표시
    } finally {
      setGenerating(false);
    }
  };

  const handleItemToggle = (itemId) => {
    actions.toggleItem(itemId);
  };

  const handleSaveChecklist = () => {
    if (generatedChecklist) {
      actions.updateChecklist(generatedChecklist);
      // 저장 완료 메시지 표시
      alert('체크리스트가 저장되었습니다!');
    }
  };

  if (generating) {
    return (
      <div className="ai-checklist-page">
        <Header
          greeting="AI가 체크리스트를 생성하고 있어요!"
          subtitle="잠시만 기다려주세요..."
          showProgress={true}
          progressValue={50}
          progressText="개인화된 체크리스트를 만들고 있습니다"
        />
        
        <WhiteBackground>
          <div className="generating-content">
            <div className="loading-spinner"></div>
            <h3>AI가 설문조사 결과를 분석하고 있어요</h3>
            <p>당신의 상황에 맞는 맞춤형 이사 체크리스트를 만들어드릴게요!</p>
          </div>
        </WhiteBackground>
      </div>
    );
  }

  if (!generatedChecklist) {
    return (
      <div className="ai-checklist-page">
        <Header
          greeting="체크리스트 생성에 실패했어요"
          subtitle="다시 시도해보세요"
        />
        
        <WhiteBackground>
          <div className="error-content">
            <p>체크리스트를 생성할 수 없습니다.</p>
            <button onClick={onBackToSurvey} className="retry-button">
              설문조사 다시 하기
            </button>
          </div>
        </WhiteBackground>
      </div>
    );
  }

  return (
    <div className="ai-checklist-page">
      <Header
        greeting="AI가 만든 맞춤형 체크리스트"
        subtitle="설문조사 결과를 바탕으로 생성되었어요"
        showProgress={true}
        progressValue={100}
        progressText="체크리스트 생성 완료!"
      />
      
      <WhiteBackground>
        <div className="checklist-header">
          <h2>{generatedChecklist.title}</h2>
          <div className="checklist-actions">
            <button onClick={handleSaveChecklist} className="save-button">
              💾 저장하기
            </button>
            <button onClick={onBackToSurvey} className="back-button">
              🔄 다시 설문하기
            </button>
          </div>
        </div>
        
        <Checklist
          title=""
          items={generatedChecklist.items.map(item => ({
            id: item.id,
            title: item.title,
            subtitle: `${item.description} | ${item.category} | ${item.priority} | ${item.estimatedTime}`,
            completed: item.completed
          }))}
          onItemToggle={handleItemToggle}
        />
        
        <div className="checklist-summary">
          <h3>📊 체크리스트 요약</h3>
          <div className="summary-stats">
            <div className="stat-item">
              <span className="stat-number">{generatedChecklist.items.length}</span>
              <span className="stat-label">총 항목</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {generatedChecklist.items.filter(item => item.completed).length}
              </span>
              <span className="stat-label">완료된 항목</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {generatedChecklist.items.filter(item => item.priority === 'high').length}
              </span>
              <span className="stat-label">높은 우선순위</span>
            </div>
          </div>
        </div>
      </WhiteBackground>
    </div>
  );
};

export default AIChecklistPage; 