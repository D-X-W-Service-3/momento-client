import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ONBOARDING_STEPS } from '@/constants/onboarding';
import { useAuthStore } from '@/stores/useAuthStore';

export function useOnboarding() {
  const navigate = useNavigate();
  const completeOnboarding = useAuthStore((state) => state.completeOnboarding);
  const [currentIndex, setCurrentIndex] = useState(0);

  const totalSteps = ONBOARDING_STEPS.length;
  const currentStep = ONBOARDING_STEPS[currentIndex];
  const isLastStep = currentIndex === totalSteps - 1;

  const handleNext = () => {
    if (!isLastStep) {
      setCurrentIndex((prev) => prev + 1);
      return;
    }
    completeOnboarding();
    navigate('/profile-setup');
  };

  const handleSelectStep = (index: number) => {
    if (index >= 0 && index < totalSteps) {
      setCurrentIndex(index);
    }
  };

  return {
    currentIndex,
    totalSteps,
    currentStep,
    isLastStep,
    handleNext,
    handleSelectStep,
  };
}
