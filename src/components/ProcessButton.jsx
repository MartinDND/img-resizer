export default function ProcessButton({ fileCount, processing, progress, onClick }) {
  const pct = progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0

  return (
    <div className="flex flex-col gap-3">
      {processing && (
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-xs text-zinc-400">
            <span>Spracovávam {progress.current} / {progress.total}</span>
            <span>{pct}%</span>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}
      <button
        onClick={onClick}
        disabled={processing || fileCount === 0}
        className={`w-full py-3 rounded-xl font-semibold text-sm transition-all
          ${processing
            ? 'bg-indigo-700 text-indigo-300 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-500 text-white active:scale-[0.99]'}
          disabled:opacity-60`}
      >
        {processing
          ? 'Spracovávam...'
          : `Spracovať a stiahnuť ZIP (${fileCount} ${fileCount === 1 ? 'súbor' : fileCount < 5 ? 'súbory' : 'súborov'})`
        }
      </button>
    </div>
  )
}
