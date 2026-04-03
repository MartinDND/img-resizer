export function getTargetDimensions(origW, origH, settings) {
  if (settings.resizeMode === 'percent') {
    const scale = settings.percent / 100
    return { w: Math.round(origW * scale), h: Math.round(origH * scale) }
  }
  if (settings.keepAspectRatio) {
    const ratio = origW / origH
    return { w: settings.width, h: Math.round(settings.width / ratio) }
  }
  return { w: settings.width, h: settings.height }
}

export function estimateOutputSize(fileSizeBytes, origW, origH, settings) {
  if (!origW || !origH) return null

  const { w, h } = getTargetDimensions(origW, origH, settings)
  const areaRatio = (w * h) / (origW * origH)

  let qualityFactor
  const fmt = settings.format
  if (fmt === 'png') {
    qualityFactor = 0.85
  } else if (fmt === 'webp') {
    qualityFactor = (settings.quality / 100) * 0.65
  } else {
    // jpeg or original (most images are jpeg)
    qualityFactor = settings.quality / 100
  }

  return Math.round(fileSizeBytes * areaRatio * qualityFactor)
}

export function formatSize(bytes) {
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}
