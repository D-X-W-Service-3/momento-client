import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-md flex-col items-center justify-center gap-3 px-5">
      <h1 className="text-h1 font-bold">404</h1>
      <p className="text-body-md text-text-secondary">
        페이지를 찾을 수 없습니다.
      </p>
      <Link to="/home" className="text-body-md text-primary underline">
        홈으로 이동
      </Link>
    </div>
  );
}
