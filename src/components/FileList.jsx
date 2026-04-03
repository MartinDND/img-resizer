import { estimateOutputSize, formatSize } from '../utils/estimateSize'

function SizeEstimate({ file, settings }) {
  const estimated = estimateOutputSize(file.file.size, file.w, file.h, settings)

  return (
    <div className="flex items-center gap-1.5 text-xs shrink-0">
      <span className="text-zinc-500">{formatSize(file.file.size)}</span>
      {estimated !== null && (
        <>
          <svg className="w-3 h-3 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span
            className={estimated < file.file.size ? 'text-emerald-400' : 'text-amber-400'}
            title="Hrubý odhad — presná veľkosť závisí od obsahu obrázka"
          >
            ~{formatSize(estimated)}
          </span>
        </>
      )}
    </div>
  )
}

export default function FileList({ files, settings, onRemove, onClear, disabled }) {
  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
        <span className="text-sm font-medium text-zinc-300">
          {files.length} {files.length === 1 ? 'súbor' : files.length < 5 ? 'súbory' : 'súborov'}
        </span>
        <button
          onClick={onClear}
          disabled={disabled}
          className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors disabled:opacity-40"
        >
          Vymazať všetko
        </button>
      </div>

      <ul className="max-h-64 overflow-y-auto divide-y divide-zinc-800/60">
        {files.map((f, i) => (
          <li key={i} className="flex items-center justify-between px-4 py-2.5 group">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-zinc-500 text-xs w-6 shrink-0 text-right">{i + 1}</span>
              <span className="text-sm text-zinc-200 truncate">{f.file.name}</span>
            </div>
            <div className="flex items-center gap-3 shrink-0 ml-3">
              <SizeEstimate file={f} settings={settings} />
              <button
                onClick={() => onRemove(i)}
                disabled={disabled}
                className="text-zinc-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-0"
                aria-label="Odstrániť"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
