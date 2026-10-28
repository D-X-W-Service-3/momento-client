import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import BottomSheet from '@/components/common/BottomSheet';
import DatePicker from '@/components/common/DatePicker';
import ArchiveImageViewer from '@/components/archive/ArchiveImageViewer';
import { BackHeader } from '@/components/layout/Headers';
import MobileLayout from '@/components/layout/MobileLayout';
import { useMomentoStore } from '@/stores/useMomentoStore';

async function preparePhoto(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const ratio = Math.min(1, 900 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * ratio);
  canvas.height = Math.round(bitmap.height * ratio);
  canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL('image/jpeg', 0.75);
}

export default function ArchiveFormPage() {
  const { archiveId } = useParams();
  const navigate = useNavigate();
  const archives = useMomentoStore((state) => state.archives);
  const addArchive = useMomentoStore((state) => state.addArchive);
  const updateArchive = useMomentoStore((state) => state.updateArchive);
  const existing = archives.find((archive) => archive.id === Number(archiveId));
  const editing = Boolean(existing);
  const [name, setName] = useState(existing?.title.replace('\n', ' ') ?? '');
  const [date, setDate] = useState(existing?.date ?? '');
  const [content, setContent] = useState(existing?.content ?? '');
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [photos, setPhotos] = useState(existing?.images ?? []);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const save = () => {
    if (!photos.length || !name.trim() || !date) {
      setShowErrors(true);
      return;
    }
    const value = {
      title: name.trim(),
      date,
      author: existing?.author ?? '나',
      content: content.trim(),
      images: photos,
    };
    if (existing) {
      updateArchive(existing.id, value);
      navigate(`/archives/${existing.id}`);
    } else {
      const id = addArchive(value);
      navigate(`/archives/${id}`);
    }
  };

  const addPhotos = async (files: FileList | null) => {
    if (!files) return;
    const available = Math.max(0, 8 - photos.length);
    const selected = Array.from(files).slice(0, available);
    const prepared = await Promise.all(selected.map(preparePhoto));
    setPhotos((current) => [...current, ...prepared].slice(0, 8));
    if (fileInput.current) fileInput.current.value = '';
  };

  return (
    <MobileLayout>
      <BackHeader title={editing ? '아카이브 수정' : '아카이브 추가'} />
      <form
        className="form-page"
        onSubmit={(event) => {
          event.preventDefault();
          save();
        }}
      >
        {!editing && (
          <div className="form-intro">
            <h1>어떤 추억을 담아볼까요?</h1>
            <p>오늘의 추억을 아카이브로 추가해 보세요</p>
          </div>
        )}
        <section className="photo-form">
          <input
            ref={fileInput}
            className="visually-hidden"
            type="file"
            accept="image/*"
            multiple
            onChange={(event) => void addPhotos(event.target.files)}
          />
          <div className="form-section-title">
            <strong>
              사진 <span>{photos.length}/8</span>
            </strong>
            <button type="button" onClick={() => setPhotos([])}>
              <img src="/assets/archive/delete-all.svg" alt="" /> 전체삭제
            </button>
          </div>
          <div className="photo-strip">
            <button
              type="button"
              className="photo-add"
              onClick={() => fileInput.current?.click()}
              disabled={photos.length >= 8}
            >
              <span className="visually-hidden">사진 선택</span>
            </button>
            {photos.map((photo, index) => (
              <button
                type="button"
                className="photo-thumb"
                key={`${photo}-${index}`}
                title="사진 자세히 보기"
                onClick={() => setSelectedImage(index)}
              >
                <img src={photo} alt={`${index + 1}번째 사진`} />
                {index === 0 && <span className="cover-badge">대표</span>}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="photo-add-wide"
            onClick={() => fileInput.current?.click()}
            disabled={photos.length >= 8}
          >
            사진 추가
          </button>
          <p className="form-hint">
            <img src="/assets/archive/info.svg" alt="" />
            <span>
              사진을 길게 눌러 자세히 볼 수 있어요
              <br />
              상세 이미지 화면에서 삭제, 대표사진을 변경해보세요
            </span>
          </p>
          {showErrors && !photos.length && (
            <small className="field-error">
              사진을 한 장 이상 추가해 주세요.
            </small>
          )}
        </section>
        <label className="input-group">
          <span>아카이브 이름</span>
          <div>
            <input
              required
              maxLength={15}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="아카이브 이름을 입력해주세요"
            />
            <small>{name.length}/15</small>
          </div>
          {showErrors && !name.trim() && (
            <small className="field-error">
              아카이브 이름을 입력해 주세요.
            </small>
          )}
        </label>
        <label className="input-group">
          <span>날짜</span>
          <button
            type="button"
            className="input-button"
            onClick={() => setCalendarOpen(true)}
          >
            {date || '날짜를 선택해 주세요'}{' '}
            <img src="/assets/archive/calendar-icon.svg" alt="" />
          </button>
          {showErrors && !date && (
            <small className="field-error">날짜를 선택해 주세요.</small>
          )}
        </label>
        <label className="input-group">
          <span>추억 내용</span>
          <div className="textarea-wrap">
            <textarea
              maxLength={45}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="내용을 입력해주세요"
            />
            <small>{content.length}/45</small>
          </div>
        </label>
        <button className="button-primary submit-button" type="submit">
          {editing ? '수정하기' : '저장하기'}
        </button>
      </form>
      <BottomSheet open={calendarOpen} onClose={() => setCalendarOpen(false)}>
        <DatePicker
          value={date}
          onCancel={() => setCalendarOpen(false)}
          onSelect={(value) => {
            setDate(value);
            setCalendarOpen(false);
          }}
        />
      </BottomSheet>
      {selectedImage !== null && photos[selectedImage] && (
        <ArchiveImageViewer
          images={photos}
          index={selectedImage}
          onChange={setSelectedImage}
          onClose={() => setSelectedImage(null)}
          onDelete={(index) => {
            setPhotos((current) =>
              current.filter((_, position) => position !== index),
            );
            setSelectedImage(null);
          }}
          onMakeCover={(index) => {
            setPhotos((current) => [
              current[index],
              ...current.filter((_, position) => position !== index),
            ]);
            setSelectedImage(0);
          }}
        />
      )}
    </MobileLayout>
  );
}
