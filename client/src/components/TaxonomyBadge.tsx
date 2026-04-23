import { cn } from '@/lib/utils';

export type TaxonomyType = 'mag' | 'hid' | 'horizont';

interface TaxonomyBadgeProps {
  type: TaxonomyType;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const taxonomyConfig: Record<TaxonomyType, { color: string; bgColor: string; label: string; labelEn: string; icon: string }> = {
  mag: {
    color: 'text-blue-900',
    bgColor: 'bg-blue-100 border border-blue-300',
    label: 'Mag (Biztosabb alap)',
    labelEn: 'Core (Solid Foundation)',
    icon: '🔵',
  },
  hid: {
    color: 'text-orange-900',
    bgColor: 'bg-orange-100 border border-orange-300',
    label: 'Híd (Értelmező)',
    labelEn: 'Bridge (Interpretive)',
    icon: '🔶',
  },
  horizont: {
    color: 'text-purple-900',
    bgColor: 'bg-purple-100 border border-purple-300',
    label: 'Horizont (Kísérleti)',
    labelEn: 'Horizon (Experimental)',
    icon: '🟣',
  },
};

export function TaxonomyBadge({
  type,
  label,
  size = 'md',
  className,
}: TaxonomyBadgeProps) {
  const config = taxonomyConfig[type];
  const displayLabel = label || config.label;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium transition-all duration-200',
        config.bgColor,
        config.color,
        sizeClasses[size],
        'hover:shadow-md hover:scale-105',
        className
      )}
      title={config.labelEn}
    >
      <span className="text-lg">{config.icon}</span>
      <span className="font-mono">{displayLabel}</span>
    </span>
  );
}
