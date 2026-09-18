export default function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`bg-white rounded-xl2 shadow-card p-5 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
