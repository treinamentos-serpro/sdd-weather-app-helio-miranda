interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = 'Carregando...' }: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-busy="true"
      className="flex min-w-0 items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-4 text-white/90 backdrop-blur-md"
    >
      <span
        aria-hidden="true"
        className="size-5 animate-spin rounded-full border-2 border-white/25 border-t-accent-400 motion-reduce:animate-none"
      />
      <span className="min-w-0 break-words">{message}</span>
    </div>
  );
}
