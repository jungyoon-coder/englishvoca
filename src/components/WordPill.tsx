type Props = {
  word: string
  onRemove: () => void
}

export function WordPill({ word, onRemove }: Props) {
  return (
    <span className="word-chip group inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 ring-1 ring-slate-200/80 transition hover:bg-white hover:shadow-sm hover:ring-slate-300">
      <span>{word}</span>
      <button
        type="button"
        onClick={onRemove}
        className="grid h-4 w-4 place-items-center rounded-full text-slate-400 opacity-70 transition hover:bg-slate-100 hover:text-slate-900 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-200 sm:opacity-0 sm:group-hover:opacity-100"
        aria-label={`${word} 삭제`}
      >
        <svg viewBox="0 0 24 24" className="h-3 w-3" aria-hidden="true">
          <path
            fill="currentColor"
            d="M18.3 5.71a1 1 0 0 1 0 1.41L13.41 12l4.89 4.88a1 1 0 1 1-1.41 1.42L12 13.41 7.12 18.3a1 1 0 1 1-1.42-1.41L10.59 12 5.7 7.12a1 1 0 1 1 1.42-1.41L12 10.59l4.88-4.88a1 1 0 0 1 1.42 0Z"
          />
        </svg>
      </button>
    </span>
  )
}
