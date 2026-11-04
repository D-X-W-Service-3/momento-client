import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';

import ConfirmDialog from '@/components/common/ConfirmDialog';
import { getReceivedMemories, toKoreanDate } from '@/apis/momento';
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
    <MobileLayout>
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
        <div className="empty-state">
          <p>
            {receiveError || (!token && receivedQuery.error)
              ? '공유받은 아카이브를 불러올 수 없어요.'
              : token || receivedQuery.isPending
                ? '공유받은 아카이브를 불러오는 중이에요.'
                : '공유받은 아카이브가 없어요.'}
          </p>
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
          <div className="detail-cover-wrap">
            {images[0] && (
              <button
                type="button"
                className="detail-cover-trigger"
                onClick={() => setSelectedImage(0)}
              >
                <img className="detail-cover" src={images[0]} alt="대표 사진" />
              </button>
            )}
            <span className="detail-cover-counter">
              {index + 1} / {items.length}
            </span>
          </div>
          <header className="archive-detail-header">
            <button
              type="button"
              onClick={() => navigate('/archives')}
              aria-label="뒤로 가기"
            >
              <img src="/assets/archive/detail-back.svg" alt="" />
            </button>
          </header>
          <section className="detail-copy">
            <div className="shared-detail-main">
              <div className="shared-detail-top">
                <div className="detail-meta">
                  <span>{toKoreanDate(item.memoryDate)}</span>
                  <span>{item.senderNickname}</span>
                </div>
                <h1>{item.title}</h1>
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
