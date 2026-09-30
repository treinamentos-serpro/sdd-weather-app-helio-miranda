interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col gap-3 rounded-lg border border-rose-300/20 bg-white/5 p-4 text-rose-100 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="min-w-0 break-words">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="min-h-11 shrink-0 rounded-lg bg-accent-600 px-4 py-2 font-medium text-white transition-colors hover:bg-accent-500 hover:text-night-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-night-900"
      >
        Tentar novamente
      </button>
    </div>
  );
}
