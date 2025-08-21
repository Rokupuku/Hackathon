import React from 'react';
import './Survey.css';

const Survey = ({
  question,
  subtitle,
  options,
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  selectedOption,
  onOptionSelect,
  multipleChoice = false,
  canProceed = false
}) => {
  const isOptionSelected = (value) => {
    if (multipleChoice) {
      return selectedOption && selectedOption.includes(value);
    }
    return selectedOption === value;
  };

  return (
    <div className="survey">
      <div className="survey-header">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
        <h2 className="question">{question}</h2>
        <p className="subtitle">{subtitle}</p>
        {multipleChoice && (
          <p className="multiple-choice-hint">여러 개를 선택할 수 있어요!</p>
        )}
      </div>

      <div className="options">
        {options.map((option, index) => (
          <button
            key={index}
            className={`option-button ${isOptionSelected(option.value) ? 'selected' : ''}`}
            onClick={() => onOptionSelect(option.value)}
          >
            <div className="option-icon">{option.icon}</div>
            <span className="option-text">{option.label}</span>
            {isOptionSelected(option.value) && (
              <div className="checkmark">✓</div>
            )}
          </button>
        ))}
      </div>

      <div className="navigation">
        <button
          className="nav-button prev-button"
          onClick={onPrevious}
          disabled={currentStep === 1}
        >
          이전
        </button>
        <button
          className="nav-button next-button"
          onClick={onNext}
          disabled={!canProceed}
        >
          다음으로
        </button>
      </div>
    </div>
  );
};

export default Survey; 