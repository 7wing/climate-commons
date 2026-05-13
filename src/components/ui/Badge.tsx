import { cn } from '@/utils/cn'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'neutral'
  className?: string
}

const variants = {
  primary: 'bg-primary-container text-on-primary-container',
  secondary: 'bg-secondary-container text-on-secondary-container',
  tertiary: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
  success: 'bg-primary/10 text-primary',
  neutral: 'bg-surface-container-high text-on-surface-variant',
}

export default function Badge({ children, variant = 'neutral', className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center gap-1 px-3 py-1 rounded-full font-label-caps text-label-caps', variants[variant], className)}>
      {children}
    </span>
  )
}