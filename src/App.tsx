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
    <div className="min-h-dvh bg-[#f7f8fb] px-4 py-6 text-slate-800 sm:py-10">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 sm:gap-6">
        <PageHeader />

        <WordInputCard
          words={words}
          onAddWord={addWord}
          onAddWords={addWords}
          onRemoveWord={removeWord}
          onClearAll={clearAll}
          onGenerate={() => setIsModalOpen(true)}
        />

        <SuggestedWords
          title="추천 단어"
          words={SUGGESTED_WORDS}
          disabled={words.length >= MAX_WORDS}
          onPick={addWord}
        />

        <section className="rounded-xl bg-white px-4 py-4 shadow-sm ring-1 ring-slate-200 sm:px-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">수업 주제 빠른 추가</h3>
              <p className="mt-1 text-xs text-slate-500">
                자주 쓰는 묶음을 눌러 빈칸 학습지 준비 시간을 줄여보세요.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {QUICK_SETS.map((set) => (
                <button
                  key={set.title}
                  type="button"
                  disabled={words.length >= MAX_WORDS}
                  onClick={() => addQuickSet(set.words)}
                  className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                >
                  {set.title}
                </button>
              ))}
            </div>
          </div>
        </section>

        <p className="text-center text-xs text-slate-500">
          입력한 단어는 브라우저에만 임시로 보관됩니다. 새로고침하면 초기화됩니다.
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
