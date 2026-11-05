import ContentState from '@/components/common/ContentState';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';

import ConfirmDialog from '@/components/common/ConfirmDialog';
import BottomSheet from '@/components/common/BottomSheet';
import { getReceivedMemories, toKoreanDate } from '@/apis/momento';
import ArchiveCoverCarousel from '@/components/archive/ArchiveCoverCarousel';
import ArchiveImageViewer from '@/components/archive/ArchiveImageViewer';
import PhotoCount from '@/components/archive/PhotoCount';
import MobileLayout from '@/components/layout/MobileLayout';
import { BackHeader } from '@/components/layout/Headers';
import { useFinishReceivedMemory } from '@/hooks/useMomentoMutations';
import { useReceiveSharedMemory } from '@/hooks/useReceiveSharedMemory';

export default function SharedArchivePage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const finishMemory = useFinishReceivedMemory();
  const [index, setIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [error, setError] = useState('');
  const token = params.get('token');
  const receiveError = useReceiveSharedMemory(token);
  const receivedQuery = useQuery({
    queryKey: ['received-memories'],
    queryFn: getReceivedMemories,
    enabled: !token,
    retry: false,
  });
  const items = token ? [] : (receivedQuery.data?.memories ?? []);
  const item = items[index];
  const images = item?.images?.map((image) => image.imageUrl) ?? [];
  const finish = async (action: 'save' | 'dismiss') => {
    if (!item || finishMemory.isPending) return;
    setError('');
    try {
      await finishMemory.mutateAsync({ id: item.receivedMemoryId, action });
      const next = items.filter(
        (entry) => entry.receivedMemoryId !== item.receivedMemoryId,
      );
      setIndex(0);
      if (!next.length) navigate('/archives');
    } catch (reason) {
      setError((reason as Error).message);
    }
  };
  return (
    <MobileLayout className="archive-detail-page shared-archive-page">
      {!item && (
        <BackHeader
          title="공유받은 아카이브"
          onBack={() => navigate('/archives')}
        />
      )}
      {receiveError && (
        <p className="field-error" role="alert">
          {receiveError}
        </p>
      )}
      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
      {!token && receivedQuery.error && (
        <p className="field-error" role="alert">
          {receivedQuery.error.message}
        </p>
      )}
      {!item ? (
        <div className="flex min-h-[calc(100dvh-56px-env(safe-area-inset-top))] flex-col items-center justify-center gap-5 px-5 pb-8">
          <ContentState
            title={
              receiveError || (!token && receivedQuery.error)
                ? '공유받은 아카이브를 불러올 수 없어요.'
                : token || receivedQuery.isPending
                  ? '공유받은 아카이브를 불러오는 중이에요.'
                  : '공유받은 아카이브가 없어요.'
            }
            description={
              receiveError || receivedQuery.error
                ? '잠시 후 다시 시도해주세요.'
                : token || receivedQuery.isPending
                  ? '잠시만 기다려주세요.'
                  : '친구가 공유한 추억을 이곳에서 확인할 수 있어요.'
            }
            loading={
              !receiveError &&
              !receivedQuery.error &&
              Boolean(token || receivedQuery.isPending)
            }
          />
          <button
            type="button"
            className="button-secondary"
            onClick={() => navigate('/archives')}
          >
            아카이브로 돌아가기
          </button>
        </div>
      ) : (
        <article className="archive-detail shared-detail">
          <ArchiveCoverCarousel images={images} onOpen={setSelectedImage} />
          <header className="archive-detail-header">
            <button
              type="button"
              onClick={() => navigate('/archives')}
              aria-label="뒤로 가기"
            >
              <img src="/assets/archive/detail-back.svg" alt="" />
            </button>
            <button
              type="button"
              aria-label="더보기"
              onClick={() => setMenuOpen(true)}
            >
              <img src="/assets/archive/detail-more.svg" alt="" />
            </button>
          </header>
          <section className="detail-copy">
            <div className="shared-detail-main">
              <div className="shared-detail-top">
                <div className="shared-detail-heading">
                  <div className="detail-meta">
                    <span>{toKoreanDate(item.memoryDate)}</span>
                    <span>{item.senderNickname}</span>
                  </div>
                  <h1>{item.title}</h1>
                </div>
                <p>{item.content}</p>
              </div>
              <div className="shared-detail-photos">
                <PhotoCount count={images.length} />
                <div className="thumbnail-row">
                  {images.map((image, imageIndex) => (
                    <button
                      type="button"
                      key={imageIndex}
                      onClick={() => setSelectedImage(imageIndex)}
                    >
                      <img src={image} alt={`${imageIndex + 1}번째 추억`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="shared-actions">
              <button
                type="button"
                className="button-secondary"
                disabled={finishMemory.isPending}
                onClick={() => void finish('dismiss')}
              >
                닫기
              </button>
              <button
                type="button"
                className="button-primary"
                disabled={finishMemory.isPending}
                onClick={() => setConfirmOpen(true)}
              >
                아카이브 저장하기
              </button>
            </div>
          </section>
        </article>
      )}
      <BottomSheet open={menuOpen} onClose={() => setMenuOpen(false)}>
        <div className="sheet-menu">
          <button
            type="button"
            disabled={finishMemory.isPending}
            onClick={() => {
              setMenuOpen(false);
              setConfirmOpen(true);
            }}
          >
            아카이브 저장하기
          </button>
          <button
            type="button"
            disabled={finishMemory.isPending}
            onClick={() => {
              setMenuOpen(false);
              void finish('dismiss');
            }}
          >
            닫기
          </button>
        </div>
      </BottomSheet>
      <ConfirmDialog
        open={confirmOpen}
        title="아카이브를 저장할까요?"
        cancelLabel="저장 안 함"
        confirmLabel="저장하기"
        confirmTone="primary"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          void finish('save');
        }}
      />
      {selectedImage !== null && (
        <ArchiveImageViewer
          images={images}
          index={selectedImage}
          onChange={setSelectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </MobileLayout>
  );
}
