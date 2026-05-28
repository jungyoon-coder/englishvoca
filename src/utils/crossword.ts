export type CrosswordCell = {
  r: number
  c: number
  isBlock: boolean
  number?: number
}

export type CrosswordPlacement = {
  word: string
  r: number
  c: number
  dir: 'across' | 'down'
  number: number
}

export type CrosswordPuzzle = {
  size: number
  grid: Array<Array<string | null>> // null = block, '' = empty letter cell (user fills), 'A'..'Z' internal answer
  cells: CrosswordCell[]
  across: CrosswordPlacement[]
  down: CrosswordPlacement[]
  usedWords: string[]
  skippedWords: string[]
}

type Dir = 'across' | 'down'

function makeGrid(size: number) {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => null as string | null))
}

function inBounds(size: number, r: number, c: number) {
  return r >= 0 && c >= 0 && r < size && c < size
}

function getStep(dir: Dir) {
  return dir === 'across' ? { dr: 0, dc: 1 } : { dr: 1, dc: 0 }
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function shuffle<T>(arr: T[], rnd: () => number) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function canPlace(
  grid: Array<Array<string | null>>,
  word: string,
  r0: number,
  c0: number,
  dir: Dir,
) {
  const size = grid.length
  const { dr, dc } = getStep(dir)

  // Must fit.
  const endR = r0 + dr * (word.length - 1)
  const endC = c0 + dc * (word.length - 1)
  if (!inBounds(size, r0, c0) || !inBounds(size, endR, endC)) return false

  // Avoid touching adjacent letters before/after.
  const beforeR = r0 - dr
  const beforeC = c0 - dc
  if (inBounds(size, beforeR, beforeC) && grid[beforeR][beforeC] !== null) return false
  const afterR = endR + dr
  const afterC = endC + dc
  if (inBounds(size, afterR, afterC) && grid[afterR][afterC] !== null) return false

  let hasIntersection = false
  for (let i = 0; i < word.length; i++) {
    const r = r0 + dr * i
    const c = c0 + dc * i
    const ch = word[i]
    const cur = grid[r][c]
    if (cur !== null && cur !== ch) return false
    if (cur === ch) hasIntersection = true

    // Prevent side-touching letters for clean crossword look.
    if (dir === 'across') {
      const up = r - 1
      const down = r + 1
      if (inBounds(size, up, c) && grid[up][c] !== null && grid[r][c] === null) return false
      if (inBounds(size, down, c) && grid[down][c] !== null && grid[r][c] === null) return false
    } else {
      const left = c - 1
      const right = c + 1
      if (inBounds(size, r, left) && grid[r][left] !== null && grid[r][c] === null) return false
      if (inBounds(size, r, right) && grid[r][right] !== null && grid[r][c] === null) return false
    }
  }

  return hasIntersection
}

function canPlaceStandalone(
  grid: Array<Array<string | null>>,
  word: string,
  r0: number,
  c0: number,
  dir: Dir,
) {
  const size = grid.length
  const { dr, dc } = getStep(dir)

  const endR = r0 + dr * (word.length - 1)
  const endC = c0 + dc * (word.length - 1)
  if (!inBounds(size, r0, c0) || !inBounds(size, endR, endC)) return false

  // Require all target cells empty (no overwrite) for standalone placement.
  for (let i = 0; i < word.length; i++) {
    const r = r0 + dr * i
    const c = c0 + dc * i
    if (grid[r][c] !== null) return false
  }

  return true
}

function canPlaceVeryLoose(
  grid: Array<Array<string | null>>,
  word: string,
  r0: number,
  c0: number,
  dir: Dir,
) {
  const size = grid.length
  const { dr, dc } = getStep(dir)

  const endR = r0 + dr * (word.length - 1)
  const endC = c0 + dc * (word.length - 1)
  if (!inBounds(size, r0, c0) || !inBounds(size, endR, endC)) return false

  for (let i = 0; i < word.length; i++) {
    const r = r0 + dr * i
    const c = c0 + dc * i
    const cur = grid[r][c]
    if (cur !== null && cur !== word[i]) return false
  }

  return true
}

function place(
  grid: Array<Array<string | null>>,
  word: string,
  r0: number,
  c0: number,
  dir: Dir,
) {
  const { dr, dc } = getStep(dir)
  for (let i = 0; i < word.length; i++) {
    const r = r0 + dr * i
    const c = c0 + dc * i
    grid[r][c] = word[i]
  }
}

function countIntersections(grid: Array<Array<string | null>>, word: string, r0: number, c0: number, dir: Dir) {
  const { dr, dc } = getStep(dir)
  let score = 0
  for (let i = 0; i < word.length; i++) {
    const r = r0 + dr * i
    const c = c0 + dc * i
    if (grid[r][c] === word[i]) score++
  }
  return score
}

function trimToBoundingBox(grid: Array<Array<string | null>>) {
  const size = grid.length
  let rMin = size,
    rMax = -1,
    cMin = size,
    cMax = -1
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] !== null) {
        rMin = Math.min(rMin, r)
        rMax = Math.max(rMax, r)
        cMin = Math.min(cMin, c)
        cMax = Math.max(cMax, c)
      }
    }
  }
  if (rMax < 0) return grid

  const newGrid = makeGrid(size)
  const boxH = rMax - rMin + 1
  const boxW = cMax - cMin + 1
  const rOff = Math.floor((size - boxH) / 2)
  const cOff = Math.floor((size - boxW) / 2)

  for (let r = rMin; r <= rMax; r++) {
    for (let c = cMin; c <= cMax; c++) {
      newGrid[rOff + (r - rMin)][cOff + (c - cMin)] = grid[r][c]
    }
  }
  return newGrid
}

function computeNumbers(grid: Array<Array<string | null>>) {
  const size = grid.length
  const numbers: Array<Array<number | undefined>> = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => undefined),
  )
  let next = 1

  const isLetter = (r: number, c: number) => inBounds(size, r, c) && grid[r][c] !== null
  const isStartAcross = (r: number, c: number) =>
    isLetter(r, c) && !isLetter(r, c - 1) && isLetter(r, c + 1)
  const isStartDown = (r: number, c: number) =>
    isLetter(r, c) && !isLetter(r - 1, c) && isLetter(r + 1, c)

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!isLetter(r, c)) continue
      if (isStartAcross(r, c) || isStartDown(r, c)) {
        numbers[r][c] = next++
      }
    }
  }

  return numbers
}

function scanPlacements(
  grid: Array<Array<string | null>>,
  numbers: Array<Array<number | undefined>>,
) {
  const size = grid.length
  const across: CrosswordPlacement[] = []
  const down: CrosswordPlacement[] = []

  const isLetter = (r: number, c: number) => inBounds(size, r, c) && grid[r][c] !== null

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const num = numbers[r][c]
      if (!num) continue

      // across
      if (isLetter(r, c) && !isLetter(r, c - 1) && isLetter(r, c + 1)) {
        let w = ''
        let cc = c
        while (isLetter(r, cc)) {
          w += grid[r][cc]
          cc++
        }
        across.push({ word: w, r, c, dir: 'across', number: num })
      }

      // down
      if (isLetter(r, c) && !isLetter(r - 1, c) && isLetter(r + 1, c)) {
        let w = ''
        let rr = r
        while (isLetter(rr, c)) {
          w += grid[rr][c]
          rr++
        }
        down.push({ word: w, r, c, dir: 'down', number: num })
      }
    }
  }

  return { across, down }
}

function buildPuzzle(cleaned: string[], size: number, seed: number) {
  const rnd = mulberry32(seed)
  const grid = makeGrid(size)
  const usedWords: string[] = []
  const skippedWords: string[] = []

  if (cleaned.length === 0) {
    return { grid, usedWords, skippedWords }
  }

  const words = shuffle(cleaned, rnd)

  // Place the first word centered horizontally.
  const first = words[0]
  const r0 = Math.floor(size / 2)
  const c0 = Math.floor((size - first.length) / 2)
  place(grid, first, r0, c0, 'across')
  usedWords.push(first)

  const dirs: Dir[] = rnd() < 0.5 ? ['across', 'down'] : ['down', 'across']

  for (const word of words.slice(1)) {
    let placedOk = false

    // Prefer intersect placement with best intersection count.
    let best:
      | { r: number; c: number; dir: Dir; score: number }
      | null = null

    for (let wi = 0; wi < word.length; wi++) {
      const ch = word[wi]
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (grid[r][c] !== ch) continue

          // across candidate
          const acrossStartC = c - wi
          if (canPlace(grid, word, r, acrossStartC, 'across')) {
            const score = countIntersections(grid, word, r, acrossStartC, 'across')
            if (!best || score > best.score) best = { r, c: acrossStartC, dir: 'across', score }
          }

          // down candidate
          const downStartR = r - wi
          if (canPlace(grid, word, downStartR, c, 'down')) {
            const score = countIntersections(grid, word, downStartR, c, 'down')
            if (!best || score > best.score) best = { r: downStartR, c, dir: 'down', score }
          }
        }
      }
    }

    if (best) {
      place(grid, word, best.r, best.c, best.dir)
      usedWords.push(word)
      placedOk = true
    }

    if (!placedOk) {
      // Fallback: standalone placement (keeps words separate but still in grid).
      for (let pass = 0; pass < 2 && !placedOk; pass++) {
        const dir = dirs[pass]
        for (let r = 0; r < size && !placedOk; r++) {
          for (let c = 0; c < size && !placedOk; c++) {
            if (canPlaceStandalone(grid, word, r, c, dir)) {
              place(grid, word, r, c, dir)
              usedWords.push(word)
              placedOk = true
              break
            }
          }
        }
      }
    }

    if (!placedOk) {
      // Last resort: very loose placement (allows overlap if letters match).
      for (let pass = 0; pass < 2 && !placedOk; pass++) {
        const dir = dirs[pass]
        for (let r = 0; r < size && !placedOk; r++) {
          for (let c = 0; c < size && !placedOk; c++) {
            if (canPlaceVeryLoose(grid, word, r, c, dir)) {
              place(grid, word, r, c, dir)
              usedWords.push(word)
              placedOk = true
              break
            }
          }
        }
      }
    }

    if (!placedOk) skippedWords.push(word)
  }

  return { grid, usedWords, skippedWords }
}

export function generateCrossword(words: string[], size = 13): CrosswordPuzzle {
  const cleaned = words
    .map((w) => w.trim().toUpperCase().replace(/[^A-Z]/g, ''))
    .filter((w) => w.length >= 2 && w.length <= size)
    .sort((a, b) => b.length - a.length)

  if (cleaned.length === 0) {
    return {
      size,
      grid: makeGrid(size),
      cells: [],
      across: [],
      down: [],
      usedWords: [],
      skippedWords: [],
    }
  }

  // Try multiple seeds and sizes to include ALL words, maximizing crossword-like intersections.
  const targetCount = cleaned.length
  let best:
    | { size: number; grid: Array<Array<string | null>>; usedWords: string[]; skippedWords: string[] }
    | null = null

  const maxSize = Math.max(size, Math.min(19, Math.max(size, cleaned[0]?.length ?? size) + 4))
  let seedBase = 12345
  for (let s = size; s <= maxSize; s += 2) {
    for (let attempt = 0; attempt < 40; attempt++) {
      const seed = seedBase + s * 1000 + attempt
      const res = buildPuzzle(cleaned, s, seed)
      const placedCount = res.usedWords.length

      if (!best || placedCount > best.usedWords.length) {
        best = { size: s, grid: res.grid, usedWords: res.usedWords, skippedWords: res.skippedWords }
      }

      if (placedCount === targetCount) {
        best = { size: s, grid: res.grid, usedWords: res.usedWords, skippedWords: res.skippedWords }
        break
      }
    }
    if (best?.usedWords.length === targetCount) break
    seedBase += 777
  }

  const chosen = best ?? { size, grid: makeGrid(size), usedWords: [], skippedWords: cleaned }
  const trimmed = trimToBoundingBox(chosen.grid)
  const numbers = computeNumbers(trimmed)
  const { across, down } = scanPlacements(trimmed, numbers)

  const cells: CrosswordCell[] = []
  for (let r = 0; r < trimmed.length; r++) {
    for (let c = 0; c < trimmed.length; c++) {
      const isBlock = trimmed[r][c] === null
      const number = numbers[r][c]
      cells.push({ r, c, isBlock, number })
    }
  }

  // Expose grid as empty for user-facing cells (don't reveal answers).
  const userGrid = trimmed.map((row) => row.map((v) => (v === null ? null : '')))

  return {
    size: trimmed.length,
    grid: userGrid,
    cells,
    across,
    down,
    usedWords: chosen.usedWords,
    skippedWords: chosen.skippedWords,
  }
}

