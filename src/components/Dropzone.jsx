import { useRef, useState } from 'react'

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']

export default function Dropzone({ onDrop, disabled }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const parseFiles = (fileList) => {
    const valid = Array.from(fileList).filter(f => ACCEPTED.includes(f.type))
    if (valid.length) onDrop(valid)
  }

  const onDragOver = (e) => { e.preventDefault(); if (!disabled) setDragging(true) }
  const onDragLeave = () => setDragging(false)
  const onDrop_ = (e) => {
    e.preventDefault()
    setDragging(false)
    if (!disabled) parseFiles(e.dataTransfer.files)
  }

  return (
    <div
      onClick={() => !disabled && inputRef.current.click()}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop_}
      className={`
        border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors select-none
        ${dragging ? 'border-indigo-500 bg-indigo-500/10' : 'border-zinc-700 hover:border-zinc-500 bg-zinc-900/50'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <div className="flex flex-col items-center gap-3">
        <svg className="w-10 h-10 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
        <div>
          <p className="text-zinc-200 font-medium">Pretiahnite fotky sem</p>
          <p className="text-zinc-500 text-sm mt-1">alebo kliknite pre výber súborov</p>
        </div>
        <p className="text-zinc-600 text-xs">JPG, PNG, WebP, GIF, AVIF</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPTED.join(',')}
        className="hidden"
        onChange={e => parseFiles(e.target.files)}
      />
    </div>
  )
}
