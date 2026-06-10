export function PageHeader() {
  return (
    <header className="rounded-lg bg-white px-5 py-5 shadow-sm ring-1 ring-slate-200 sm:px-6">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">
          English Worksheet Maker
        </p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
          영어 단어 학습지 생성기
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          수업 단어를 입력하면 따라쓰기, 크로스워드, 워드서치, 정답지를 A4 학습지로
          바로 만들 수 있습니다.
        </p>
      </div>
    </header>
  )
}
