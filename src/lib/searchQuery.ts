export function normalizeSearchQuery(name: string): string | null {
  const query = name.trim();
  return query.length > 0 ? query : null;
}
