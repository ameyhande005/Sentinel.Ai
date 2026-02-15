import { cn } from '@/lib/utils';

interface HealthRingProps {
  score: number;
  status: 'on-track' | 'needs-attention' | 'high-risk';
  size?: number;
}

export function HealthRing({ score, status, size = 120 }: HealthRingProps) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;
  
  const strokeColor = {
    'on-track': 'stroke-sentinel-success',
    'needs-attention': 'stroke-sentinel-warning',
    'high-risk': 'stroke-sentinel-danger',
  }[status];
  
  const bgColor = {
    'on-track': 'stroke-sentinel-success/20',
    'needs-attention': 'stroke-sentinel-warning/20',
    'high-risk': 'stroke-sentinel-danger/20',
  }[status];

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          className={cn('transition-all duration-500', bgColor)}
          strokeWidth={strokeWidth}
          fill="none"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={cn('transition-all duration-700 ease-out', strokeColor)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-foreground">{score}</span>
        <span className="text-xs text-muted-foreground uppercase tracking-wider">Health</span>
      </div>
    </div>
  );
}
