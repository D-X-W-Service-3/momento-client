import BottomSheet from '@/components/common/BottomSheet';
import DatePicker from '@/components/common/DatePicker';
import Toast from '@/components/common/Toast';
import { PlusIcon } from '@/components/common/Icons';
import ArchiveImageViewer from '@/components/archive/ArchiveImageViewer';
import { BackHeader } from '@/components/layout/Headers';
import MobileLayout from '@/components/layout/MobileLayout';
import { useArchiveForm } from '@/hooks/useArchiveForm';
import { MEMORY_IMAGE_ACCEPT, MAX_MEMORY_PHOTOS } from '@/utils/archivePhotos';

export default function ArchiveFormPage() {
  const {
    editing,
    name,
    date,
    content,
    photos,
    busy,
    canSave,
    calendarOpen,
    selectedImage,
    fileInput,
    error,
    helpers,
    toast,
    save,
    addPhotos,
    touch,
    closeCalendar,
    changeName,
    changeContent,
    openCalendar,
    selectDate,
    selectImage,
    clearPhotos,
    deletePhoto,
    makeCover,
  } = useArchiveForm();
  return (
    <MobileLayout className="archive-form-page">
      <BackHeader title={editing ? '아카이브 수정' : '아카이브 추가'} />
      <form
        className="form-page"
        noValidate
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
            disabled={busy}
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
            <button type="button" disabled={busy} onClick={clearPhotos}>
              <img src="/assets/archive/delete-all.svg" alt="" /> 전체삭제
            </button>
          </div>
          <div className="photo-strip">
            {photos.length === 0 && (
              <button
                type="button"
                className="photo-add"
                aria-label="첫 사진 추가"
                onClick={() => fileInput.current?.click()}
                disabled={busy}
              >
                <PlusIcon className="size-6 text-text-secondary" />
              </button>
            )}
            {photos.map((photo, index) => (
              <button
                type="button"
                className="photo-thumb"
                key={photo.id}
                disabled={busy}
                title="사진 자세히 보기"
                onClick={() => selectImage(index)}
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
            disabled={busy || photos.length >= MAX_MEMORY_PHOTOS}
          >
            사진 추가
          </button>
          <p className="form-hint">
            <img src="/assets/archive/info.svg" alt="" />
            <span>
              사진을 눌러 자세히 볼 수 있어요
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
              onChange={(event) => changeName(event.target.value)}
              onBlur={() => touch('name')}
              disabled={busy}
              aria-invalid={Boolean(helpers.name)}
              aria-describedby={helpers.name ? 'archive-name-help' : undefined}
              placeholder="아카이브 이름을 입력해주세요"
            />
            <small>{name.length}/15</small>
          </div>
          {helpers.name && (
            <small className="field-error" id="archive-name-help" role="alert">
              {helpers.name}
            </small>
          )}
        </label>
        <label className="input-group">
          <span>날짜</span>
          <button
            type="button"
            className="input-button"
            data-filled={Boolean(date)}
            onClick={openCalendar}
            disabled={busy}
            aria-label="날짜 선택"
            aria-invalid={Boolean(helpers.date)}
            aria-describedby={helpers.date ? 'archive-date-help' : undefined}
          >
            {date || '날짜를 선택해 주세요'}{' '}
            <img src="/assets/archive/calendar-icon.svg" alt="" />
          </button>
          {helpers.date && (
            <small className="field-error" id="archive-date-help" role="alert">
              {helpers.date}
            </small>
          )}
        </label>
        <label className="input-group">
          <span>추억 내용</span>
          <div className="textarea-wrap">
            <textarea
              maxLength={45}
              value={content}
              onChange={(event) => changeContent(event.target.value)}
              onBlur={() => touch('content')}
              required
              disabled={busy}
              aria-invalid={Boolean(helpers.content)}
              aria-describedby={
                helpers.content ? 'archive-content-help' : undefined
              }
              placeholder="내용을 입력해주세요"
            />
            <small>{content.length}/45</small>
          </div>
          {helpers.content && (
            <small
              className="field-error"
              id="archive-content-help"
              role="alert"
            >
              {helpers.content}
            </small>
          )}
        </label>
        {error && (
          <p className="field-error" role="alert">
            {error}
          </p>
        )}
        <button
          className="button-primary submit-button"
          type="submit"
          disabled={busy}
          aria-disabled={!canSave}
          onKeyDown={(event) => {
            if (!canSave && (event.key === 'Enter' || event.key === ' ')) {
              event.preventDefault();
              void save();
            }
          }}
        >
          {editing ? '수정하기' : '저장하기'}
        </button>
      </form>
      <BottomSheet open={calendarOpen} onClose={closeCalendar}>
        <DatePicker
          value={date}
          onCancel={closeCalendar}
          onSelect={selectDate}
        />
      </BottomSheet>
      {selectedImage !== null && photos[selectedImage] && (
        <ArchiveImageViewer
          images={photos.map((photo) => photo.previewUrl)}
          index={selectedImage}
          onChange={selectImage}
          onClose={() => selectImage(null)}
          onDelete={deletePhoto}
          onMakeCover={makeCover}
        />
      )}
      <Toast message={toast} />
    </MobileLayout>
  );
}
