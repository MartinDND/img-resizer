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

  // Quality factor: JPEG size doesn't scale linearly with quality setting —
  // the original file already has unknown compression. We apply a soft correction
  // relative to neutral q=80. At q=80 factor=1.0, at q=40 ≈0.75, at q=100 ≈1.25.
  const fmt = settings.format
  let qualityFactor
  if (fmt === 'png') {
    qualityFactor = 1.2  // PNG is lossless, typically larger than JPEG
  } else if (fmt === 'webp') {
    qualityFactor = 0.5 + (settings.quality / 100) * 0.3  // WebP is more efficient
  } else {
    // jpeg or original: soft correction, neutral at q=80
    qualityFactor = 0.7 + (settings.quality / 100) * 0.5
  }

  return Math.round(fileSizeBytes * areaRatio * qualityFactor)
}

// Decimal (kB) to match macOS Finder display
export function formatSize(bytes) {
  if (bytes < 1_000_000) return (bytes / 1000).toFixed(0) + ' kB'
  return (bytes / 1_000_000).toFixed(1) + ' MB'
}
