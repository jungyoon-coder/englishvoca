import { useMemo, useState } from 'react'
import { PageHeader } from './components/PageHeader'
import { SuggestedWords } from './components/SuggestedWords'
import { WordInputCard } from './components/WordInputCard'
import { WorksheetModal } from './components/WorksheetModal'
import { MAX_WORDS, MIN_WORDS, normalizeWord } from './utils/words'

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

function App() {
  const [words, setWords] = useState<string[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const wordCountLabel = useMemo(() => `${words.length}개 단어`, [words.length])
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

  const removeWord = (word: string) => {
    setWords((prev) => prev.filter((w) => w !== word))
  }

  const clearAll = () => setWords([])

  return (
    <div className="min-h-dvh bg-[#f3f6ff] px-4 py-10 text-slate-800">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <PageHeader />

        <WordInputCard
          words={words}
          onAddWord={addWord}
          onRemoveWord={removeWord}
          onClearAll={clearAll}
          onGenerate={() => setIsModalOpen(true)}
        />

        <SuggestedWords
          title="추천 단어 예시"
          words={SUGGESTED_WORDS}
          disabled={words.length >= MAX_WORDS}
          onPick={addWord}
        />

        <p className="text-center text-xs text-slate-500">
          입력한 단어는 브라우저에 저장되지 않습니다. (로컬 state만 사용)
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
