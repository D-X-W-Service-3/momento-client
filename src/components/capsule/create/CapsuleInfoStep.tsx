import CapsuleIconPicker from '@/components/capsule/CapsuleIconPicker';
import TextArea from '@/components/common/TextArea';
import TextField from '@/components/common/TextField';
import { useCapsuleIcons } from '@/hooks/useCapsule';
import { textStyles } from '@/styles/tokens';

interface CapsuleInfoStepProps {
  iconIndex: number;
  name: string;
  description: string;
  maxNameLength: number;
  maxDescriptionLength: number;
  onSelectIcon: (index: number) => void;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export default function CapsuleInfoStep({
  iconIndex,
  name,
  description,
  maxNameLength,
  maxDescriptionLength,
  onSelectIcon,
  onNameChange,
  onDescriptionChange,
}: CapsuleInfoStepProps) {
  const { data: icons = [] } = useCapsuleIcons();

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
        <CapsuleIconPicker
          icons={icons}
          label="아이콘 선택하기"
          selectedIndex={iconIndex}
          onSelectIndex={onSelectIcon}
        />

        <TextField
          label="캡슐 이름"
          placeholder="캡슐 이름을 입력해주세요"
          value={name}
          onChange={onNameChange}
          maxLength={maxNameLength}
        />

        <TextArea
          label="캡슐 설명"
          placeholder="캡슐 설명을 작성해 주세요."
          value={description}
          onChange={onDescriptionChange}
          maxLength={maxDescriptionLength}
        />
      </div>
    </div>
  );
}
