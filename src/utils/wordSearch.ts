export type WordSearchPuzzle = {
  size: number
  grid: string[][]
  placed: string[]
  skipped: string[]
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

function randInt(maxExclusive: number) {
  return Math.floor(Math.random() * maxExclusive)
}

function sample<T>(arr: T[]) {
  return arr[randInt(arr.length)]
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
  for (let i = 0; i < word.length; i++) {
    grid[r + dir.dr * i][c + dir.dc * i] = word[i]
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

  const grid = makeGrid(size)
  const placed: string[] = []
  const skipped: string[] = []

  for (const word of cleaned) {
    let ok = false
    for (let attempt = 0; attempt < 180; attempt++) {
      const dir = sample(DIRS)
      const r = randInt(size)
      const c = randInt(size)
      if (!canPlace(grid, word, r, c, dir)) continue
      place(grid, word, r, c, dir)
      ok = true
      break
    }
    if (ok) placed.push(word)
    else skipped.push(word)
  }

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === '') grid[r][c] = alphabet[randInt(alphabet.length)]
    }
  }

  return { size, grid, placed, skipped }
}

