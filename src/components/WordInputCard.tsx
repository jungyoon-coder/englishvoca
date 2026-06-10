import { useId, useMemo, useState } from 'react'
import { MAX_WORDS, MIN_WORDS, parseWordList } from '../utils/words'
import { WordPill } from './WordPill'

type Props = {
  words: string[]
  onAddWord: (word: string) => void
  onAddWords: (words: string) => void
  onRemoveWord: (word: string) => void
  onClearAll: () => void
  onGenerate: () => void
}

export function WordInputCard({
  words,
  onAddWord,
  onAddWords,
  onRemoveWord,
  onClearAll,
  onGenerate,
}: Props) {
  const inputId = useId()
  const [value, setValue] = useState('')

  const canAddMore = words.length < MAX_WORDS
  const canGenerate = words.length >= MIN_WORDS
  const parsedWords = useMemo(() => parseWordList(value), [value])

  const helperText = useMemo(() => {
    if (!canAddMore) return `최대 ${MAX_WORDS}개까지 추가했습니다.`
    if (!value.trim()) return '쉼표, 공백, 줄바꿈으로 여러 단어를 붙여넣을 수 있습니다.'
    if (parsedWords.length === 0) return '영어 알파벳이 포함된 단어를 입력해주세요.'
    if (parsedWords.some((word) => words.includes(word))) return '이미 추가된 단어는 자동으로 건너뜁니다.'
    return `Enter를 누르면 ${parsedWords.length}개 단어가 추가됩니다.`
  }, [canAddMore, parsedWords, value, words])

  const handleAdd = () => {
    if (!canAddMore || parsedWords.length === 0) return

    if (parsedWords.length === 1) {
      onAddWord(parsedWords[0])
    } else {
      onAddWords(value)
    }
    setValue('')
  }

  return (
    <section className="rounded-3xl bg-white p-5 shadow-[0_24px_80px_-56px_rgba(15,23,42,0.55)] ring-1 ring-slate-200/70 sm:p-6">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_260px]">
        <div className="min-w-0">
          <div className="mb-3 flex items-center justify-between gap-3">
            <label htmlFor={inputId} className="text-sm font-semibold text-slate-950">
              단어 입력
            </label>
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-100">
              {words.length}/{MAX_WORDS}
            </span>
          </div>

          <textarea
            id={inputId}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key !== 'Enter' || e.shiftKey) return
              e.preventDefault()
              handleAdd()
            }}
            placeholder={'apple, banana, cat\n엑셀이나 문서의 단어 목록을 그대로 붙여넣으세요'}
            className="min-h-44 w-full resize-y rounded-2xl border-0 bg-slate-50 px-4 py-4 text-base leading-7 text-slate-950 outline-none ring-1 ring-slate-200 transition placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
            disabled={!canAddMore}
            inputMode="text"
            autoComplete="off"
          />

          <div className="mt-2 flex flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>{helperText}</p>
            <p>Shift+Enter로 줄바꿈</p>
          </div>
        </div>

        <aside className="rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">
            Worksheet
          </p>
          <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-blue-100/70">
            <p className="text-sm font-medium text-slate-500">선택한 단어</p>
            <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">
              {words.length}개
            </p>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              최소 {MIN_WORDS}개 이상 입력하면 바로 생성할 수 있습니다.
            </p>
          </div>
          <button
            type="button"
            onClick={onGenerate}
            disabled={!canGenerate}
            className="mt-4 w-full rounded-2xl bg-blue-600 px-4 py-3.5 text-sm font-semibold text-white shadow-[0_14px_30px_-18px_rgba(37,99,235,0.9)] transition hover:bg-blue-500 active:translate-y-px disabled:cursor-not-allowed disabled:bg-blue-200 disabled:text-blue-500 disabled:shadow-none focus:outline-none focus:ring-4 focus:ring-blue-200"
          >
            학습지 생성하기
          </button>
        </aside>
      </div>

      <div className="mt-5 min-h-12">
        {words.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-4 text-sm text-slate-400">
            추가된 단어가 여기에 표시됩니다.
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {words.map((w) => (
              <WordPill key={w} word={w} onRemove={() => onRemoveWord(w)} />
            ))}
          </div>
        )}
      </div>

      {words.length > 0 ? (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onClearAll}
            className="rounded-lg px-2 py-1 text-xs font-medium text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
          >
            전체 삭제
          </button>
        </div>
      ) : null}
    </section>
  )
}
