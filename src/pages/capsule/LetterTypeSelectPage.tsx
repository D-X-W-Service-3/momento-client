import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import CheckCircleOutlineIcon from '@/assets/icons/check-circle-outline.svg?react';
import CheckCircleSolidIcon from '@/assets/icons/check-circle-solid.svg?react';
import Button from '@/components/common/Button';
import BackHeader from '@/components/layout/BackHeader';
import { letterPaperPath } from '@/constants/routes';
import type { LetterType } from '@/types/letter';

const OPTIONS: {
  key: LetterType;
  title: string;
  description: string;
}[] = [
  {
    key: 'BIRTHDAY',
    title: '생일 축하 편지',
    description: '생일 축하 편지를 남겨보세요',
  },
  {
    key: 'COUPLE_ANNIVERSARY',
    title: '연인과의 기념일 편지',
    description: '특별한 기념일을 편지로 남겨보세요',
  },
  {
    key: 'CHRISTMAS',
    title: '크리스마스 편지',
    description: '1년에 한 번, 연말을 기념하는 편지를 남겨보세요',
  },
  {
    key: 'GENERAL',
    title: '다른 종류의 편지를 작성할게요',
    description: '내가 원하는 편지를 작성하고 싶어요',
  },
];

/** 편지 작성 1단계. 고른 유형은 letterType 으로 서버에 보낸다. */
export default function LetterTypeSelectPage() {
  const { capsuleId = '' } = useParams();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<LetterType>();

  return (
    <div className="min-h-[100dvh] bg-surface-gray">
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-md flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
        <BackHeader title="편지 작성" />

        <main className="flex flex-1 flex-col justify-between px-5 pb-5">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              {/* 화면 제목(h1)은 BackHeader 가 담당한다 */}
              <h2 className="font-display text-title-md font-bold text-black">
                어떤 편지를 작성할까요?
              </h2>
              <p className="font-display text-meta text-ink-muted">
                캡슐이 열리는 날 AI가 제작한 이미지와 함께
                <br />
                추억의 순간을 전달해 드릴게요
              </p>
            </div>

            <ul className="flex w-full flex-col gap-5">
              {OPTIONS.map((option) => {
                const isSelected = option.key === selected;
                return (
                  <li key={option.key}>
                    <button
                      type="button"
                      onClick={() => setSelected(option.key)}
                      aria-pressed={isSelected}
                      // 선택 테두리는 outline 으로 그린다. border 로 그리면
                      // 카드가 2px 높아져 아래 카드들이 밀린다.
                      className={`flex w-full cursor-pointer items-center justify-center gap-list rounded-lg p-5 text-left transition-colors ${
                        isSelected
                          ? 'bg-info-bg outline-1 -outline-offset-1 outline-primary-strong'
                          : 'bg-surface'
                      }`}
                    >
                      <span className="flex min-w-0 flex-1 flex-col gap-1">
                        <strong className="text-button font-semibold text-ink">
                          {option.title}
                        </strong>
                        <span className="font-display text-meta text-ink-faint">
                          {option.description}
                        </span>
                      </span>

                      {isSelected ? (
                        <CheckCircleSolidIcon className="size-5 shrink-0" />
                      ) : (
                        <CheckCircleOutlineIcon className="size-5 shrink-0" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <Button
            disabled={!selected}
            onClick={() =>
              navigate(letterPaperPath(capsuleId), {
                state: { letterType: selected },
              })
            }
          >
            다음
          </Button>
        </main>
      </div>
    </div>
  );
}
