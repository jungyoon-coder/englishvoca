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
type Candidate = {
  word: string
  r: number
  c: number
  dir: Dir
  overlap: number
}

const DIRS: Dir[] = [
  { dr: 0, dc: 1 },
  { dr: 1, dc: 0 },
  { dr: 1, dc: 1 },
  { dr: 1, dc: -1 },
  { dr: 0, dc: -1 },
  { dr: -1, dc: 0 },
  { dr: -1, dc: -1 },
  { dr: -1, dc: 1 },
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

function shuffle<T>(items: T[], rnd: () => number) {
  const result = items.slice()
  for (let i = result.length - 1; i > 0; i--) {
    const j = randInt(i + 1, rnd)
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

function makeGrid(n: number) {
  return Array.from({ length: n }, () => Array.from({ length: n }, () => ''))
}

function inBounds(size: number, r: number, c: number) {
  return r >= 0 && c >= 0 && r < size && c < size
}

function getCells(size: number, word: string, r: number, c: number, dir: Dir) {
  const cells: WordSearchCell[] = []
  for (let i = 0; i < word.length; i++) {
    const cell = { r: r + dir.dr * i, c: c + dir.dc * i }
    if (!inBounds(size, cell.r, cell.c)) return null
    cells.push(cell)
  }
  return cells
}

function getCandidate(grid: string[][], word: string, r: number, c: number, dir: Dir) {
  const cells = getCells(grid.length, word, r, c, dir)
  if (!cells) return null

  let overlap = 0
  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i]
    const existing = grid[cell.r][cell.c]
    if (existing !== '' && existing !== word[i]) return null
    if (existing === word[i]) overlap++
  }

  return { word, r, c, dir, overlap }
}

function getCandidates(grid: string[][], word: string, rnd: () => number) {
  const candidates: Candidate[] = []
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid.length; c++) {
      for (const dir of DIRS) {
        const candidate = getCandidate(grid, word, r, c, dir)
        if (candidate) candidates.push(candidate)
      }
    }
  }

  return shuffle(candidates, rnd).sort((a, b) => b.overlap - a.overlap)
}

function place(grid: string[][], candidate: Candidate): WordSearchPlacement {
  const cells = getCells(grid.length, candidate.word, candidate.r, candidate.c, candidate.dir)
  if (!cells) {
    throw new Error(`Invalid word search placement for ${candidate.word}`)
  }

  for (let i = 0; i < candidate.word.length; i++) {
    const cell = cells[i]
    grid[cell.r][cell.c] = candidate.word[i]
  }

  return {
    word: candidate.word,
    start: cells[0],
    end: cells[cells.length - 1],
    cells,
  }
}

function buildGreedy(words: string[], size: number, rnd: () => number) {
  const grid = makeGrid(size)
  const placements: WordSearchPlacement[] = []

  for (const word of words) {
    const candidates = getCandidates(grid, word, rnd)
    const candidate = candidates[0]
    if (!candidate) return null
    placements.push(place(grid, candidate))
  }

  return { grid, placements }
}

function buildGuaranteedRows(words: string[], size: number) {
  const grid = makeGrid(size)
  const placements: WordSearchPlacement[] = []

  for (let r = 0; r < words.length; r++) {
    placements.push(place(grid, { word: words[r], r, c: 0, dir: { dr: 0, dc: 1 }, overlap: 0 }))
  }

  return { grid, placements }
}

function fillEmptyCells(grid: string[][], rnd: () => number) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid.length; c++) {
      if (grid[r][c] === '') grid[r][c] = alphabet[randInt(alphabet.length, rnd)]
    }
  }
}

export function generateWordSearch(words: string[], requestedSize: number): WordSearchPuzzle {
  const cleaned = words
    .map((w) => w.trim().toUpperCase().replace(/[^A-Z]/g, ''))
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)

  if (cleaned.length === 0) {
    return {
      size: requestedSize,
      grid: makeGrid(requestedSize),
      placed: [],
      skipped: [],
      placements: [],
    }
  }

  const longest = Math.max(...cleaned.map((word) => word.length))
  const baseSize = Math.max(requestedSize, longest, cleaned.length)
  const seed = hashWords(cleaned)

  let built: { grid: string[][]; placements: WordSearchPlacement[] } | null = null
  let finalSize = baseSize

  for (let size = baseSize; size <= baseSize + 4; size++) {
    const rnd = mulberry32(seed + size * 997)
    built = buildGreedy(cleaned, size, rnd)
    if (built) {
      finalSize = size
      break
    }
  }

  if (!built) {
    finalSize = baseSize
    built = buildGuaranteedRows(cleaned, finalSize)
  }

  fillEmptyCells(built.grid, mulberry32(seed + finalSize * 1543))

  return {
    size: finalSize,
    grid: built.grid,
    placed: built.placements.map((placement) => placement.word),
    skipped: [],
    placements: built.placements,
  }
}
