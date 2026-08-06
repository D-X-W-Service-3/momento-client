/**
 * JS에서 색을 직접 써야 할 때만 사용 (Framer Motion, 차트 라이브러리 등).
 * 평소에는 Tailwind 클래스(bg-primary, text-text-secondary ...)를 우선 사용하세요.
 */
export const colors = {
  primary: {
    DEFAULT: 'var(--color-primary)',
    tint: 'var(--color-primary-tint)',
  },
  black: 'var(--color-black)',
  text: {
    primary: 'var(--color-text-primary)',
    secondary: 'var(--color-text-secondary)',
    placeholder: 'var(--color-text-placeholder)',
    onPrimary: 'var(--color-text-on-primary)',
  },
  gray: {
    100: 'var(--color-gray-100)',
    200: 'var(--color-gray-200)',
    300: 'var(--color-gray-300)',
    400: 'var(--color-gray-400)',
    500: 'var(--color-gray-500)',
  },
  surface: {
    white: 'var(--color-surface-white)',
    gray: 'var(--color-surface-gray)',
  },
  status: {
    error: 'var(--color-status-error)',
    info: 'var(--color-status-info)',
    success: 'var(--color-status-success)',
  },
  overlay: {
    base: 'var(--color-overlay-base)',
  },
} as const;
