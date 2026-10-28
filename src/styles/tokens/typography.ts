/**
 * 자주 쓰는 텍스트 스타일 프리셋. 컴포넌트 className 에 조합해서 사용.
 *   <p className={textStyles['body-medium']}>...</p>
 */
export const textStyles = {
  'display-hero': 'text-display font-normal',
  'display-dday': 'text-logo font-bold leading-[45px] tracking-[-1.08px]',
  'brand-logo':
    'font-logo text-logo font-normal leading-[45px] tracking-[-1.08px]',
  'header-logo':
    'font-logo text-h2 font-normal leading-[28px] tracking-[-0.2px]',
  'heading-h1': 'text-h1 font-bold leading-[31.2px] tracking-[-0.48px]',
  'heading-h1-semi': 'text-h1 font-semibold leading-[28px]',
  'heading-h2': 'text-h2 font-bold leading-[27px] tracking-[-0.4px]',
  'heading-h3': 'text-h3 font-bold',
  'heading-h3-tight': 'text-h3 font-bold leading-[21.6px]',
  'header-title':
    'text-header font-semibold leading-[23.8px] tracking-[-0.17px]',
  'section-title': 'text-body-lg font-bold leading-[22.4px] tracking-[-0.32px]',
  'profile-name':
    'text-body-lg font-semibold leading-[22.4px] tracking-[-0.32px]',
  'input-value': 'text-body-lg font-normal leading-[22.4px] tracking-[-0.32px]',
  'stat-count': 'text-body-15 font-bold leading-[15px] tracking-[-0.3px]',
  'button-label': 'text-body-lg font-semibold leading-[19.2px]',
  'body-large': 'text-body-lg font-normal leading-[25.6px]',
  'body-large-semi': 'text-body-lg font-semibold leading-[19.2px]',
  'body-medium': 'text-body-md font-normal leading-[22.4px]',
  'body-medium-med': 'text-body-md font-medium',
  'menu-item': 'text-body-md font-medium leading-[19.6px] tracking-[-0.28px]',
  'body-medium-semi': 'text-body-md font-semibold leading-[22.4px]',
  'body-medium-semi-tight': 'text-body-md font-semibold leading-[16.8px]',
  'body-medium-bold': 'text-body-md font-bold',
  'body-xs': 'text-body-xs font-normal leading-[18.2px]',
  'field-label': 'text-body-xs font-medium leading-[13px] tracking-[-0.26px]',
  'field-helper': 'text-body-xs font-medium leading-[18.2px]',
  'notif-row-title': 'text-body-xs font-medium leading-[15.6px]',
  'body-small': 'text-body-sm font-normal',
  'body-small-med':
    'text-body-sm font-medium leading-[15.6px] tracking-[0.12px]',
  'stat-label': 'text-body-sm font-medium leading-[12px]',
  'sub-button-label': 'text-body-sm font-semibold leading-[12px]',
  'char-counter': 'text-body-sm font-medium leading-[16.8px]',
  'caption-default': 'text-caption font-normal leading-[15.4px]',
  'caption-tight': 'text-caption font-normal leading-[11px]',
  'caption-medium': 'text-caption font-medium',
  footnote: 'text-footnote font-normal',
  'footnote-tight': 'text-footnote font-normal leading-[12px]',
  tab: 'text-tab font-normal',
} as const;
