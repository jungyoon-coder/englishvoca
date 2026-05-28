import { useId, useMemo, useState } from 'react'
import { MAX_WORDS, MIN_WORDS } from '../utils/words'
import { WordPill } from './WordPill'

type Props = {
  words: string[]
  onAddWord: (word: string) => void
  onRemoveWord: (word: string) => void
  onClearAll: () => void
  onGenerate: () => void
}

function EmptyState() {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-slate-200 bg-white/60 px-4 py-10 text-center">
      <div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-slate-50 text-slate-400 ring-1 ring-slate-200">
        <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
          <path
            fill="currentColor"
            d="M7 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9.5a1 1 0 0 0-.293-.707l-4.5-4.5A1 1 0 0 0 13.5 4H7Zm7 2.414L17.586 9H14a1 1 0 0 1-1-1V5.414Z"
          />
        </svg>
      </div>
      <p className="text-sm font-semibold text-slate-700">
        단어를 입력하고 추가 버튼을 누르세요.
      </p>
      <p className="mt-1 text-xs text-slate-500">최소 2개, 최대 15개 입력 가능합니다.</p>
    </div>
  )
}

export function WordInputCard({
  words,
  onAddWord,
  onRemoveWord,
  onClearAll,
  onGenerate,
}: Props) {
  const inputId = useId()
  const [value, setValue] = useState('')

  const canAddMore = words.length < MAX_WORDS
  const canGenerate = words.length >= MIN_WORDS

  const headerLabel = useMemo(() => {
    return `단어 입력 (${words.length}/${MAX_WORDS}개)`
  }, [words.length])

  const handleAdd = () => {
    if (!canAddMore) return
    onAddWord(value)
    setValue('')
  }

  return (
    <section className="rounded-3xl bg-white shadow-[0_12px_30px_-20px_rgba(15,23,42,0.45)] ring-1 ring-slate-200">
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
        <div>
          <h2 className="text-sm font-extrabold text-slate-900">{headerLabel}</h2>
          <p className="mt-1 text-xs text-slate-500">최대 15개 단어까지 추가할 수 있어요.</p>
        </div>

        {words.length > 0 ? (
          <button
            type="button"
            onClick={onClearAll}
            className="rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-800 focus:outline-none focus:ring-4 focus:ring-violet-100"
          >
            전체 삭제
          </button>
        ) : null}
      </div>

      <div className="px-5 py-5 sm:px-6">
        <label htmlFor={inputId} className="sr-only">
          영어 단어 입력
        </label>

        <div className="flex gap-2">
          <input
            id={inputId}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAdd()
              }
            }}
            placeholder="영어 단어를 입력하세요 (예: apple)"
            className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-4 focus:ring-violet-100 disabled:bg-slate-50"
            disabled={!canAddMore}
            inputMode="text"
            autoComplete="off"
          />

          <button
            type="button"
            onClick={handleAdd}
            disabled={!canAddMore}
            className="h-11 shrink-0 rounded-2xl bg-violet-500 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-violet-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-violet-300 focus:outline-none focus:ring-4 focus:ring-violet-200"
          >
            추가
          </button>
        </div>

        <div className="mt-4">
          {words.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="flex flex-wrap gap-2">
              {words.map((w) => (
                <WordPill key={w} word={w} onRemove={() => onRemoveWord(w)} />
              ))}
            </div>
          )}
        </div>

        <div className="mt-5">
          <button
            type="button"
            onClick={onGenerate}
            disabled={!canGenerate}
            className="group relative w-full overflow-hidden rounded-2xl bg-violet-500 px-5 py-4 text-sm font-extrabold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-violet-600 hover:shadow-lg active:translate-y-0 disabled:cursor-not-allowed disabled:bg-violet-300 disabled:shadow-none"
          >
            <span className="relative z-10">
              학습지 생성하기 ({words.length}개 단어)
            </span>
            <span className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
              <span className="absolute -left-10 top-0 h-full w-24 rotate-12 bg-white/15 blur-xl" />
            </span>
          </button>
          <p className="mt-2 text-center text-xs text-slate-500">
            단어 2개 이상 입력해야 활성화됩니다.
          </p>
        </div>
      </div>
    </section>
  )
}

