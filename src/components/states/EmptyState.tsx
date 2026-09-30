interface EmptyStateProps {
  title: string;
  hint: string;
}

export default function EmptyState({ title, hint }: EmptyStateProps) {
  return (
    <section
      role="status"
      className="rounded-lg border border-white/10 bg-white/5 p-5 text-white backdrop-blur-md"
    >
      <h2 className="font-semibold">{title}</h2>
      <p className="mt-1 break-words text-sm text-white/80">{hint}</p>
    </section>
  );
}
