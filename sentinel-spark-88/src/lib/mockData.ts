export interface Task {
  id: string;
  name: string;
  status: 'in-progress' | 'completed' | 'blocked' | 'pending';
  deadline: string;
  lastUpdatedDays: number;
  assignee: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface Message {
  id: string;
  content: string;
  author: string;
  timestamp: string;
}

export interface Alert {
  id: string;
  level: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  timestamp: string;
}

export interface ProjectHealth {
  status: 'on-track' | 'needs-attention' | 'high-risk';
  score: number;
  tasksCompleted: number;
  totalTasks: number;
  blockedTasks: number;
  overdueT: number;
}

export const mockTasks: Task[] = [
  {
    id: '1',
    name: 'Implement user authentication',
    status: 'blocked',
    deadline: '2026-01-22',
    lastUpdatedDays: 5,
    assignee: 'Alex Chen',
    priority: 'critical',
  },
  {
    id: '2',
    name: 'Design system documentation',
    status: 'in-progress',
    deadline: '2026-01-25',
    lastUpdatedDays: 1,
    assignee: 'Sarah Kim',
    priority: 'high',
  },
  {
    id: '3',
    name: 'API integration for payments',
    status: 'pending',
    deadline: '2026-01-20',
    lastUpdatedDays: 8,
    assignee: 'Mike Johnson',
    priority: 'high',
  },
  {
    id: '4',
    name: 'Database optimization',
    status: 'in-progress',
    deadline: '2026-01-28',
    lastUpdatedDays: 2,
    assignee: 'Emily Davis',
    priority: 'medium',
  },
  {
    id: '5',
    name: 'Unit test coverage',
    status: 'completed',
    deadline: '2026-01-18',
    lastUpdatedDays: 0,
    assignee: 'James Wilson',
    priority: 'medium',
  },
  {
    id: '6',
    name: 'Mobile responsive fixes',
    status: 'blocked',
    deadline: '2026-01-21',
    lastUpdatedDays: 3,
    assignee: 'Lisa Park',
    priority: 'high',
  },
  {
    id: '7',
    name: 'Performance monitoring setup',
    status: 'pending',
    deadline: '2026-01-30',
    lastUpdatedDays: 4,
    assignee: 'Tom Brown',
    priority: 'low',
  },
];

export const mockMessages: Message[] = [
  {
    id: '1',
    content: 'Still waiting on the API keys from the vendor. This is blocking the payment integration.',
    author: 'Mike Johnson',
    timestamp: '2026-01-18T10:30:00Z',
  },
  {
    id: '2',
    content: 'The auth module is stuck because we need the new security requirements document.',
    author: 'Alex Chen',
    timestamp: '2026-01-17T14:20:00Z',
  },
  {
    id: '3',
    content: 'Great progress on the design system! Should be done by EOD tomorrow.',
    author: 'Sarah Kim',
    timestamp: '2026-01-18T09:00:00Z',
  },
  {
    id: '4',
    content: 'Mobile fixes are blocked on the new breakpoint decisions.',
    author: 'Lisa Park',
    timestamp: '2026-01-16T16:45:00Z',
  },
  {
    id: '5',
    content: 'Database queries are running 40% faster after the index optimization.',
    author: 'Emily Davis',
    timestamp: '2026-01-18T11:15:00Z',
  },
];

export const defaultAlerts: Alert[] = [];

export const defaultHealth: ProjectHealth = {
  status: 'needs-attention',
  score: 0,
  tasksCompleted: 1,
  totalTasks: 7,
  blockedTasks: 2,
  overdueT: 1,
};
