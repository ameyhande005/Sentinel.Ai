import { cn } from '@/lib/utils';

type StatusType = 'on-track' | 'needs-attention' | 'high-risk' | 'info' | 'warning' | 'critical';

interface StatusBadgeProps {
  status: StatusType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  'on-track': {
    label: 'On Track',
    className: 'bg-sentinel-success-bg text-sentinel-success',
  },
  'needs-attention': {
    label: 'Needs Attention',
    className: 'bg-sentinel-warning-bg text-sentinel-warning',
  },
  'high-risk': {
    label: 'High Risk',
    className: 'bg-sentinel-danger-bg text-sentinel-danger',
  },
  info: {
    label: 'Info',
    className: 'bg-sentinel-info-bg text-sentinel-info',
  },
  warning: {
    label: 'Warning',
    className: 'bg-sentinel-warning-bg text-sentinel-warning',
  },
  critical: {
    label: 'Critical',
    className: 'bg-sentinel-danger-bg text-sentinel-danger',
  },
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base',
};

export function StatusBadge({ status, size = 'md', className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full transition-colors',
        config.className,
        sizeClasses[size],
        className
      )}
    >
      <span className={cn(
        'w-1.5 h-1.5 rounded-full mr-2',
        status === 'on-track' && 'bg-sentinel-success',
        status === 'needs-attention' && 'bg-sentinel-warning',
        status === 'high-risk' && 'bg-sentinel-danger',
        status === 'info' && 'bg-sentinel-info',
        status === 'warning' && 'bg-sentinel-warning',
        status === 'critical' && 'bg-sentinel-danger',
      )} />
      {config.label}
    </span>
  );
}
