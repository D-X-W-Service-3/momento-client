/**
 * 자주 쓰는 텍스트 스타일 프리셋. 컴포넌트 className 에 조합해서 사용.
 *   <p className={textStyles['body-medium']}>...</p>
 */
export const textStyles = {
  'display-hero': 'text-display font-normal',
  'heading-h1': 'text-h1 font-bold',
  'heading-h2': 'text-h2 font-bold',
  'heading-h3': 'text-h3 font-bold',
  'body-large': 'text-body-lg font-medium',
  'body-medium': 'text-body-md font-normal',
  'body-medium-med': 'text-body-md font-medium',
  'body-medium-bold': 'text-body-md font-bold',
  'body-small': 'text-body-sm font-normal',
  'body-small-med': 'text-body-sm font-medium',
  'caption-default': 'text-caption font-normal leading-4',
  'caption-medium': 'text-caption font-medium',
  footnote: 'text-footnote font-normal',
  tab: 'text-tab font-normal',
} as const;
