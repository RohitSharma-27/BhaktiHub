import { Loader2 } from 'lucide-react';

export default function Spinner({ size = 'md', className }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return <Loader2 className={`${sizes[size]} animate-spin text-saffron-500 ${className ?? ''}`} />;
}

export function FullPageSpinner() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="h-56 bg-cream-200" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-cream-200 rounded w-3/4" />
        <div className="h-3 bg-cream-200 rounded w-1/2" />
        <div className="h-3 bg-cream-200 rounded w-full" />
        <div className="flex gap-2 pt-2">
          <div className="h-8 bg-cream-200 rounded flex-1" />
          <div className="h-8 bg-cream-200 rounded flex-1" />
        </div>
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
