function Label({ children }) {
  return <label className="text-sm font-medium text-zinc-300">{children}</label>
}

function Input({ className = '', ...props }) {
  return (
    <input
      className={`bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100
        focus:outline-none focus:border-indigo-500 transition-colors w-full ${className}`}
      {...props}
    />
  )
}

function Select({ className = '', ...props }) {
  return (
    <select
      className={`bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100
        focus:outline-none focus:border-indigo-500 transition-colors w-full ${className}`}
      {...props}
    />
  )
}

export default function Settings({ settings, onChange, disabled }) {
  const set = (key, value) => onChange(prev => ({ ...prev, [key]: value }))

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5 flex flex-col gap-5">
      <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Nastavenia</h2>

      {/* Resize */}
      <div className="flex flex-col gap-3">
        <Label>Zmena veľkosti</Label>
        <div className="flex gap-2">
          <button
            onClick={() => set('resizeMode', 'percent')}
            disabled={disabled}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors
              ${settings.resizeMode === 'percent'
                ? 'bg-indigo-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'}`}
          >
            Percentá
          </button>
          <button
            onClick={() => set('resizeMode', 'pixels')}
            disabled={disabled}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors
              ${settings.resizeMode === 'pixels'
                ? 'bg-indigo-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'}`}
          >
            Pixely
          </button>
        </div>

        {settings.resizeMode === 'percent' ? (
          <div className="flex items-center gap-3">
            <Input
              type="number"
              min={1}
              max={200}
              value={settings.percent}
              onChange={e => set('percent', Number(e.target.value))}
              disabled={disabled}
              className="w-24"
            />
            <span className="text-zinc-500 text-sm">%</span>
            <input
              type="range"
              min={1}
              max={200}
              value={settings.percent}
              onChange={e => set('percent', Number(e.target.value))}
              disabled={disabled}
              className="flex-1 accent-indigo-500"
            />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 flex-1">
                <span className="text-xs text-zinc-500 w-8">Šírka</span>
                <Input
                  type="number"
                  min={1}
                  value={settings.width}
                  onChange={e => set('width', Number(e.target.value))}
                  disabled={disabled}
                />
                <span className="text-zinc-500 text-sm">px</span>
              </div>
              <div className="flex items-center gap-2 flex-1">
                <span className="text-xs text-zinc-500 w-8">Výška</span>
                <Input
                  type="number"
                  min={1}
                  value={settings.height}
                  onChange={e => set('height', Number(e.target.value))}
                  disabled={disabled}
                  className={settings.keepAspectRatio ? 'opacity-40' : ''}
                />
                <span className="text-zinc-500 text-sm">px</span>
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={settings.keepAspectRatio}
                onChange={e => set('keepAspectRatio', e.target.checked)}
                disabled={disabled}
                className="accent-indigo-500 w-4 h-4"
              />
              <span className="text-sm text-zinc-400">Zachovať pomer strán</span>
            </label>
          </div>
        )}
      </div>

      {/* Quality */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Label>Kvalita</Label>
          <span className="text-sm text-zinc-400">{settings.quality}%</span>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={1}
            max={100}
            value={settings.quality}
            onChange={e => set('quality', Number(e.target.value))}
            disabled={disabled}
            className="flex-1 accent-indigo-500"
          />
        </div>
        <div className="flex justify-between text-xs text-zinc-600">
          <span>Menší súbor</span>
          <span>Vyššia kvalita</span>
        </div>
      </div>

      {/* Format */}
      <div className="flex flex-col gap-2">
        <Label>Výstupný formát</Label>
        <Select
          value={settings.format}
          onChange={e => set('format', e.target.value)}
          disabled={disabled}
        >
          <option value="original">Zachovať pôvodný</option>
          <option value="jpeg">JPEG</option>
          <option value="webp">WebP</option>
          <option value="png">PNG</option>
        </Select>
      </div>

      {/* Filename */}
      <div className="flex flex-col gap-2">
        <Label>Názov súboru</Label>
        <div className="flex gap-3">
          <div className="flex-1">
            <p className="text-xs text-zinc-500 mb-1">Prefix</p>
            <Input
              type="text"
              placeholder="napr. small_"
              value={settings.prefix}
              onChange={e => set('prefix', e.target.value)}
              disabled={disabled}
            />
          </div>
          <div className="flex items-end pb-2 px-1 text-zinc-600 text-sm">filename</div>
          <div className="flex-1">
            <p className="text-xs text-zinc-500 mb-1">Suffix</p>
            <Input
              type="text"
              placeholder="napr. _resized"
              value={settings.suffix}
              onChange={e => set('suffix', e.target.value)}
              disabled={disabled}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
