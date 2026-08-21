import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../utils';

export interface LoadingSpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'large';
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  large: 'h-12 w-12',
};

export const LoadingSpinner = forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ className, size = 'md', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'animate-spin rounded-full border-2 border-current border-t-transparent',
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Loading"
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
);

LoadingSpinner.displayName = 'LoadingSpinner';