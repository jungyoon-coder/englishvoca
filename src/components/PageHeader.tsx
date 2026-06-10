export function PageHeader() {
  return (
    <header className="px-1">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
        English Worksheet Maker
      </p>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            영어 단어 학습지 생성기
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            단어를 붙여넣고 Enter를 누르면 바로 추가됩니다. 따라쓰기, 크로스워드,
            워드서치와 정답지를 한 번에 만들 수 있습니다.
          </p>
        </div>
        <p className="text-xs font-medium text-slate-400">A4 PDF · 인쇄 최적화</p>
      </div>
    </header>
  )
}
