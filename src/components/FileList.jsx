function formatSize(bytes) {
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

export default function FileList({ files, onRemove, onClear, disabled }) {
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
        {files.map((file, i) => (
          <li key={i} className="flex items-center justify-between px-4 py-2.5 group">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-zinc-500 text-xs w-6 shrink-0 text-right">{i + 1}</span>
              <span className="text-sm text-zinc-200 truncate">{file.name}</span>
            </div>
            <div className="flex items-center gap-3 shrink-0 ml-3">
              <span className="text-xs text-zinc-500">{formatSize(file.size)}</span>
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
