const ID_DEGRADE = 'cardiozen-degrade'

export default function Logo({ taille = 40, avecTexte = true, className = '', clair = false }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg width={taille} height={taille} viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id={ID_DEGRADE} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1976D2" />
            <stop offset="100%" stopColor="#2EC4A6" />
          </linearGradient>
        </defs>
        <path
          fill={`url(#${ID_DEGRADE})`}
          d="M31 55S5 38.5 5 20.5C5 10.8 12.8 3 22.5 3c5.1 0 9.7 2.3 12.5 6 2.8-3.7 7.4-6 12.5-6C57.2 3 65 10.8 65 20.5v.5c0 18-26 34-26 34z"
        />
        <path
          d="M11 29h9l4-9 6 16 5-11 3 4h13"
          fill="none"
          stroke="#fff"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <g>
          <rect x="41" y="40" width="4" height="8" rx="1" fill="#fff" opacity="0.9" />
          <rect x="47" y="36" width="4" height="12" rx="1" fill="#fff" opacity="0.9" />
          <rect x="53" y="32" width="4" height="16" rx="1" fill="#fff" />
        </g>
      </svg>
      {avecTexte && (
        <div className="leading-tight">
          <div
            className={`font-semibold text-xl ${clair ? 'text-white' : 'text-primary-dark'}`}
          >
            Cardio<span className="text-secondary">Zen</span>
          </div>
          <div
            className={`text-[10px] tracking-widest uppercase ${
              clair ? 'text-white/80' : 'text-grismoyen'
            }`}
          >
            Prévoir, Agir, Protéger
          </div>
        </div>
      )}
    </div>
  )
}
