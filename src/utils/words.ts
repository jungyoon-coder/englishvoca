export const MAX_WORDS = 15
export const MIN_WORDS = 2

const WORD_SPLIT_PATTERN = /[\s,;|/]+/

export function normalizeWord(raw: string): string | null {
  const trimmed = raw.trim().toLowerCase()
  if (!trimmed) return null
  const cleaned = trimmed.replace(/[^a-z]/g, '')
  if (!cleaned) return null
  if (cleaned.length > 20) return cleaned.slice(0, 20)
  return cleaned
}

export function parseWordList(raw: string): string[] {
  return raw
    .split(WORD_SPLIT_PATTERN)
    .map(normalizeWord)
    .filter((word): word is string => Boolean(word))
}

export function formatWordCount(count: number) {
  return `${count}개 단어`
}
