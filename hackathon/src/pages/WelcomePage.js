import React from 'react';
import Header from '../components/layout/Header';
import WhiteBackground from '../components/common/WhiteBackground';
import Checklist from '../components/common/Checklist';
import './WelcomePage.css';

const WelcomePage = ({ onStartSurvey }) => {
  return (
    <div className="welcome-page">
      <Header
        greeting="우리 오늘부터 함께!"
        subtitle="이사 준비를 시작해볼까요?"
        showButton={true}
        buttonText="이사 준비하러 GO!"
        onButtonClick={onStartSurvey}
      />
      
      <WhiteBackground>
        <Checklist
          title="나의 체크리스트"
          showPlaceholder={true}
          placeholderText="이사 준비를 시작하면 이곳에서 체크리스트를 확인할 수 있어요!"
        />
      </WhiteBackground>
    </div>
  );
};

export default WelcomePage; 