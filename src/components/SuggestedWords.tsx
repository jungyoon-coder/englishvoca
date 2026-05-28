type Props = {
  title: string
  words: string[]
  disabled?: boolean
  onPick: (word: string) => void
}

export function SuggestedWords({ title, words, disabled, onPick }: Props) {
  return (
    <section className="rounded-3xl bg-white/70 px-5 py-4 shadow-[0_10px_24px_-22px_rgba(15,23,42,0.6)] ring-1 ring-slate-200 backdrop-blur sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-extrabold text-slate-900">{title}</h3>
        <span className="text-xs text-slate-500">클릭하면 자동으로 추가돼요</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {words.map((w) => (
          <button
            key={w}
            type="button"
            disabled={disabled}
            onClick={() => onPick(w)}
            className="rounded-full bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-4 focus:ring-violet-100"
          >
            {w}
          </button>
        ))}
      </div>
    </section>
  )
}

