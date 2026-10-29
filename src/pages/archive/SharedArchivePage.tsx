import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Modal from '@/components/common/Modal';
import ArchiveImageViewer from '@/components/archive/ArchiveImageViewer';
import PhotoCount from '@/components/archive/PhotoCount';
import MobileLayout from '@/components/layout/MobileLayout';
import { useMomentoStore } from '@/stores/useMomentoStore';

export default function SharedArchivePage() {
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const saveShared = useMomentoStore((state) => state.saveShared);
  const sharedSaved = useMomentoStore((state) => state.sharedSaved);
  return (
    <MobileLayout>
      <article className="archive-detail shared-detail">
        <div className="detail-cover-wrap">
          <button
            type="button"
            className="detail-cover-trigger"
            aria-label="대표 사진 확대"
            onClick={() => setSelectedImage(0)}
          >
            <img
              className="detail-cover"
              src="/assets/archive/detail-1.jpg"
              alt=""
            />
          </button>
          <span className="detail-cover-counter">
            1 / {sharedImages.length}
          </span>
        </div>
        <header className="archive-detail-header">
          <button
            type="button"
            aria-label="뒤로 가기"
            onClick={() => navigate(-1)}
          >
            <img src="/assets/archive/detail-back.svg" alt="" />
          </button>
          <button
            type="button"
            aria-label="공유하기"
            onClick={() =>
              void navigator.clipboard?.writeText(window.location.href)
            }
          >
            <img src="/assets/archive/detail-more.svg" alt="" />
          </button>
        </header>
        <section className="detail-copy">
          <div className="shared-detail-main">
            <div className="shared-detail-top">
              <div className="shared-detail-heading">
                <div className="detail-meta">
                  <span>2027년 3월 1일</span>
                  <span>유빈</span>
                </div>
                <h1>2024 우리, 다시 만나는 날</h1>
              </div>
              <p>
                오늘 친구들과 함께 카페에서 오랜만에 만나서 정말 즐거운 시간을
                보냈어. 웃음이 끊이지 않고, 서로의 근황도 나누면서 행복한
                하루였어.
              </p>
            </div>
            <div className="shared-detail-photos">
              <PhotoCount count={sharedImages.length} />
              <div className="thumbnail-row">
                {archiveImagesForShared.map((image, index) => (
                  <button
                    type="button"
                    key={image}
                    onClick={() => setSelectedImage(index + 1)}
                  >
                    <img src={image} alt={`${index + 2}번째 추억`} />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="shared-actions">
            <button
              type="button"
              className="button-secondary"
              onClick={() => navigate(-1)}
            >
              닫기
            </button>
            <button
              type="button"
              className="button-primary"
              onClick={() => setConfirmOpen(true)}
            >
              {sharedSaved ? '저장 완료' : '아카이브 저장하기'}
            </button>
          </div>
        </section>
      </article>
      <Modal
        open={confirmOpen}
        title="아카이브를 저장할까요?"
        cancelLabel="저장 안 함"
        confirmLabel="저장하기"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          saveShared();
          navigate('/archives');
        }}
      />
      {selectedImage !== null && (
        <ArchiveImageViewer
          images={sharedImages}
          index={selectedImage}
          onChange={setSelectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </MobileLayout>
  );
}

const archiveImagesForShared = [
  '/assets/archive/memory-04.jpg',
  '/assets/archive/memory-03.jpg',
  '/assets/archive/memory-06.jpg',
  '/assets/archive/memory-01.jpg',
];
const sharedImages = [
  '/assets/archive/detail-1.jpg',
  ...archiveImagesForShared,
];
