import JSZip from 'jszip'

function getOutputMime(format, originalType) {
  if (format === 'original') return originalType
  const map = { jpeg: 'image/jpeg', webp: 'image/webp', png: 'image/png' }
  return map[format] ?? originalType
}

function getExtension(mime) {
  const map = { 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/png': 'png', 'image/gif': 'gif', 'image/avif': 'avif' }
  return map[mime] ?? 'jpg'
}

function buildFileName(original, prefix, suffix, outputMime, originalMime) {
  const dot = original.lastIndexOf('.')
  const base = dot !== -1 ? original.slice(0, dot) : original
  const ext = outputMime !== originalMime ? getExtension(outputMime) : (dot !== -1 ? original.slice(dot + 1) : 'jpg')
  return `${prefix}${base}${suffix}.${ext}`
}

async function resizeImage(file, settings) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)

      let targetW, targetH

      if (settings.resizeMode === 'percent') {
        const scale = settings.percent / 100
        targetW = Math.round(img.naturalWidth * scale)
        targetH = Math.round(img.naturalHeight * scale)
      } else {
        if (settings.keepAspectRatio) {
          const ratio = img.naturalWidth / img.naturalHeight
          targetW = settings.width
          targetH = Math.round(settings.width / ratio)
        } else {
          targetW = settings.width
          targetH = settings.height
        }
      }

      const canvas = document.createElement('canvas')
      canvas.width = targetW
      canvas.height = targetH

      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, targetW, targetH)

      const outputMime = getOutputMime(settings.format, file.type)
      const quality = outputMime === 'image/png' ? undefined : settings.quality / 100

      canvas.toBlob(
        (blob) => {
          if (!blob) { reject(new Error(`Failed to process ${file.name}`)); return }
          const fileName = buildFileName(file.name, settings.prefix, settings.suffix, outputMime, file.type)
          resolve({ blob, fileName })
        },
        outputMime,
        quality
      )
    }

    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error(`Failed to load ${file.name}`)) }
    img.src = url
  })
}

export async function processImages(files, settings, onProgress) {
  const zip = new JSZip()

  for (let i = 0; i < files.length; i++) {
    const { blob, fileName } = await resizeImage(files[i], settings)
    zip.file(fileName, blob)
    onProgress(i + 1)
  }

  const zipBlob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 1 } })

  const url = URL.createObjectURL(zipBlob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'resized-images.zip'
  a.click()
  URL.revokeObjectURL(url)
}
