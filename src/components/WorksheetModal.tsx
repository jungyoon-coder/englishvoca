import { useEffect, useMemo, type ReactNode } from 'react'
import { generateCrossword } from '../utils/crossword'
import { generateWordSearch } from '../utils/wordSearch'
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
  orientation,
  children,
}: {
  pageLabel: string
  orientation: 'portrait' | 'landscape'
  children: ReactNode
}) {
  const pageClass =
    orientation === 'portrait' ? 'a4-page--portrait' : 'a4-page--landscape'
  const aspect =
    orientation === 'portrait' ? 'aspect-[210/297]' : 'aspect-[297/210]'

  return (
    <section
      className={[
        'a4-page',
        pageClass,
        'mx-auto w-full',
        orientation === 'portrait' ? 'max-w-[794px]' : 'max-w-[1123px]',
      ].join(' ')}
    >
      <div
        className={[
          'rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6',
          'print:rounded-none print:shadow-none print:ring-0',
          aspect,
        ].join(' ')}
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <p className="text-xs font-bold text-slate-500">{pageLabel}</p>
          <p className="text-right text-xs font-bold text-slate-500">영어 단어 학습지</p>
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
            <div className="mb-2 flex items-center gap-3">
              <span className="text-sm font-bold text-slate-600">{idx + 1}.</span>
              <span className="grid h-8 w-8 place-items-center rounded bg-emerald-100 text-sm font-black text-emerald-700">
                {w[0]?.toUpperCase()}
              </span>
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

function WordSearchSheet({ words }: { words: string[] }) {
  const puzzle = useMemo(() => generateWordSearch(words, 12), [words])
  return (
    <div>
      <SectionTitle
        title="단어 찾기"
        subtitle="표 안에서 단어를 찾아 동그라미로 표시해보세요."
      />

      <div className="space-y-5">
        <div className="overflow-hidden rounded-lg ring-1 ring-slate-200">
          <div className="grid grid-cols-12 bg-white">
            {puzzle.grid.flatMap((row, r) =>
              row.map((ch, c) => (
                <div
                  key={`${r}-${c}`}
                  className="grid aspect-square place-items-center border border-slate-100 text-sm font-extrabold text-slate-800"
                >
                  {ch}
                </div>
              )),
            )}
          </div>
        </div>

        <div className="rounded-lg bg-slate-50 p-4 ring-1 ring-slate-200">
          <p className="text-xs font-extrabold text-slate-700">찾을 단어</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {puzzle.placed.map((w) => (
              <span
                key={w}
                className="rounded-lg bg-white px-3 py-2 text-xs font-bold text-slate-700 ring-1 ring-slate-200"
              >
                {w}
              </span>
            ))}
          </div>
          {puzzle.skipped.length > 0 ? (
            <p className="mt-3 text-[11px] text-slate-500">
              일부 단어는 길이 또는 배치 조건으로 제외되었습니다: {puzzle.skipped.join(', ')}
            </p>
          ) : null}
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

      <div className="mt-6 flex justify-center">
        <div className="rounded-lg border-2 border-slate-800 bg-slate-100 p-4 sm:p-6">
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

      <div className="mt-8 grid gap-8 sm:grid-cols-2">
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

      <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm font-bold text-slate-700">Word Bank</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {wordBank.map((w) => (
            <span
              key={w}
              className="rounded-lg bg-white px-3 py-1 text-sm text-slate-800 ring-1 ring-slate-300"
            >
              {w}
            </span>
          ))}
        </div>
        {puzzle.skippedWords.length > 0 ? (
          <p className="mt-3 text-[11px] text-slate-500">
            십자말에 들어가지 못한 단어: {puzzle.skippedWords.join(', ')}
          </p>
        ) : null}
      </div>
    </div>
  )
}

export function WorksheetModal({ title, words, canGenerate, onClose }: Props) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm print:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="absolute inset-x-0 bottom-0 top-3 mx-auto w-full max-w-6xl px-2 pb-3 sm:top-8 sm:px-4 sm:pb-6 print:static print:inset-auto print:max-w-none print:px-0 print:pb-0">
        <div className="flex h-full flex-col overflow-hidden rounded-xl bg-[#f7f8fb] shadow-2xl ring-1 ring-slate-200 print:overflow-visible print:rounded-none print:bg-white print:shadow-none print:ring-0">
          <div className="flex flex-col gap-3 border-b border-slate-200/70 bg-white px-4 py-4 sm:flex-row sm:items-start sm:justify-between sm:px-6 print:hidden">
            <div>
              <p className="text-xs font-bold text-slate-500">미리보기</p>
              <h2 className="mt-1 text-sm font-extrabold text-slate-900">{title}</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                disabled={!canGenerate}
                className="flex-1 rounded-lg bg-slate-900 px-3 py-2 text-xs font-extrabold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-4 focus:ring-slate-200 sm:flex-none"
              >
                인쇄 / PDF 저장
              </button>
              <button
                type="button"
                onClick={onClose}
                className="grid h-10 w-10 place-items-center rounded-lg bg-white text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                aria-label="닫기"
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

          <div className="flex-1 overflow-auto bg-[#f7f8fb] px-3 py-4 sm:px-6 sm:py-5 print:overflow-visible print:bg-white print:px-0 print:py-0">
            {!canGenerate ? (
              <div className="grid place-items-center rounded-xl bg-white p-8 text-center ring-1 ring-slate-200">
                <p className="text-sm font-extrabold text-slate-900">
                  단어를 최소 {MIN_WORDS}개 이상 입력해주세요.
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  입력 카드에서 단어를 추가한 뒤 다시 미리보기를 열 수 있습니다.
                </p>
              </div>
            ) : (
              <div className="mx-auto flex w-full max-w-[860px] flex-col gap-6 py-2 print:max-w-none print:gap-0 print:py-0">
                <PageFrame pageLabel="1/2" orientation="portrait">
                  <TraceSheet words={words} />
                </PageFrame>
                <PageFrame pageLabel="2/2" orientation="landscape">
                  <div className="grid gap-6 lg:grid-cols-2">
                    <div className="min-w-0">
                      <CrosswordSheet words={words} />
                    </div>
                    <div className="min-w-0">
                      <WordSearchSheet words={words} />
                    </div>
                  </div>
                </PageFrame>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
