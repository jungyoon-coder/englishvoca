import { useMemo, useState } from 'react'
import { PageHeader } from './components/PageHeader'
import { SuggestedWords } from './components/SuggestedWords'
import { WordInputCard } from './components/WordInputCard'
import { WorksheetModal } from './components/WorksheetModal'
import { formatWordCount, MAX_WORDS, MIN_WORDS, normalizeWord, parseWordList } from './utils/words'

const SUGGESTED_WORDS = [
  'apple',
  'banana',
  'cat',
  'dog',
  'fish',
  'lion',
  'monkey',
  'tiger',
  'rabbit',
  'elephant',
]

const QUICK_SETS = [
  {
    title: '동물',
    words: ['cat', 'dog', 'fish', 'lion', 'tiger', 'rabbit'],
  },
  {
    title: '과일',
    words: ['apple', 'banana', 'grape', 'melon', 'peach', 'lemon'],
  },
  {
    title: '교실',
    words: ['book', 'desk', 'pencil', 'chair', 'ruler', 'paper'],
  },
]

function App() {
  const [words, setWords] = useState<string[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const wordCountLabel = useMemo(() => formatWordCount(words.length), [words.length])
  const canGenerate = words.length >= MIN_WORDS

  const addWord = (raw: string) => {
    const w = normalizeWord(raw)
    if (!w) return
    setWords((prev) => {
      if (prev.includes(w)) return prev
      if (prev.length >= MAX_WORDS) return prev
      return [...prev, w]
    })
  }

  const addWords = (raw: string) => {
    const nextWords = parseWordList(raw)
    if (nextWords.length === 0) return

    setWords((prev) => {
      const merged = [...prev]
      for (const word of nextWords) {
        if (merged.length >= MAX_WORDS) break
        if (!merged.includes(word)) merged.push(word)
      }
      return merged
    })
  }

  const addQuickSet = (items: string[]) => {
    setWords((prev) => {
      const merged = [...prev]
      for (const word of items) {
        if (merged.length >= MAX_WORDS) break
        if (!merged.includes(word)) merged.push(word)
      }
      return merged
    })
  }

  const removeWord = (word: string) => {
    setWords((prev) => prev.filter((w) => w !== word))
  }

  const clearAll = () => setWords([])

  return (
    <div className="min-h-dvh bg-[#f8fafc] px-4 py-6 text-slate-800 sm:px-6 sm:py-10 print:min-h-0 print:bg-white print:p-0">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 print:hidden">
        <PageHeader />

        <WordInputCard
          words={words}
          onAddWord={addWord}
          onAddWords={addWords}
          onRemoveWord={removeWord}
          onClearAll={clearAll}
          onGenerate={() => setIsModalOpen(true)}
        />

        <details className="group rounded-2xl bg-white/70 px-4 py-3 shadow-sm ring-1 ring-slate-200/80 backdrop-blur">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-slate-600 outline-none transition hover:text-slate-950">
            <span>단어 예시와 빠른 세트</span>
            <span className="text-xs text-slate-400 transition group-open:rotate-180">⌄</span>
          </summary>
          <div className="mt-4 grid gap-4 border-t border-slate-100 pt-4 lg:grid-cols-2">
            <SuggestedWords
              title="추천 단어"
              words={SUGGESTED_WORDS}
              disabled={words.length >= MAX_WORDS}
              onPick={addWord}
            />

            <section>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                  빠른 세트
                </h3>
                <span className="text-xs text-slate-400">한 번에 추가</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {QUICK_SETS.map((set) => (
                  <button
                    key={set.title}
                    type="button"
                    disabled={words.length >= MAX_WORDS}
                    onClick={() => addQuickSet(set.words)}
                    className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 ring-1 ring-slate-200/80 transition hover:bg-white hover:text-slate-950 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus:ring-4 focus:ring-blue-100"
                  >
                    {set.title}
                  </button>
                ))}
              </div>
            </section>
          </div>
        </details>

        <p className="text-center text-xs text-slate-400">
          입력한 단어는 브라우저에만 임시로 보관됩니다.
        </p>
      </div>

      {isModalOpen ? (
        <WorksheetModal
          words={words}
          title={`학습지 미리보기 · ${wordCountLabel}`}
          canGenerate={canGenerate}
          onClose={() => setIsModalOpen(false)}
        />
      ) : null}
    </div>
  )
}

export default App
