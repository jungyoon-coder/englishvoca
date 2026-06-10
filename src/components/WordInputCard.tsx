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
    <section className="rounded-2xl bg-white p-5 shadow-[0_18px_60px_-42px_rgba(15,23,42,0.45)] ring-1 ring-slate-200/80 sm:p-6">
      <div className="flex flex-col gap-5 lg:grid lg:grid-cols-[1fr_220px] lg:items-stretch">
        <div className="min-w-0">
          <div className="mb-3 flex items-center justify-between gap-3">
            <label htmlFor={inputId} className="text-sm font-semibold text-slate-900">
              단어 입력
            </label>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
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
            placeholder={'apple, banana, cat\n또는 엑셀/문서의 단어 목록을 그대로 붙여넣으세요'}
            className="min-h-40 w-full resize-y rounded-xl border-0 bg-slate-50 px-4 py-4 text-base leading-7 text-slate-900 outline-none ring-1 ring-slate-200 transition placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 sm:min-h-44"
            disabled={!canAddMore}
            inputMode="text"
            autoComplete="off"
          />

          <div className="mt-2 flex flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>{helperText}</p>
            <p>Shift+Enter로 줄바꿈</p>
          </div>
        </div>

        <aside className="flex flex-col justify-between rounded-xl bg-slate-950 p-4 text-white shadow-[0_18px_50px_-32px_rgba(15,23,42,0.7)]">
          <div>
            <p className="text-xs font-medium text-slate-400">다음 단계</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight">{words.length}개</p>
            <p className="mt-1 text-xs leading-5 text-slate-400">
              최소 {MIN_WORDS}개 이상이면 학습지를 만들 수 있습니다.
            </p>
          </div>
          <button
            type="button"
            onClick={onGenerate}
            disabled={!canGenerate}
            className="mt-5 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500 active:translate-y-px disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-200"
          >
            학습지 생성하기
          </button>
        </aside>
      </div>

      <div className="mt-5 min-h-12">
        {words.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white px-4 py-4 text-sm text-slate-400">
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
