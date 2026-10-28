/**
 * 자주 쓰는 텍스트 스타일 프리셋. 컴포넌트 className 에 조합해서 사용.
 *   <p className={textStyles['body-medium']}>...</p>
 */
export const textStyles = {
  'display-hero': 'text-display font-normal',
  'brand-logo':
    'font-logo text-logo font-normal leading-[45px] tracking-[-1.08px]',
  'heading-h1': 'text-h1 font-bold leading-[31.2px] tracking-[-0.48px]',
  'heading-h1-semi': 'text-h1 font-semibold leading-[28px]',
  'heading-h2': 'text-h2 font-bold',
  'heading-h3': 'text-h3 font-bold',
  'header-title':
    'text-header font-semibold leading-[23.8px] tracking-[-0.17px]',
  'button-label': 'text-body-lg font-semibold leading-[19.2px]',
  'body-large': 'text-body-lg font-normal leading-[25.6px]',
  'body-large-semi': 'text-body-lg font-semibold leading-[19.2px]',
  'body-medium': 'text-body-md font-normal leading-[22.4px]',
  'body-medium-med': 'text-body-md font-medium',
  'body-medium-semi': 'text-body-md font-semibold leading-[22.4px]',
  'body-medium-bold': 'text-body-md font-bold',
  'body-xs': 'text-body-xs font-normal leading-[18.2px]',
  'body-small': 'text-body-sm font-normal',
  'body-small-med':
    'text-body-sm font-medium leading-[15.6px] tracking-[0.12px]',
  'caption-default': 'text-caption font-normal leading-[15.4px]',
  'caption-medium': 'text-caption font-medium',
  footnote: 'text-footnote font-normal',
  tab: 'text-tab font-normal',
} as const;
