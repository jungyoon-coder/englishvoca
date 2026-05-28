function PaperIcon() {
  return (
    <div className="relative h-11 w-11">
      <div className="absolute left-1 top-1 h-10 w-10 rotate-[-8deg] rounded-2xl bg-white shadow-sm ring-1 ring-slate-200" />
      <div className="absolute left-2 top-2 h-10 w-10 rotate-[8deg] rounded-2xl bg-white shadow-md ring-1 ring-slate-200" />
      <div className="absolute left-3 top-3 grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-md ring-1 ring-violet-200">
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 text-white/95"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M7 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9.5a1 1 0 0 0-.293-.707l-4.5-4.5A1 1 0 0 0 13.5 4H7Zm7 2.414L17.586 9H14a1 1 0 0 1-1-1V5.414ZM8 12a1 1 0 1 1 0-2h8a1 1 0 1 1 0 2H8Zm0 4a1 1 0 1 1 0-2h8a1 1 0 1 1 0 2H8Z"
          />
        </svg>
      </div>
    </div>
  )
}

export function PageHeader() {
  return (
    <header className="text-center">
      <div className="mx-auto mb-4 flex justify-center">
        <PaperIcon />
      </div>

      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        영어 학습지 생성기
      </h1>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
        가르칠 영어 단어를 입력하면 따라쓰기, 크로스워드, 단어 찾기 학습지를 자동으로
        만들어 드립니다.
      </p>
    </header>
  )
}

