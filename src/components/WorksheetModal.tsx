import { useEffect, useMemo, type ReactNode } from 'react'
import { generateCrossword } from '../utils/crossword'
import { generateWordSearch, type WordSearchPuzzle } from '../utils/wordSearch'
import { MIN_WORDS } from '../utils/words'

type Props = {
  title: string
  words: string[]
  canGenerate: boolean
  onClose: () => void
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <h3 className="text-base font-extrabold text-slate-900">{title}</h3>
      {subtitle ? <p className="mt-1 text-xs text-slate-500">{subtitle}</p> : null}
    </div>
  )
}

function PageFrame({
  pageLabel,
  pageTitle,
  children,
}: {
  pageLabel: string
  pageTitle: string
  children: ReactNode
}) {
  return (
    <section className="a4-page mx-auto w-full max-w-[794px]">
      <div className="a4-sheet aspect-[210/297] rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
          <p className="text-xs font-bold text-slate-500">{pageLabel}</p>
          <p className="text-right text-xs font-bold text-slate-500">{pageTitle}</p>
        </div>
        {children}
      </div>
    </section>
  )
}

function TraceSheet({ words }: { words: string[] }) {
  const items = useMemo(() => words.slice(0, 8), [words])

  return (
    <div>
      <div className="mb-5 text-center">
        <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
          Word Tracing
        </h2>
        <p className="mt-1 text-sm text-slate-600">Read, trace, and write each word.</p>
      </div>

      <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
        {items.map((w, idx) => (
          <div key={w}>
            <div className="mb-2 flex items-baseline gap-2">
              <span className="text-sm font-bold text-slate-600">{idx + 1}.</span>
              <span className="text-2xl font-black tracking-tight text-slate-900">
                {w}
              </span>
            </div>
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute left-0 top-[7px] select-none text-3xl font-black tracking-wide text-slate-300/70">
                  {w}
                </div>
                <div className="h-12">
                  <div className="h-0 border-t-2 border-slate-500/50" />
                  <div className="mt-[18px] h-0 border-t-2 border-dashed border-rose-400/70" />
                  <div className="mt-[18px] h-0 border-t-2 border-slate-500/50" />
                </div>
              </div>
              <div className="h-12">
                <div className="h-0 border-t-2 border-slate-500/50" />
                <div className="mt-[18px] h-0 border-t-2 border-dashed border-rose-400/70" />
                <div className="mt-[18px] h-0 border-t-2 border-slate-500/50" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function WordSearchGrid({
  puzzle,
  answer = false,
}: {
  puzzle: WordSearchPuzzle
  answer?: boolean
}) {
  const answerCells = useMemo(() => {
    const cells = new Set<string>()
    for (const placement of puzzle.placements) {
      for (const cell of placement.cells) cells.add(`${cell.r}-${cell.c}`)
    }
    return cells
  }, [puzzle.placements])

  return (
    <div className="mx-auto w-fit overflow-hidden rounded-md ring-1 ring-slate-300">
      <div
        className="grid bg-white"
        style={{
          gridTemplateColumns: `repeat(${puzzle.size}, 24px)`,
          gridAutoRows: '24px',
        }}
      >
        {puzzle.grid.flatMap((row, r) =>
          row.map((ch, c) => {
            const isAnswer = answer && answerCells.has(`${r}-${c}`)
            return (
              <div
                key={`${r}-${c}`}
                className={[
                  'grid place-items-center border text-[12px] font-extrabold leading-none',
                  isAnswer
                    ? 'border-blue-500 bg-blue-100 text-blue-900'
                    : 'border-slate-100 text-slate-800',
                ].join(' ')}
              >
                {ch}
              </div>
            )
          }),
        )}
      </div>
    </div>
  )
}

function WordSearchWordList({ puzzle }: { puzzle: WordSearchPuzzle }) {
  return (
    <div className="rounded-lg bg-slate-50 p-4 ring-1 ring-slate-200">
      <p className="text-xs font-extrabold text-slate-700">Words</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {puzzle.placed.map((w) => (
          <span
            key={w}
            className="rounded-md bg-white px-3 py-1.5 text-xs font-bold text-slate-700 ring-1 ring-slate-200"
          >
            {w}
          </span>
        ))}
      </div>
    </div>
  )
}

function WordSearchSheet({ puzzle }: { puzzle: WordSearchPuzzle }) {
  return (
    <div>
      <SectionTitle
        title="Word Search"
        subtitle="Find each word in the grid and circle it."
      />
      <div className="grid gap-5">
        <WordSearchGrid puzzle={puzzle} />
        <WordSearchWordList puzzle={puzzle} />
      </div>
    </div>
  )
}

function WordSearchAnswerSheet({ puzzle }: { puzzle: WordSearchPuzzle }) {
  return (
    <div>
      <SectionTitle
        title="Word Search Answer"
        subtitle="Highlighted cells show every hidden word for quick grading."
      />
      <div className="grid gap-5">
        <WordSearchGrid puzzle={puzzle} answer />
        <div className="rounded-lg bg-blue-50 p-4 ring-1 ring-blue-100">
          <p className="text-xs font-extrabold text-blue-800">Answer key</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {puzzle.placements.map((placement) => (
              <div
                key={placement.word}
                className="flex items-center justify-between gap-3 rounded-md bg-white px-3 py-2 text-xs ring-1 ring-blue-100"
              >
                <span className="font-bold text-slate-800">{placement.word}</span>
                <span className="text-slate-500">
                  R{placement.start.r + 1}C{placement.start.c + 1} to R
                  {placement.end.r + 1}C{placement.end.c + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function CrosswordSheet({ words }: { words: string[] }) {
  const puzzle = useMemo(() => generateCrossword(words, 13), [words])
  const wordBank = useMemo(
    () =>
      words
        .map((w) => w.trim())
        .filter(Boolean)
        .map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()),
    [words],
  )

  return (
    <div>
      <div className="mb-2 text-center">
        <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
          Crossword Puzzle
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Fill in the crossword using the word bank below.
        </p>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-slate-200 pt-3 text-sm text-slate-600">
        <div className="flex min-w-56 items-center gap-2">
          <span className="font-semibold">Name:</span>
          <span className="min-w-32 flex-1 border-b border-slate-300">&nbsp;</span>
        </div>
        <div className="flex min-w-56 items-center gap-2">
          <span className="font-semibold">Date:</span>
          <span className="min-w-32 flex-1 border-b border-slate-300">&nbsp;</span>
        </div>
      </div>
      <div className="mt-5 flex justify-center">
        <div className="rounded-lg border-2 border-slate-800 bg-slate-100 p-4">
          <div
            className="grid bg-transparent"
            style={{
              gridTemplateColumns: `repeat(${puzzle.size}, minmax(0, 24px))`,
              gridAutoRows: '24px',
            }}
          >
            {puzzle.cells.map((cell) => {
              if (cell.isBlock) {
                return <div key={`${cell.r}-${cell.c}`} className="bg-transparent" />
              }
              return (
                <div
                  key={`${cell.r}-${cell.c}`}
                  className="relative border border-slate-700 bg-white"
                >
                  {cell.number ? (
                    <span className="absolute left-[2px] top-[1px] text-[9px] font-bold leading-none text-slate-700">
                      {cell.number}
                    </span>
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <div className="mb-2 text-sm font-extrabold text-slate-900">ACROSS</div>
          <div className="h-0 border-t-2 border-slate-900/80" />
          <div className="mt-3 space-y-3">
            {puzzle.across.slice(0, 8).map((p) => (
              <div key={`a-${p.number}`} className="flex items-center gap-2 text-sm">
                <span className="w-6 font-bold text-slate-800">{p.number}.</span>
                <span className="flex-1 border-b border-slate-300">&nbsp;</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-2 text-sm font-extrabold text-slate-900">DOWN</div>
          <div className="h-0 border-t-2 border-slate-900/80" />
          <div className="mt-3 space-y-3">
            {puzzle.down.slice(0, 8).map((p) => (
              <div key={`d-${p.number}`} className="flex items-center gap-2 text-sm">
                <span className="w-6 font-bold text-slate-800">{p.number}.</span>
                <span className="flex-1 border-b border-slate-300">&nbsp;</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm font-bold text-slate-700">Word Bank</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {wordBank.map((w) => (
            <span
              key={w}
              className="rounded-md bg-white px-3 py-1 text-sm text-slate-800 ring-1 ring-slate-300"
            >
              {w}
            </span>
          ))}
        </div>
        {puzzle.skippedWords.length > 0 ? (
          <p className="mt-3 text-[11px] text-slate-500">
            Words not placed in the crossword: {puzzle.skippedWords.join(', ')}
          </p>
        ) : null}
      </div>
    </div>
  )
}

export function WorksheetModal({ title, words, canGenerate, onClose }: Props) {
  const wordSearchPuzzle = useMemo(() => generateWordSearch(words, 12), [words])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div className="worksheet-modal fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm print:hidden"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="worksheet-modal-panel absolute inset-x-0 bottom-0 top-3 mx-auto w-full max-w-6xl px-2 pb-3 sm:top-8 sm:px-4 sm:pb-6">
        <div className="worksheet-modal-shell flex h-full flex-col overflow-hidden rounded-lg bg-[#f7f8fb] shadow-2xl ring-1 ring-slate-200">
          <div className="flex flex-col gap-3 border-b border-slate-200/70 bg-white px-4 py-4 sm:flex-row sm:items-start sm:justify-between sm:px-6 print:hidden">
            <div>
              <p className="text-xs font-bold text-slate-500">Preview</p>
              <h2 className="mt-1 text-sm font-extrabold text-slate-900">{title}</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                disabled={!canGenerate}
                className="flex-1 rounded-md bg-slate-900 px-3 py-2 text-xs font-extrabold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-4 focus:ring-slate-200 sm:flex-none"
              >
                Print / Save PDF
              </button>
              <button
                type="button"
                onClick={onClose}
                className="grid h-10 w-10 place-items-center rounded-md bg-white text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-blue-100"
                aria-label="Close"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M18.3 5.71a1 1 0 0 1 0 1.41L13.41 12l4.89 4.88a1 1 0 1 1-1.41 1.42L12 13.41 7.12 18.3a1 1 0 1 1-1.42-1.41L10.59 12 5.7 7.12a1 1 0 1 1 1.42-1.41L12 10.59l4.88-4.88a1 1 0 0 1 1.42 0Z"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="worksheet-preview flex-1 overflow-auto bg-[#f7f8fb] px-3 py-4 sm:px-6 sm:py-5">
            {!canGenerate ? (
              <div className="grid place-items-center rounded-lg bg-white p-8 text-center ring-1 ring-slate-200">
                <p className="text-sm font-extrabold text-slate-900">
                  Add at least {MIN_WORDS} words to generate a worksheet.
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Add words in the input card, then open the preview again.
                </p>
              </div>
            ) : (
              <div className="worksheet-pages mx-auto flex w-full max-w-[860px] flex-col gap-6 py-2">
                <PageFrame pageLabel="1/4" pageTitle="English Worksheet">
                  <TraceSheet words={words} />
                </PageFrame>
                <PageFrame pageLabel="2/4" pageTitle="Crossword Puzzle">
                  <CrosswordSheet words={words} />
                </PageFrame>
                <PageFrame pageLabel="3/4" pageTitle="Word Search">
                  <WordSearchSheet puzzle={wordSearchPuzzle} />
                </PageFrame>
                <PageFrame pageLabel="4/4" pageTitle="Word Search Answer">
                  <WordSearchAnswerSheet puzzle={wordSearchPuzzle} />
                </PageFrame>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
