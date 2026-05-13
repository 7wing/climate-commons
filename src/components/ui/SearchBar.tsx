import { cn } from '@/utils/cn'

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

export default function SearchBar({ className, ...props }: SearchBarProps) {
  return (
    <div className={cn('relative', className)}>
      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
        search
      </span>
      <input
        type="text"
        className="w-full h-12 pl-12 pr-4 bg-surface-container rounded-full border-none focus:outline-none focus:ring-2 focus:ring-primary font-body-md text-body-md text-on-surface placeholder:text-outline-variant shadow-inner transition-shadow"
        {...props}
      />
    </div>
  )
}