import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, AlertTriangle, AlertCircle, Info, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Alert {
  id: string;
  level: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  timestamp: string;
}

interface AIAlertsPanelProps {
  alerts: Alert[];
  isLoading?: boolean;
}

const alertIcons = {
  info: Info,
  warning: AlertTriangle,
  critical: AlertCircle,
};

const alertStyles = {
  info: 'border-l-4 border-l-primary bg-primary/5 hover:bg-primary/10',
  warning: 'border-l-4 border-l-sentinel-warning bg-sentinel-warning/5 hover:bg-sentinel-warning/10',
  critical: 'border-l-4 border-l-sentinel-danger bg-sentinel-danger/5 hover:bg-sentinel-danger/10',
};

const iconStyles = {
  info: 'text-primary bg-primary/10',
  warning: 'text-sentinel-warning bg-sentinel-warning/10',
  critical: 'text-sentinel-danger bg-sentinel-danger/10',
};

const levelLabels = {
  info: 'Info',
  warning: 'Warning',
  critical: 'Critical',
};

export function AIAlertsPanel({ alerts, isLoading }: AIAlertsPanelProps) {
  const criticalCount = alerts.filter(a => a.level === 'critical').length;
  const warningCount = alerts.filter(a => a.level === 'warning').length;

  return (
    <Card className="shadow-lg border-border/50 h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <div className="p-2 rounded-lg bg-primary/10">
            <Bell className="w-5 h-5 text-primary" />
          </div>
          AI Alerts
          <div className="ml-auto flex items-center gap-2">
            {criticalCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-sentinel-danger text-white">
                {criticalCount} Critical
              </span>
            )}
            {warningCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-sentinel-warning text-white">
                {warningCount} Warning
              </span>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : alerts.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-primary" />
            </div>
            <p className="font-medium text-foreground">No alerts yet</p>
            <p className="text-sm text-muted-foreground mt-1">Run AI analysis to detect issues</p>
          </div>
        ) : (
          <ScrollArea className="h-[280px] pr-4 -mr-4">
            <div className="space-y-3">
              {alerts.map((alert) => {
                const Icon = alertIcons[alert.level];
                return (
                  <div
                    key={alert.id}
                    className={cn(
                      'p-4 rounded-xl transition-all cursor-pointer',
                      alertStyles[alert.level]
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn('p-2 rounded-lg flex-shrink-0', iconStyles[alert.level])}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={cn(
                            'text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded',
                            alert.level === 'critical' && 'bg-sentinel-danger/20 text-sentinel-danger',
                            alert.level === 'warning' && 'bg-sentinel-warning/20 text-sentinel-warning',
                            alert.level === 'info' && 'bg-primary/20 text-primary'
                          )}>
                            {levelLabels[alert.level]}
                          </span>
                        </div>
                        <h4 className="font-semibold text-sm text-foreground">{alert.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{alert.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
