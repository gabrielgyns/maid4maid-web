interface BadgeProps {
  text: string;
  marker?: boolean;
  animateMarker?: boolean;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
}

export default function Badge({
  text,
  marker = false,
  animateMarker = false,
  variant = 'default',
  className,
}: BadgeProps) {
  const variantColors = {
    default: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      marker: 'bg-blue-800',
      ping: 'bg-blue-600',
    },
    primary: {
      bg: 'bg-violet-100',
      text: 'text-violet-800',
      marker: 'bg-violet-800',
      ping: 'bg-violet-600',
    },
    success: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      marker: 'bg-green-800',
      ping: 'bg-green-600',
    },
    warning: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      marker: 'bg-yellow-800',
      ping: 'bg-yellow-600',
    },
    danger: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      marker: 'bg-red-800',
      ping: 'bg-red-600',
    },
  };

  const colors = variantColors[variant];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${colors.bg} ${colors.text} ${className}`}
    >
      {marker && (
        <span className="relative flex h-1.5 w-1.5">
          {animateMarker && (
            <span
              className={`absolute inline-flex h-full w-full animate-ping rounded-full ${colors.ping} opacity-75`}
            ></span>
          )}
          <span
            className={`relative inline-flex h-1.5 w-1.5 rounded-full ${colors.marker}`}
          ></span>
        </span>
      )}
      {text}
    </span>
  );
}
