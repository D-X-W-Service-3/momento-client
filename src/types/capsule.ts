import type { CapsuleStatus } from '@/types/calendar';

/**
 * 캡슐 커버(진입) 화면에 필요한 최소 정보.
 * status 는 캘린더와 같은 값을 쓰고 커버 디자인에 1:1로 대응한다.
 *   writing  → 수정가능 (편지를 모으는 중)
 *   sealed   → 잠긴캡슐 (개봉일 전)
 *   openable → 열린캡슐 (개봉 완료)
 */
export interface CapsuleCover {
  id: string;
  title: string;
  status: CapsuleStatus;
  /** 개봉일 (YYYY-MM-DD) */
  openDate: string;
}

export interface CapsuleMember {
  id: string;
  name: string;
  avatarUrl: string;
  /** 방장이면 이름 뒤에 (관리자) 를 붙인다 */
  isOwner?: boolean;
}

export interface CapsuleDetail extends CapsuleCover {
  description: string;
  /** 그룹캡슐이면 칩을 하나 더 노출한다 */
  isGroup: boolean;
  coverImageUrl: string;
  memberCount: number;
  letterCount: number;
  participants: CapsuleMember[];
  participantCount: number;
  receivers: CapsuleMember[];
  receiverCount: number;
  /** 방장만 타임캡슐 관리 섹션을 볼 수 있다 */
  isHost: boolean;
}

/** 캡슐 대표 아이콘 후보 */
export interface CapsuleIconOption {
  id: string;
  imageUrl: string;
}

/** 캡슐 구성원 역할 */
export type MemberRole = 'participant' | 'receiver';
