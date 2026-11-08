import { AnimatePresence, motion } from 'framer-motion';

import { useToastStore } from '@/stores/useToastStore';

/**
 * 전역 토스트 표시 영역. App 에 한 번만 둔다.
 * 하단 탭바·하단 고정 버튼 위에 뜨도록 홈 인디케이터 + 96px 위에 놓는다.
 */
export default function ToastHost() {
  const message = useToastStore((state) => state.message);
  const id = useToastStore((state) => state.id);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+96px)] z-[200] flex justify-center px-5">
      <AnimatePresence>
        {message && (
          <motion.div
            key={id}
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="bg-text-label text-body-md text-surface-white shadow-level-2 w-max max-w-full rounded-lg px-4 py-3 text-center"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
