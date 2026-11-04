import { AnimatePresence, motion } from 'framer-motion';

import Button from '@/components/common/Button';
import PaginationDots from '@/components/common/PaginationDots';
import MobileLayout from '@/components/layout/MobileLayout';
import { useOnboarding } from '@/hooks/useOnboarding';
import { textStyles } from '@/styles/tokens';

export default function OnboardingPage() {
  const {
    currentIndex,
    totalSteps,
    currentStep,
    handleNext,
    handleSelectStep,
  } = useOnboarding();

  return (
    <MobileLayout variant="white" className="justify-between px-5 pt-20 pb-10">
      <div className="flex w-full flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep.id}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="flex w-full flex-col items-center"
          >
            <div
              className={`flex h-[424px] w-full flex-col items-center ${currentStep.containerPaddingTop}`}
            >
              <img
                src={currentStep.image}
                alt={currentStep.imageAlt}
                className={`object-contain ${currentStep.imageClassName}`}
              />
            </div>

            <div className="flex min-h-[80px] w-full flex-col items-center gap-2 text-center">
              <h1
                className={`text-text-primary ${textStyles['heading-h1-semi']}`}
              >
                {currentStep.title}
              </h1>
              <p
                className={`text-text-secondary whitespace-pre-line ${textStyles['body-medium']}`}
              >
                {currentStep.description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex w-full justify-center pt-9">
          <PaginationDots
            count={totalSteps}
            activeIndex={currentIndex}
            onSelect={handleSelectStep}
            size="md"
            ariaLabel="온보딩 단계"
          />
        </div>
      </div>

      <Button variant="primary" onClick={handleNext}>
        다음
      </Button>
    </MobileLayout>
  );
}
