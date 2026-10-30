import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import BottomSheet from '@/components/common/BottomSheet';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import ArchiveImageViewer from '@/components/archive/ArchiveImageViewer';
import PhotoCount from '@/components/archive/PhotoCount';
import { BackHeader } from '@/components/layout/Headers';
import MobileLayout from '@/components/layout/MobileLayout';
import { useMomentoStore } from '@/stores/useMomentoStore';

export default function ArchiveDetailPage() {
  const { archiveId } = useParams();
  const navigate = useNavigate();
  const archives = useMomentoStore((state) => state.archives);
  const deleteArchive = useMomentoStore((state) => state.deleteArchive);
  const archive = archives.find((item) => item.id === Number(archiveId));
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  if (!archive)
    return (
      <MobileLayout>
        <BackHeader title="아카이브" />
        <p className="empty-state">아카이브를 찾을 수 없어요.</p>
      </MobileLayout>
    );

  return (
    <MobileLayout>
      <article className="archive-detail">
        <div className="detail-cover-wrap">
          <button
            type="button"
            className="detail-cover-trigger"
            aria-label="대표 사진 확대"
            onClick={() => setSelectedImage(0)}
          >
            <img className="detail-cover" src={archive.images[0]} alt="" />
          </button>
          <span className="detail-cover-counter">
            1 / {archive.images.length}
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
            aria-label="더보기"
            onClick={() => setMenuOpen(true)}
          >
            <img src="/assets/archive/detail-more.svg" alt="" />
          </button>
        </header>
        <section className="detail-copy">
          <div className="detail-meta">
            <span>{archive.date}</span>
            <span>{archive.author}</span>
          </div>
          <h1>{archive.title.replace('\n', ' ')}</h1>
          <p>{archive.content}</p>
          <PhotoCount count={archive.images.length} />
          <div className="thumbnail-row">
            {archive.images.map((image, index) => (
              <button
                type="button"
                key={image}
                onClick={() => setSelectedImage(index)}
              >
                <img src={image} alt={`${index + 1}번째 추억`} />
              </button>
            ))}
          </div>
        </section>
      </article>
      <BottomSheet open={menuOpen} onClose={() => setMenuOpen(false)}>
        <div className="sheet-menu">
          <button
            type="button"
            onClick={() => navigate(`/archives/${archive.id}/edit`)}
          >
            <img src="/assets/archive/action-edit.svg" alt="" /> 수정하기
          </button>
          <button
            type="button"
            onClick={() =>
              void navigator.clipboard?.writeText(window.location.href)
            }
          >
            <img src="/assets/archive/action-share.svg" alt="" /> 공유하기
          </button>
          <button
            type="button"
            className="danger"
            onClick={() => {
              setMenuOpen(false);
              setDeleteOpen(true);
            }}
          >
            <img src="/assets/archive/action-delete.svg" alt="" /> 삭제하기
          </button>
        </div>
      </BottomSheet>
      <ConfirmDialog
        open={deleteOpen}
        title="아카이브를 삭제할까요?"
        description="삭제한 아카이브는 되돌릴 수 없어요."
        confirmLabel="삭제"
        danger
        onCancel={() => setDeleteOpen(false)}
        onConfirm={() => {
          deleteArchive(archive.id);
          navigate('/archives');
        }}
      />
      {selectedImage !== null && (
        <ArchiveImageViewer
          images={archive.images}
          index={selectedImage}
          onChange={setSelectedImage}
          onClose={() => setSelectedImage(null)}
          onMore={() => {
            setSelectedImage(null);
            setMenuOpen(true);
          }}
        />
      )}
    </MobileLayout>
  );
}
