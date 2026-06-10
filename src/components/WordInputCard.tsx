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

function EmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center">
      <p className="text-sm font-semibold text-slate-700">
        아직 추가된 단어가 없습니다.
      </p>
      <p className="mt-1 text-xs text-slate-500">
        최소 {MIN_WORDS}개, 최대 {MAX_WORDS}개까지 입력할 수 있습니다.
      </p>
    </div>
  )
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
    if (!value.trim()) return '쉼표, 줄바꿈, 공백으로 여러 단어를 한 번에 붙여넣을 수 있습니다.'
    if (parsedWords.length === 0) return '영어 알파벳이 포함된 단어를 입력해주세요.'
    if (parsedWords.some((word) => words.includes(word))) return '이미 추가된 단어는 자동으로 건너뜁니다.'
    return `${parsedWords.length}개 단어를 추가할 수 있습니다.`
  }, [parsedWords, value, words])

  const headerLabel = useMemo(() => {
    return `단어 입력 (${words.length}/${MAX_WORDS}개)`
  }, [words.length])

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
    <section className="rounded-lg bg-white shadow-sm ring-1 ring-slate-200">
      <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div>
          <h2 className="text-sm font-extrabold text-slate-900">{headerLabel}</h2>
          <p className="mt-1 text-xs text-slate-500">
            교과서 단원 단어, 받아쓰기 단어, 복습 단어를 자유롭게 넣어보세요.
          </p>
        </div>

        {words.length > 0 ? (
          <button
            type="button"
            onClick={onClearAll}
            className="self-start rounded-md px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-100 sm:self-auto"
          >
            전체 삭제
          </button>
        ) : null}
      </div>

      <div className="px-4 py-5 sm:px-5">
        <label htmlFor={inputId} className="sr-only">
          영어 단어 입력
        </label>

        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <textarea
            id={inputId}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault()
                handleAdd()
              }
            }}
            placeholder="예: apple, banana, cat"
            className="min-h-28 w-full resize-y rounded-md border border-slate-200 bg-white px-4 py-3 text-sm leading-relaxed outline-none transition placeholder:text-slate-400 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100 disabled:bg-slate-50 sm:min-h-24"
            disabled={!canAddMore}
            inputMode="text"
            autoComplete="off"
          />

          <button
            type="button"
            onClick={handleAdd}
            disabled={!canAddMore || parsedWords.length === 0}
            className="h-11 rounded-md bg-emerald-600 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 active:translate-y-px disabled:cursor-not-allowed disabled:bg-slate-300 focus:outline-none focus:ring-4 focus:ring-emerald-100 sm:h-full sm:min-h-24"
          >
            추가
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-500">{helperText}</p>

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
            className="w-full rounded-md bg-slate-900 px-5 py-4 text-sm font-extrabold text-white shadow-sm transition hover:bg-slate-800 active:translate-y-px disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none focus:outline-none focus:ring-4 focus:ring-slate-200"
          >
            학습지 생성하기 ({words.length}개 단어)
          </button>
          <p className="mt-2 text-center text-xs text-slate-500">
            단어를 {MIN_WORDS}개 이상 입력하면 미리보기가 활성화됩니다.
          </p>
        </div>
      </div>
    </section>
  )
}
