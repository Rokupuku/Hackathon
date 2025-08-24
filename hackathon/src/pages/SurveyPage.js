import React, { useState } from 'react';
import Survey from '../components/forms/Survey';
import checklistService from '../services/ChecklistService';

const SurveyPage = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState({});

  const surveyData = [
    {
      question: "당신의 현재 주거 형태는 어떤가요?",
      subtitle: "주거 형태를 알려주세요",
      options: [
        { label: "1인가구 대학생", value: "student", icon: "🎓" },
        { label: "1인가구 직장인", value: "worker", icon: "💼" },
        { label: "가족단위", value: "family", icon: "❤️" },
        { label: "기타", value: "other", icon: "📝" }
      ],
      multipleChoice: false
    },
    {
      question: "새로 이사할 집은 어떤 형태인가요?",
      subtitle: "이사할 곳의 유형을 알려주세요",
      options: [
        { label: "원룸", value: "studio", icon: "🏠" },
        { label: "오피스텔", value: "officetel", icon: "🏢" },
        { label: "아파트", value: "apartment", icon: "🏘️" },
        { label: "셰어하우스", value: "sharehouse", icon: "👥" },
        { label: "기타", value: "other", icon: "📝" }
      ],
      multipleChoice: false
    },
    {
      question: "이사할 집에 있는 옵션을 선택해주세요!",
      options: [
        { label: "세탁기", value: "washing_machine", icon: "🧺" },
        { label: "건조기", value: "dryer", icon: "🌞" },
        { label: "TV", value: "tv", icon: "📺" },
        { label: "책상", value: "desk", icon: "📚" },
        { label: "에어컨", value: "aircon", icon: "❄️" },
        { label: "냉장고", value: "refrigerator", icon: "🧊" },
        { label: "침대", value: "bed", icon: "🛏️" },
        { label: "인터넷", value: "internet", icon: "🌐" }
      ],
      multipleChoice: true // This question allows multiple selections
    },
    {
      question: "이삿짐 운반은 어떻게 하실 건가요?",
      subtitle: "이삿짐 배달의 방법을 알려주세요",
      options: [
        { label: "이삿짐센터 이용", value: "moving_company", icon: "🚚" },
        { label: "자차 이동", value: "own_car", icon: "🚗" },
        { label: "렌트/화물차 이용", value: "rental_truck", icon: "🚛" },
        { label: "친구/가족 도움", value: "family_help", icon: "👥" },
        { label: "기타", value: "other", icon: "📝" }
      ],
      multipleChoice: false
    },
    {
      question: "이삿날은 평일인가요 주말인가요?",
      subtitle: "이사 날짜를 알려주세요",
      options: [
        { label: "평일에 이사해요", value: "weekday", icon: "📅" },
        { label: "주말에 이사해요", value: "weekend", icon: "🎉" },
        { label: "아직 미정이에요", value: "undecided", icon: "❓" }
      ],
      multipleChoice: false
    },
    {
      question: "이삿짐의 양은 어느정도 인가요?",
      subtitle: "대략적인 양을 알려주세요",
      options: [
        { label: "박스 5개 이하 (소규모)", value: "small", icon: "📦" },
        { label: "5~15개 (중간 규모)", value: "medium", icon: "📦" },
        { label: "15개 이상 (대규모)", value: "large", icon: "📦" }
      ],
      multipleChoice: false
    },
    {
      question: "이번 이사에서 특별히 신경 쓰고 싶은 부분이 있나요?",
      subtitle: "이사 준비에 신경 쓰고 싶은 부분을 알려주세요",
      options: [
        { label: "비용 절감", value: "cost_reduction", icon: "💰" },
        { label: "빠른 이사", value: "fast_move", icon: "⚡" },
        { label: "이삿짐 안전 운반", value: "safe_transport", icon: "🛡️" },
        { label: "행정 처리 확실히 하기", value: "admin_process", icon: "📋" }
      ],
      multipleChoice: false
    }
  ];

  const handleOptionSelect = (value) => {
    const currentSurvey = surveyData[currentStep - 1];

    if (currentSurvey.multipleChoice) {
      // 다중 선택인 경우 배열로 관리
      setAnswers(prev => {
        const currentAnswers = prev[currentStep] || [];
        if (currentAnswers.includes(value)) {
          // 이미 선택된 옵션이면 제거
          return {
            ...prev,
            [currentStep]: currentAnswers.filter(item => item !== value)
          };
        } else {
          // 새로운 옵션 추가
          return {
            ...prev,
            [currentStep]: [...currentAnswers, value]
          };
        }
      });
    } else {
      // 단일 선택인 경우 기존 로직
      setAnswers(prev => ({
        ...prev,
        [currentStep]: value
      }));
    }
  };

  const handleNext = async () => {
    if (currentStep < surveyData.length) {
      setCurrentStep(prev => prev + 1);
    } else {
      // 설문 완료 시 백엔드로 데이터 전송
      try {
        const selections = Object.entries(answers).map(([step, answer]) => ({
          questionId: `question_${step}`,
          answer: Array.isArray(answer) ? answer : [answer],
          timestamp: new Date().toISOString()
        }));

        // 백엔드로 설문 결과 전송
        await checklistService.generateChecklistFromSurvey(selections);
        
        // 성공 시 완료 콜백 호출
        onComplete(answers);
      } catch (error) {
        console.error('설문 결과 전송 실패:', error);
        // 에러가 발생해도 완료 콜백 호출 (로컬 처리)
        onComplete(answers);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const currentSurvey = surveyData[currentStep - 1];
  const selectedOption = answers[currentStep] || (currentSurvey.multipleChoice ? [] : null);

  // 다음 버튼 활성화 조건
  const canProceed = () => {
    if (currentSurvey.multipleChoice) {
      // 다중 선택인 경우 최소 1개 이상 선택되어야 함
      return selectedOption && selectedOption.length > 0;
    } else {
      // 단일 선택인 경우 기존 로직
      return selectedOption;
    }
  };

  return (
    <div className="survey-page">
      <Survey
        question={currentSurvey.question}
        subtitle={currentSurvey.subtitle}
        options={currentSurvey.options}
        currentStep={currentStep}
        totalSteps={surveyData.length}
        onNext={handleNext}
        onPrevious={handlePrevious}
        selectedOption={selectedOption}
        onOptionSelect={handleOptionSelect}
        multipleChoice={currentSurvey.multipleChoice}
        canProceed={canProceed()}
      />
    </div>
  );
};

export default SurveyPage; 