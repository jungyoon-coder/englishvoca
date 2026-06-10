type Props = {
  title: string
  words: string[]
  disabled?: boolean
  onPick: (word: string) => void
}

export function SuggestedWords({ title, words, disabled, onPick }: Props) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
          {title}
        </h3>
        <span className="text-xs text-slate-400">클릭해서 추가</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {words.map((w) => (
          <button
            key={w}
            type="button"
            disabled={disabled}
            onClick={() => onPick(w)}
            className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 ring-1 ring-slate-200/80 transition hover:bg-white hover:text-slate-950 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus:ring-4 focus:ring-blue-100"
          >
            {w}
          </button>
        ))}
      </div>
    </section>
  )
}
