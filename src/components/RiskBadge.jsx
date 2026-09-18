const STYLES = {
  Faible: 'bg-secondary/10 text-secondary',
  Modéré: 'bg-amber-100 text-amber-600',
  Élevé: 'bg-red-100 text-red-600',
}

export default function RiskBadge({ niveau, className = '' }) {
  const style = STYLES[niveau] || 'bg-grisclair text-grisfonce'
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${style} ${className}`}
    >
      {niveau}
    </span>
  )
}
