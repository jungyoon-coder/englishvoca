export const MAX_WORDS = 15
export const MIN_WORDS = 2

export function normalizeWord(raw: string): string | null {
  const trimmed = raw.trim().toLowerCase()
  if (!trimmed) return null
  const cleaned = trimmed.replace(/[^a-z]/g, '')
  if (!cleaned) return null
  if (cleaned.length > 20) return cleaned.slice(0, 20)
  return cleaned
}

