// src/components/FloatingActionBar.tsx
import { cn } from '@/lib/utils';

interface FloatingActionBarProps extends React.HTMLAttributes<HTMLDivElement> {
  show?: boolean;
  children: React.ReactNode;
}

export function FloatingActionBar({
  className,
  show = true,
  children,
  ...props
}: FloatingActionBarProps) {
  if (!show) return null;

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom-2',
        className,
      )}
      {...props}
    >
      <div className="mx-auto w-[40%] max-w-screen-2xl">
        <div className="rounded-t-lg border-l border-r border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto flex h-16 items-center px-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
