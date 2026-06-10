type Props = {
  word: string
  onRemove: () => void
}

export function WordPill({ word, onRemove }: Props) {
  return (
    <span className="inline-flex items-center gap-2 rounded-md bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200 transition hover:bg-slate-100">
      <span className="tracking-wide">{word}</span>
      <button
        type="button"
        onClick={onRemove}
        className="ml-1 grid h-6 w-6 place-items-center rounded-full text-slate-500 transition hover:bg-white hover:text-slate-800 focus:outline-none focus:ring-4 focus:ring-emerald-100"
        aria-label={`${word} 삭제`}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
          <path
            fill="currentColor"
            d="M18.3 5.71a1 1 0 0 1 0 1.41L13.41 12l4.89 4.88a1 1 0 1 1-1.41 1.42L12 13.41 7.12 18.3a1 1 0 1 1-1.42-1.41L10.59 12 5.7 7.12a1 1 0 1 1 1.42-1.41L12 10.59l4.88-4.88a1 1 0 0 1 1.42 0Z"
          />
        </svg>
      </button>
    </span>
  )
}
