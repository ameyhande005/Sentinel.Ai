import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, Clock, User, CheckCircle2, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, parseISO, isBefore } from 'date-fns';

interface Task {
  id: string;
  name: string;
  status: 'in-progress' | 'completed' | 'blocked' | 'pending';
  deadline: string;
  lastUpdatedDays: number;
  assignee: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface TasksAtRiskProps {
  tasks: Task[];
  isLoading?: boolean;
}

const statusStyles = {
  'in-progress': 'bg-sentinel-info-bg text-sentinel-info',
  completed: 'bg-sentinel-success-bg text-sentinel-success',
  blocked: 'bg-sentinel-danger-bg text-sentinel-danger',
  pending: 'bg-sentinel-warning-bg text-sentinel-warning',
};

const priorityStyles = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-sentinel-info-bg text-sentinel-info',
  high: 'bg-sentinel-warning-bg text-sentinel-warning',
  critical: 'bg-sentinel-danger-bg text-sentinel-danger',
};

export function TasksAtRisk({ tasks, isLoading }: TasksAtRiskProps) {
  const riskyTasks = tasks.filter(
    (task) =>
      task.status === 'blocked' ||
      task.lastUpdatedDays > 3 ||
      (task.deadline && isBefore(parseISO(task.deadline), new Date()))
  );

  return (
    <Card className="shadow-lg border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <div className="p-2 rounded-lg bg-sentinel-warning/10">
            <AlertTriangle className="w-5 h-5 text-sentinel-warning" />
          </div>
          Tasks at Risk
          {riskyTasks.length > 0 ? (
            <span className="ml-auto px-3 py-1 text-xs font-bold rounded-full bg-sentinel-warning text-white shadow-lg shadow-sentinel-warning/25">
              {riskyTasks.length} {riskyTasks.length === 1 ? 'Issue' : 'Issues'}
            </span>
          ) : (
            <span className="ml-auto flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-sentinel-success/10 text-sentinel-success">
              <CheckCircle2 className="w-3 h-3" />
              All Clear
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : riskyTasks.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-sentinel-success/10 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-sentinel-success" />
            </div>
            <p className="font-medium text-foreground">No tasks at risk</p>
            <p className="text-sm text-muted-foreground mt-1">All tasks are progressing normally</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-6 px-6">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="font-semibold">Task</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Deadline</TableHead>
                  <TableHead className="font-semibold">Priority</TableHead>
                  <TableHead className="font-semibold hidden md:table-cell">Assignee</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {riskyTasks.map((task) => {
                  const isOverdue = task.deadline && isBefore(parseISO(task.deadline), new Date());
                  return (
                    <TableRow key={task.id} className="border-border/50 hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium max-w-[200px]">
                        <span className="truncate block">{task.name}</span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            'px-2.5 py-1 text-xs font-semibold rounded-full capitalize inline-flex items-center gap-1',
                            statusStyles[task.status]
                          )}
                        >
                          {task.status.replace('-', ' ')}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className={cn(
                          'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium w-fit',
                          isOverdue ? 'bg-sentinel-danger/10 text-sentinel-danger' : 'bg-muted'
                        )}>
                          <Clock className="w-3.5 h-3.5" />
                          {task.deadline ? format(parseISO(task.deadline), 'MMM d') : 'No date'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            'px-2.5 py-1 text-xs font-semibold rounded-full capitalize',
                            priorityStyles[task.priority]
                          )}
                        >
                          {task.priority}
                        </span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="w-3.5 h-3.5 text-primary" />
                          </div>
                          <span className="text-sm">{task.assignee}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
