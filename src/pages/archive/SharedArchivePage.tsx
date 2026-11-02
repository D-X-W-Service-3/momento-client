import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  dismissReceivedMemory,
  getReceivedMemories,
  receiveMemory,
  saveReceivedMemory,
  toKoreanDate,
} from '@/apis/momento';
import ArchiveImageViewer from '@/components/archive/ArchiveImageViewer';
import PhotoCount from '@/components/archive/PhotoCount';
import MobileLayout from '@/components/layout/MobileLayout';

export default function SharedArchivePage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const queryClient = useQueryClient();
  const [index, setIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [error, setError] = useState('');
  const token = params.get('token');
  const receivedQuery = useQuery({
    queryKey: ['received-memories'],
    queryFn: getReceivedMemories,
    enabled: !token,
    retry: false,
  });
  useEffect(() => {
    if (!token) return;
    void receiveMemory(token)
      .then(() => {
        navigate('/archives/shared', { replace: true });
        void queryClient.invalidateQueries({ queryKey: ['received-memories'] });
      })
      .catch((reason: Error) => setError(reason.message));
  }, [token, navigate, queryClient]);
  const items = receivedQuery.data?.memories ?? [];
  const item = items[index];
  const images = item?.images?.map((image) => image.imageUrl) ?? [];
  const finish = async (action: 'save' | 'dismiss') => {
    if (!item) return;
    try {
      if (action === 'save') await saveReceivedMemory(item.receivedMemoryId);
      else await dismissReceivedMemory(item.receivedMemoryId);
      const next = items.filter(
        (entry) => entry.receivedMemoryId !== item.receivedMemoryId,
      );
      await queryClient.invalidateQueries({ queryKey: ['received-memories'] });
      setIndex(0);
      if (!next.length) navigate('/archives');
    } catch (reason) {
      setError((reason as Error).message);
    }
  };
  return (
    <MobileLayout>
      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
      {receivedQuery.error && (
        <p className="field-error" role="alert">
          {receivedQuery.error.message}
        </p>
      )}
      {!item ? (
        <p className="empty-state">공유받은 아카이브가 없어요.</p>
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
                  <span>{item.authorNickname}</span>
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
                onClick={() => void finish('dismiss')}
              >
                닫기
              </button>
              <button
                type="button"
                className="button-primary"
                onClick={() => void finish('save')}
              >
                아카이브 저장하기
              </button>
            </div>
          </section>
        </article>
      )}
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
