import { cn } from '@/utils/cn'
import { forwardRef } from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const variants = {
  primary: 'bg-primary text-on-primary hover:scale-[1.02] active:scale-[0.98]',
  secondary: 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest',
  ghost: 'text-on-surface-variant hover:bg-surface-container-high',
  outline: 'border-2 border-secondary text-secondary hover:bg-secondary-container/10',
  danger: 'bg-error text-on-error hover:scale-[1.02]',
}

const sizes = {
  sm: 'h-9 px-4 text-label-caps',
  md: 'h-12 px-6 text-body-md',
  lg: 'h-14 px-8 text-body-lg',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-label-caps font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {children}
    </button>
  )
)

Button.displayName = 'Button'
export default Button