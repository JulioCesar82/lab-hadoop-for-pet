import React from 'react';
import './styles.css';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  labels = []
}) => {
  return (
    <div className="step-indicator">
      <div className="progress-bar">
        <div 
          className="progress" 
          style={{ width: `${(currentStep - 1) / (totalSteps - 1) * 100}%` }}
        />
      </div>
      <div className="steps">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div 
            key={index}
            className={`step ${index + 1 <= currentStep ? 'active' : ''}`}
          >
            <div className="step-number">{index + 1}</div>
            {labels[index] && (
              <div className="step-label">{labels[index]}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};