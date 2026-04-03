import { useState, useCallback } from 'react'
import Dropzone from './components/Dropzone'
import Settings from './components/Settings'
import FileList from './components/FileList'
import ProcessButton from './components/ProcessButton'
import { processImages } from './utils/imageProcessor'

const defaultSettings = {
  resizeMode: 'percent',
  percent: 50,
  width: 1920,
  height: 1080,
  keepAspectRatio: true,
  quality: 80,
  format: 'original',
  prefix: '',
  suffix: '',
}

function loadDimensions(file) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => { URL.revokeObjectURL(url); resolve({ w: img.naturalWidth, h: img.naturalHeight }) }
    img.onerror = () => { URL.revokeObjectURL(url); resolve(null) }
    img.src = url
  })
}

export default function App() {
  const [files, setFiles] = useState([])       // { file, w, h }[]
  const [settings, setSettings] = useState(defaultSettings)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState({ current: 0, total: 0 })

  const handleDrop = useCallback(async (newFiles) => {
    const withDims = await Promise.all(
      newFiles.map(async (file) => {
        const dims = await loadDimensions(file)
        return { file, w: dims?.w ?? null, h: dims?.h ?? null }
      })
    )
    setFiles(prev => {
      const existing = new Set(prev.map(f => f.file.name + f.file.size))
      return [...prev, ...withDims.filter(f => !existing.has(f.file.name + f.file.size))]
    })
  }, [])

  const handleRemove = useCallback((index) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }, [])

  const handleClear = useCallback(() => setFiles([]), [])

  const handleProcess = async () => {
    if (!files.length) return
    setProcessing(true)
    setProgress({ current: 0, total: files.length })
    try {
      await processImages(files.map(f => f.file), settings, (current) => {
        setProgress({ current, total: files.length })
      })
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <header className="border-b border-zinc-800 px-6 py-4">
        <h1 className="text-xl font-semibold tracking-tight text-white">Image Resizer</h1>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 flex flex-col gap-6">
        <Dropzone onDrop={handleDrop} disabled={processing} />

        {files.length > 0 && (
          <>
            <FileList
              files={files}
              settings={settings}
              onRemove={handleRemove}
              onClear={handleClear}
              disabled={processing}
            />
            <Settings settings={settings} onChange={setSettings} disabled={processing} />
            <ProcessButton
              fileCount={files.length}
              processing={processing}
              progress={progress}
              onClick={handleProcess}
            />
          </>
        )}
      </main>
    </div>
  )
}
