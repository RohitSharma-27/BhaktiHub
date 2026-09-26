import { Star } from 'lucide-react';
import { cn } from '../../lib/utils';

interface RatingProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Rating({
  value,
  size = 'md',
  className,
}: RatingProps) {
  const sizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };
  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={cn(
              sizes[size],
              i <= Math.round(value) ? 'fill-gold-400 text-gold-400' : 'fill-neutral-200 text-neutral-200',
            )}
          />
        ))}
      </div>
      <span className={cn('font-semibold text-neutral-700', textSizes[size])}>{value.toFixed(1)}</span>
      
    </div>
  );
}
