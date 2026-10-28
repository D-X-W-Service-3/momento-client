/**
 * JS에서 색을 직접 써야 할 때만 사용 (Framer Motion, 차트 라이브러리 등).
 * 평소에는 Tailwind 클래스(bg-primary, text-text-secondary ...)를 우선 사용하세요.
 */
export const colors = {
  primary: {
    DEFAULT: 'var(--color-primary)',
    dark: 'var(--color-primary-dark)',
    tint: 'var(--color-primary-tint)',
    badge: 'var(--color-primary-badge)',
  },
  chip: {
    openBg: 'var(--color-chip-open-bg)',
    openText: 'var(--color-chip-open-text)',
  },
  streak: {
    pill: 'var(--color-streak-pill)',
  },
  kakao: {
    DEFAULT: 'var(--color-kakao)',
    label: 'var(--color-kakao-label)',
  },
  black: 'var(--color-black)',
  text: {
    primary: 'var(--color-text-primary)',
    dark: 'var(--color-text-dark)',
    heading: 'var(--color-text-heading)',
    notifTitle: 'var(--color-text-notif-title)',
    label: 'var(--color-text-label)',
    buttonSub: 'var(--color-text-button-sub)',
    meta: 'var(--color-text-meta)',
    notifSub: 'var(--color-text-notif-sub)',
    hint: 'var(--color-text-hint)',
    secondary: 'var(--color-text-secondary)',
    placeholder: 'var(--color-text-placeholder)',
    muted: 'var(--color-text-muted)',
    onPrimary: 'var(--color-text-on-primary)',
  },
  border: {
    default: 'var(--color-border-default)',
    subtle: 'var(--color-border-subtle)',
    input: 'var(--color-border-input)',
    nav: 'var(--color-border-nav)',
  },
  gray: {
    100: 'var(--color-gray-100)',
    200: 'var(--color-gray-200)',
    300: 'var(--color-gray-300)',
    400: 'var(--color-gray-400)',
    450: 'var(--color-gray-450)',
    500: 'var(--color-gray-500)',
  },
  surface: {
    white: 'var(--color-surface-white)',
    gray: 'var(--color-surface-gray)',
    muted: 'var(--color-surface-muted)',
    avatar: 'var(--color-surface-avatar)',
    subtle: 'var(--color-surface-subtle)',
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
