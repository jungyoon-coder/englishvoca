type Props = {
  title: string
  words: string[]
  disabled?: boolean
  onPick: (word: string) => void
}

export function SuggestedWords({ title, words, disabled, onPick }: Props) {
  return (
    <section className="rounded-lg bg-white px-4 py-4 shadow-sm ring-1 ring-slate-200 sm:px-5">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-sm font-extrabold text-slate-900">{title}</h3>
        <span className="text-xs text-slate-500">눌러서 바로 추가</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {words.map((w) => (
          <button
            key={w}
            type="button"
            disabled={disabled}
            onClick={() => onPick(w)}
            className="rounded-md bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-4 focus:ring-emerald-100"
          >
            {w}
          </button>
        ))}
      </div>
    </section>
  )
}
