export default function PhotoCount({ count }: { count: number }) {
  return (
    <div className="photo-count">
      <img src="/assets/archive/photo-count.svg" alt="" aria-hidden="true" />
      <span>사진 {count}장</span>
    </div>
  );
}
