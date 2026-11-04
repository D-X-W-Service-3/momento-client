export default function Toast({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 z-[200] w-max max-w-[calc(100%-40px)] -translate-x-1/2 rounded-lg bg-text-label px-4 py-3 text-center text-body-md text-surface-white shadow-level-2"
    >
      {message}
    </div>
  );
}
