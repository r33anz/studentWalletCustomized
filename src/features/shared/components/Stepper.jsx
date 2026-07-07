import React from "react";

export const Stepper = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center justify-center mb-6">
      {steps.map(function (step, index) {
        var isCompleted = index < currentStep;
        var isActive = index === currentStep;

        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <div className={"h-0.5 w-8 transition-all duration-300 " + (index <= currentStep ? "bg-coral" : "bg-border")} />
            )}
            <div className="flex flex-col items-center">
              <div className={"w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 " + (
                isCompleted ? "bg-success text-white" :
                isActive ? "bg-coral text-white" :
                "bg-surface-muted border border-border text-gray-400"
              )}>
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span className={"text-xs mt-1 whitespace-nowrap " + (isActive ? "text-coral font-medium" : isCompleted ? "text-success" : "text-gray-400")}>
                {step}
              </span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};
