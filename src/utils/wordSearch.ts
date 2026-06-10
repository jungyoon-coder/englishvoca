export type WordSearchCell = {
  r: number
  c: number
}

export type WordSearchPlacement = {
  word: string
  start: WordSearchCell
  end: WordSearchCell
  cells: WordSearchCell[]
}

export type WordSearchPuzzle = {
  size: number
  grid: string[][]
  placed: string[]
  skipped: string[]
  placements: WordSearchPlacement[]
}

type Dir = { dr: number; dc: number }

const DIRS: Dir[] = [
  { dr: 0, dc: 1 },
  { dr: 1, dc: 0 },
  { dr: 0, dc: -1 },
  { dr: -1, dc: 0 },
  { dr: 1, dc: 1 },
  { dr: 1, dc: -1 },
  { dr: -1, dc: 1 },
  { dr: -1, dc: -1 },
]

function hashWords(words: string[]) {
  const source = words.join('|')
  let hash = 2166136261
  for (let i = 0; i < source.length; i++) {
    hash ^= source.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function randInt(maxExclusive: number, rnd: () => number) {
  return Math.floor(rnd() * maxExclusive)
}

function sample<T>(arr: T[], rnd: () => number) {
  return arr[randInt(arr.length, rnd)]
}

function canPlace(grid: string[][], word: string, r: number, c: number, dir: Dir) {
  const n = grid.length
  for (let i = 0; i < word.length; i++) {
    const rr = r + dir.dr * i
    const cc = c + dir.dc * i
    if (rr < 0 || cc < 0 || rr >= n || cc >= n) return false
    const existing = grid[rr][cc]
    if (existing !== '' && existing !== word[i]) return false
  }
  return true
}

function place(grid: string[][], word: string, r: number, c: number, dir: Dir) {
  const cells: WordSearchCell[] = []
  for (let i = 0; i < word.length; i++) {
    const cell = { r: r + dir.dr * i, c: c + dir.dc * i }
    grid[cell.r][cell.c] = word[i]
    cells.push(cell)
  }

  return {
    word,
    start: cells[0],
    end: cells[cells.length - 1],
    cells,
  }
}

function makeGrid(n: number) {
  return Array.from({ length: n }, () => Array.from({ length: n }, () => ''))
}

export function generateWordSearch(words: string[], size: number): WordSearchPuzzle {
  const cleaned = words
    .map((w) => w.toUpperCase())
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)

  const rnd = mulberry32(hashWords(cleaned))
  const grid = makeGrid(size)
  const placed: string[] = []
  const skipped: string[] = []
  const placements: WordSearchPlacement[] = []

  for (const word of cleaned) {
    let placement: WordSearchPlacement | null = null
    for (let attempt = 0; attempt < 180; attempt++) {
      const dir = sample(DIRS, rnd)
      const r = randInt(size, rnd)
      const c = randInt(size, rnd)
      if (!canPlace(grid, word, r, c, dir)) continue
      placement = place(grid, word, r, c, dir)
      break
    }
    if (placement) {
      placed.push(word)
      placements.push(placement)
    } else {
      skipped.push(word)
    }
  }

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === '') grid[r][c] = alphabet[randInt(alphabet.length, rnd)]
    }
  }

  return { size, grid, placed, skipped, placements }
}
