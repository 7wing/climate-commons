interface StatCardProps {
  icon: string
  iconFill?: boolean
  value: string
  label: string
  iconColor?: string
  className?: string
}

export default function StatCard({ icon, iconFill = true, value, label, iconColor = 'text-primary', className }: StatCardProps) {
  return (
    <div className={`bg-surface-container p-6 rounded-3xl border border-outline-variant/30 ${className ?? ''}`}>
      <span
        className={`material-symbols-outlined text-4xl mb-4 block ${iconColor}`}
        style={iconFill ? { fontVariationSettings: "'FILL' 1" } : undefined}
      >
        {icon}
      </span>
      <h3 className="font-bold text-headline-md mb-1">{value}</h3>
      <p className="text-body-md text-on-surface-variant">{label}</p>
    </div>
  )
}