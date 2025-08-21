import React, { useState } from 'react';
import './App.css';
import WelcomePage from './pages/WelcomePage';
import DashboardPage from './pages/DashboardPage';
import SurveyPage from './pages/SurveyPage';
import AIChecklistPage from './pages/AIChecklistPage';
import Navbar from './components/navigation/Navbar';
import { ChecklistProvider } from './contexts/ChecklistContext';

function App() {
  const [currentPage, setCurrentPage] = useState('welcome');
  const [surveyAnswers, setSurveyAnswers] = useState({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleStartSurvey = () => {
    setCurrentPage('survey');
  };

  const handleSurveyComplete = (answers) => {
    setSurveyAnswers(answers);
    setCurrentPage('ai-checklist'); // AI 체크리스트 페이지로 이동
  };

  const handleBackToWelcome = () => {
    setCurrentPage('welcome');
  };

  const handleBackToSurvey = () => {
    setCurrentPage('survey');
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleMenuToggle = (isOpen) => {
    setIsMenuOpen(isOpen);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'welcome':
        return <WelcomePage onStartSurvey={handleStartSurvey} />;
      case 'survey':
        return <SurveyPage onComplete={handleSurveyComplete} />;
      case 'ai-checklist':
        return (
          <AIChecklistPage 
            surveyAnswers={surveyAnswers} 
            onBackToSurvey={handleBackToSurvey}
          />
        );
      case 'dashboard':
        return <DashboardPage />;
      default:
        return <WelcomePage onStartSurvey={handleStartSurvey} />;
    }
  };

  return (
    <ChecklistProvider>
      <div className="App">
        {/* 네비바 컴포넌트 */}
        <Navbar
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onMenuToggle={handleMenuToggle}
        />

        {/* 메인 콘텐츠 */}
        <div className={`main-content ${isMenuOpen ? 'blurred' : ''}`}>
          {renderPage()}
        </div>
      </div>
    </ChecklistProvider>
  );
}

export default App;
