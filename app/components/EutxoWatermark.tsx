export function EutxoWatermark() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      <svg
        className="absolute left-1/2 top-1/2 h-[140vmin] w-[140vmin] -translate-x-1/2 -translate-y-1/2 opacity-[0.04]"
        viewBox="0 0 800 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="eutxoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f3f4f6" />
            <stop offset="100%" stopColor="#800000" />
          </linearGradient>
        </defs>
        {/* UTXO-style nodes */}
        <circle cx="120" cy="160" r="14" stroke="url(#eutxoGrad)" strokeWidth="1.5" />
        <circle cx="400" cy="120" r="18" stroke="url(#eutxoGrad)" strokeWidth="1.5" />
        <circle cx="680" cy="200" r="12" stroke="url(#eutxoGrad)" strokeWidth="1.5" />
        <circle cx="200" cy="400" r="16" stroke="url(#eutxoGrad)" strokeWidth="1.5" />
        <circle cx="520" cy="380" r="20" stroke="url(#eutxoGrad)" strokeWidth="1.5" />
        <circle cx="320" cy="520" r="14" stroke="url(#eutxoGrad)" strokeWidth="1.5" />
        <circle cx="600" cy="580" r="12" stroke="url(#eutxoGrad)" strokeWidth="1.5" />
        <circle cx="160" cy="620" r="10" stroke="url(#eutxoGrad)" strokeWidth="1.5" />
        <circle cx="440" cy="680" r="15" stroke="url(#eutxoGrad)" strokeWidth="1.5" />
        {/* Edges / spending paths */}
        <path
          d="M120 160 L400 120 L680 200 M400 120 L520 380 M200 400 L320 520 L600 580 M520 380 L440 680 M120 160 L200 400 M680 200 L520 380 M320 520 L440 680 M160 620 L320 520"
          stroke="#9ca3af"
          strokeWidth="0.8"
          opacity="0.9"
        />
        <rect
          x="280"
          y="240"
          width="240"
          height="160"
          rx="8"
          stroke="#374151"
          strokeWidth="1"
          opacity="0.7"
        />
        <rect
          x="300"
          y="260"
          width="80"
          height="50"
          rx="4"
          stroke="#800000"
          strokeWidth="0.75"
          opacity="0.6"
        />
        <rect
          x="420"
          y="330"
          width="80"
          height="50"
          rx="4"
          stroke="#eab308"
          strokeWidth="0.75"
          opacity="0.5"
        />
      </svg>
    </div>
  );
}
