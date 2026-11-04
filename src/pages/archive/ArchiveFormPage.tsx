import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';

import BottomSheet from '@/components/common/BottomSheet';
import DatePicker from '@/components/common/DatePicker';
import ArchiveImageViewer from '@/components/archive/ArchiveImageViewer';
import { BackHeader } from '@/components/layout/Headers';
import MobileLayout from '@/components/layout/MobileLayout';
import {
  getMemory,
  toIsoDate,
  toKoreanDate,
  uploadMemoryImages,
} from '@/apis/momento';
import { useSaveMemory } from '@/hooks/useMomentoMutations';
import {
  MEMORY_IMAGE_ACCEPT,
  MAX_MEMORY_PHOTOS,
  prepareArchivePhotos,
  resolveArchiveImageKeys,
  type ArchivePhoto,
} from '@/utils/archivePhotos';

export default function ArchiveFormPage() {
  const { archiveId } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(archiveId);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [preparing, setPreparing] = useState(false);
  const saveMemory = useSaveMemory(archiveId);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [photos, setPhotos] = useState<ArchivePhoto[]>([]);
  const memoryQuery = useQuery({
    queryKey: ['memory', archiveId],
    queryFn: () => getMemory(Number(archiveId)),
    enabled: editing,
    retry: false,
  });
  useEffect(() => {
    const item = memoryQuery.data;
    if (item) {
      setName(item.title);
      setDate(toKoreanDate(item.memoryDate));
      setContent(item.content);
      setPhotos(
        item.images.map((image) => ({
          id: image.imageKey,
          previewUrl: image.imageUrl,
          imageKey: image.imageKey,
        })),
      );
    }
  }, [memoryQuery.data]);
  const displayError = error || memoryQuery.error?.message;
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const save = async () => {
    if (saving || preparing) return;
    if (!name.trim() || !date) {
      setShowErrors(true);
      return;
    }
    setSaving(true);
    setError('');
    try {
      const files = photos.flatMap((photo) => (photo.file ? [photo.file] : []));
      const uploaded = await uploadMemoryImages(files);
      const value = {
        title: name.trim(),
        content: content.trim(),
        memoryDate: toIsoDate(date),
        imageKeys: resolveArchiveImageKeys(photos, uploaded),
      };
      await saveMemory.mutateAsync(value);
      if (archiveId) {
        navigate(`/archives/${archiveId}`);
      } else {
        navigate('/archives');
      }
    } catch (reason) {
      setError((reason as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const addPhotos = async (files: FileList | null) => {
    if (!files?.length || preparing || saving) return;
    const available = Math.max(0, MAX_MEMORY_PHOTOS - photos.length);
    const selected = Array.from(files).slice(0, available);
    setPreparing(true);
    setError('');
    try {
      const prepared = await prepareArchivePhotos(selected);
      setPhotos((current) =>
        [...current, ...prepared].slice(0, MAX_MEMORY_PHOTOS),
      );
    } catch (reason) {
      setError((reason as Error).message);
    } finally {
      setPreparing(false);
      if (fileInput.current) fileInput.current.value = '';
    }
  };

  return (
    <MobileLayout className="archive-form-page">
      <BackHeader title={editing ? '아카이브 수정' : '아카이브 추가'} />
      <form
        className="form-page"
        onSubmit={(event) => {
          event.preventDefault();
          void save();
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
            accept={MEMORY_IMAGE_ACCEPT}
            disabled={saving || preparing}
            multiple
            onChange={(event) => void addPhotos(event.target.files)}
          />
          <div className="form-section-title">
            <strong>
              사진{' '}
              <span>
                {photos.length}/{MAX_MEMORY_PHOTOS}
              </span>
            </strong>
            <button
              type="button"
              disabled={saving || preparing}
              onClick={() => {
                setPhotos([]);
                setSelectedImage(null);
              }}
            >
              <img src="/assets/archive/delete-all.svg" alt="" /> 전체삭제
            </button>
          </div>
          <div className="photo-strip">
            <button
              type="button"
              className="photo-add"
              onClick={() => fileInput.current?.click()}
              disabled={
                saving || preparing || photos.length >= MAX_MEMORY_PHOTOS
              }
            >
              <span className="visually-hidden">사진 선택</span>
            </button>
            {photos.map((photo, index) => (
              <button
                type="button"
                className="photo-thumb"
                key={photo.id}
                disabled={saving || preparing}
                title="사진 자세히 보기"
                onClick={() => setSelectedImage(index)}
              >
                <img src={photo.previewUrl} alt={`${index + 1}번째 사진`} />
                {index === 0 && <span className="cover-badge">대표</span>}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="photo-add-wide"
            onClick={() => fileInput.current?.click()}
            disabled={saving || preparing || photos.length >= MAX_MEMORY_PHOTOS}
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
            data-filled={Boolean(date)}
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
        {displayError && (
          <p className="field-error" role="alert">
            {displayError}
          </p>
        )}
        <button
          className="button-primary submit-button"
          type="submit"
          disabled={saving || preparing || (editing && memoryQuery.isPending)}
        >
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
          images={photos.map((photo) => photo.previewUrl)}
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
