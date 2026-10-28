import { type ChangeEvent, type MouseEvent, useRef } from 'react';

import capsulePopsicleImg from '@/assets/images/home-capsule-popsicle.png';
import { textStyles } from '@/styles/tokens';

interface CapsuleInfoStepProps {
  iconIndex: number;
  totalIcons: number;
  name: string;
  description: string;
  maxNameLength: number;
  maxDescriptionLength: number;
  onSelectIcon: (index: number) => void;
  onNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function CapsuleInfoStep({
  iconIndex,
  totalIcons,
  name,
  description,
  maxNameLength,
  maxDescriptionLength,
  onSelectIcon,
  onNameChange,
  onDescriptionChange,
}: CapsuleInfoStepProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const deltaXRef = useRef(0);

  const scrollToIcon = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(totalIcons - 1, index));
    onSelectIcon(clamped);
    el.scrollTo({
      left: clamped * el.clientWidth,
      behavior: 'smooth',
    });
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el || isDownRef.current || el.clientWidth === 0) return;
    const next = Math.round(el.scrollLeft / el.clientWidth);
    if (next >= 0 && next < totalIcons && next !== iconIndex) {
      onSelectIcon(next);
    }
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    isDownRef.current = true;
    startXRef.current = e.clientX;
    deltaXRef.current = 0;
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDownRef.current) return;
    deltaXRef.current = e.clientX - startXRef.current;
  };

  const handleMouseEnd = () => {
    if (!isDownRef.current) return;
    isDownRef.current = false;
    if (deltaXRef.current <= -35 && iconIndex < totalIcons - 1) {
      scrollToIcon(iconIndex + 1);
    } else if (deltaXRef.current >= 35 && iconIndex > 0) {
      scrollToIcon(iconIndex - 1);
    }
  };

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className={`text-text-primary ${textStyles['heading-h2']}`}>
          어떤 추억을 담아볼까요?
        </h2>
        <p className={`text-text-secondary ${textStyles['body-xs']}`}>
          캡슐의 대표 아이콘과 이름, 한 줄 소개를 입력해주세요
        </p>
      </div>

      <div className="flex w-full flex-col gap-[23px]">
        <div className="flex w-full flex-col gap-2">
          <span className={`text-text-label ${textStyles['field-label']}`}>
            아이콘 선택하기
          </span>

          <div className="bg-surface-white flex h-[200px] w-full flex-col items-center justify-center gap-3 rounded-lg px-4 py-[14px]">
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseEnd}
              onMouseLeave={handleMouseEnd}
              className="flex w-full cursor-grab snap-x snap-mandatory overflow-x-auto select-none [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
            >
              {Array.from({ length: totalIcons }, (_, idx) => (
                <div
                  key={idx}
                  className="flex w-full shrink-0 snap-center items-center justify-center py-2"
                >
                  <img
                    src={capsulePopsicleImg}
                    alt={`캡슐 아이콘 ${idx + 1}`}
                    draggable={false}
                    className="pointer-events-none h-[92px] w-[101px] object-contain"
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-[6px]">
              {Array.from({ length: totalIcons }, (_, idx) => {
                const isActive = idx === iconIndex;
                return (
                  <button
                    key={idx}
                    type="button"
                    aria-label={`아이콘 ${idx + 1} 선택`}
                    onClick={() => scrollToIcon(idx)}
                    className={`h-[6px] w-[6px] cursor-pointer rounded-full transition-colors ${
                      isActive ? 'bg-primary' : 'bg-text-primary/20'
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col gap-2">
          <label
            htmlFor="capsule-create-name"
            className={`text-text-label ${textStyles['field-label']}`}
          >
            캡슐 이름
          </label>
          <div className="bg-surface-white flex h-14 w-full items-center justify-between gap-2 rounded-lg px-4">
            <input
              id="capsule-create-name"
              type="text"
              value={name}
              onChange={onNameChange}
              maxLength={maxNameLength}
              placeholder="캡슐 이름을 입력해주세요"
              className={`text-text-dark placeholder:text-text-hint w-full bg-transparent outline-none ${textStyles['input-value']}`}
            />
            <span
              className={`text-text-hint shrink-0 ${textStyles['char-counter']}`}
            >
              {name.length}/{maxNameLength}
            </span>
          </div>
        </div>

        <div className="flex w-full flex-col gap-2">
          <label
            htmlFor="capsule-create-desc"
            className={`text-text-label ${textStyles['field-label']}`}
          >
            캡슐 설명
          </label>
          <div className="bg-surface-white flex h-[105px] w-full flex-col justify-between gap-2 rounded-lg px-4 py-[14px]">
            <textarea
              id="capsule-create-desc"
              value={description}
              onChange={onDescriptionChange}
              maxLength={maxDescriptionLength}
              placeholder="캡슐 설명을 작성해 주세요."
              className={`text-text-dark placeholder:text-text-hint h-[52px] w-full resize-none bg-transparent outline-none ${textStyles['body-large']}`}
            />
            <div className="flex justify-end">
              <span className={`text-text-hint ${textStyles['char-counter']}`}>
                {description.length}/{maxDescriptionLength}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
