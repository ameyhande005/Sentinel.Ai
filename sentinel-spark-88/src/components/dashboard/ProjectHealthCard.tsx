import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HealthRing } from './HealthRing';
import { StatusBadge } from './StatusBadge';
import { Activity, AlertTriangle, CheckCircle2, Clock, TrendingUp } from 'lucide-react';

interface ProjectHealth {
  status: 'on-track' | 'needs-attention' | 'high-risk';
  score: number;
  tasksCompleted: number;
  totalTasks: number;
  blockedTasks: number;
  overdueT: number;
}

interface ProjectHealthCardProps {
  health: ProjectHealth;
  isLoading?: boolean;
}

export function ProjectHealthCard({ health, isLoading }: ProjectHealthCardProps) {
  const completionRate = health.totalTasks > 0 
    ? Math.round((health.tasksCompleted / health.totalTasks) * 100) 
    : 0;

  return (
    <Card className="shadow-lg border-border/50 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
      <CardHeader className="pb-2 relative">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <div className="p-2 rounded-lg bg-primary/10">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          Project Health Overview
          {health.score > 0 && (
            <div className="ml-auto flex items-center gap-1 text-sm font-normal text-muted-foreground">
              <TrendingUp className="w-4 h-4" />
              {health.score}% Health
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
          <div className={`flex-shrink-0 ${isLoading ? 'opacity-50 animate-pulse' : ''}`}>
            <HealthRing score={health.score} status={health.status} size={160} />
          </div>
          
          <div className="flex-1 space-y-6 w-full">
            <div className="flex items-center justify-center lg:justify-start gap-4">
              <span className="text-muted-foreground font-medium">Current Status:</span>
              <StatusBadge status={health.status} size="lg" />
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="group p-4 rounded-xl bg-gradient-to-br from-sentinel-success/10 to-sentinel-success/5 border border-sentinel-success/20 hover:border-sentinel-success/40 transition-all">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-sentinel-success/20">
                    <CheckCircle2 className="w-5 h-5 text-sentinel-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-sentinel-success">{health.tasksCompleted}</p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                </div>
              </div>
              
              <div className="group p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 hover:border-primary/40 transition-all">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <Activity className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">{health.totalTasks}</p>
                    <p className="text-xs text-muted-foreground">Total Tasks</p>
                  </div>
                </div>
              </div>
              
              <div className="group p-4 rounded-xl bg-gradient-to-br from-sentinel-warning/10 to-sentinel-warning/5 border border-sentinel-warning/20 hover:border-sentinel-warning/40 transition-all">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-sentinel-warning/20">
                    <AlertTriangle className="w-5 h-5 text-sentinel-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-sentinel-warning">{health.blockedTasks}</p>
                    <p className="text-xs text-muted-foreground">Blocked</p>
                  </div>
                </div>
              </div>
              
              <div className="group p-4 rounded-xl bg-gradient-to-br from-sentinel-danger/10 to-sentinel-danger/5 border border-sentinel-danger/20 hover:border-sentinel-danger/40 transition-all">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-sentinel-danger/20">
                    <Clock className="w-5 h-5 text-sentinel-danger" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-sentinel-danger">{health.overdueT}</p>
                    <p className="text-xs text-muted-foreground">Overdue</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Completion Rate</span>
                <span className="font-medium">{completionRate}%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full gradient-sentinel transition-all duration-500 rounded-full"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
