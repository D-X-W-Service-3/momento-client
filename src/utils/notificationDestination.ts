import { capsuleCoverPath, capsuleDetailPath } from '@/constants/routes';

/**
 * 알림 type + referenceId 로 앱 내 이동 경로를 정한다.
 * 인앱 알림 목록과 서비스워커(푸시 알림 클릭)가 같은 규칙을 쓴다.
 * 이동할 곳이 없으면 null.
 */
export function notificationDestination(item: {
  type: string;
  referenceId: number | null;
}) {
  if (item.referenceId == null) return null;
  if (item.type === 'LETTER_DEADLINE')
    return `${capsuleDetailPath(String(item.referenceId))}?view=my-letters`;
  if (item.type === 'MEMORY_REMINDER') return `/archives/${item.referenceId}`;
  if (item.type === 'ANNIVERSARY_REMINDER')
    return `/anniversaries/${item.referenceId}/edit`;
  if (
    [
      'CAPSULE_OPENED',
      'CAPSULE_D_DAY',
      'NEW_MEMBER',
      'LETTER_MILESTONE',
      'IMAGE_GENERATED',
    ].includes(item.type)
  )
    return capsuleCoverPath(String(item.referenceId));
  return null;
}
