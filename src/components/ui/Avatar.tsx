import { cn } from '@/utils/cn'

interface AvatarProps {
  src?: string | null
  name?: string | null
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = { xs: 'w-6 h-6 text-[10px]', sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-base' }

export default function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const initials = name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() ?? '?'
  return (
    <div className={cn('rounded-full overflow-hidden flex-shrink-0 bg-primary-container', sizes[size], className)}>
      {src ? (
        <img src={src} alt={name ?? ''} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-on-primary-container font-bold">
          {initials}
        </div>
      )}
    </div>
  )
}