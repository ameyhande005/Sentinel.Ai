import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface Project {
  id: string;
  name: string;
  description: string | null;
  owner_id: string;
  status: 'on-track' | 'needs-attention' | 'high-risk';
  health_score: number;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  project_id: string;
  name: string;
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'critical';
  deadline: string | null;
  assignee: string | null;
  last_updated_days: number;
  created_at: string;
  updated_at: string;
}

export interface Alert {
  id: string;
  project_id: string;
  level: 'info' | 'warning' | 'critical';
  title: string;
  description: string | null;
  is_read: boolean;
  created_at: string;
}

export interface AISummary {
  id: string;
  project_id: string;
  summary: string;
  generated_at: string;
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [latestSummary, setLatestSummary] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch projects
  const fetchProjects = useCallback(async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
      return;
    }

    const typedData = (data || []) as Project[];
    setProjects(typedData);
    
    // Set current project to first one if none selected
    if (typedData.length > 0 && !currentProject) {
      setCurrentProject(typedData[0]);
    }
  }, [user, currentProject]);

  // Fetch tasks for current project
  const fetchTasks = useCallback(async () => {
    if (!currentProject) return;

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', currentProject.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error);
      return;
    }

    setTasks((data || []) as Task[]);
  }, [currentProject]);

  // Fetch alerts for current project
  const fetchAlerts = useCallback(async () => {
    if (!currentProject) return;

    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .eq('project_id', currentProject.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching alerts:', error);
      return;
    }

    setAlerts((data || []) as Alert[]);
  }, [currentProject]);

  // Fetch latest AI summary
  const fetchLatestSummary = useCallback(async () => {
    if (!currentProject) return;

    const { data, error } = await supabase
      .from('ai_summaries')
      .select('*')
      .eq('project_id', currentProject.id)
      .order('generated_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching summary:', error);
      return;
    }

    setLatestSummary(data?.summary || '');
  }, [currentProject]);

  // Create a new project
  const createProject = async (name: string, description?: string) => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('projects')
      .insert({
        name,
        description,
        owner_id: user.id,
      })
      .select()
      .single();

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to create project',
        variant: 'destructive',
      });
      return null;
    }

    toast({
      title: 'Project Created',
      description: `${name} has been created successfully`,
    });

    await fetchProjects();
    const typedData = data as Project;
    setCurrentProject(typedData);
    return typedData;
  };

  // Create demo data for new users
  const createDemoData = async (projectId: string) => {
    const demoTasks = [
      { name: 'Implement user authentication', status: 'blocked', priority: 'critical', deadline: '2026-01-22', assignee: 'Alex Chen', last_updated_days: 5 },
      { name: 'Design system documentation', status: 'in-progress', priority: 'high', deadline: '2026-01-25', assignee: 'Sarah Kim', last_updated_days: 1 },
      { name: 'API integration for payments', status: 'pending', priority: 'high', deadline: '2026-01-20', assignee: 'Mike Johnson', last_updated_days: 8 },
      { name: 'Database optimization', status: 'in-progress', priority: 'medium', deadline: '2026-01-28', assignee: 'Emily Davis', last_updated_days: 2 },
      { name: 'Unit test coverage', status: 'completed', priority: 'medium', deadline: '2026-01-18', assignee: 'James Wilson', last_updated_days: 0 },
      { name: 'Mobile responsive fixes', status: 'blocked', priority: 'high', deadline: '2026-01-21', assignee: 'Lisa Park', last_updated_days: 3 },
    ];

    for (const task of demoTasks) {
      await supabase.from('tasks').insert({
        project_id: projectId,
        name: task.name,
        status: task.status,
        priority: task.priority,
        deadline: task.deadline,
        assignee: task.assignee,
        last_updated_days: task.last_updated_days,
      });
    }

    await fetchTasks();
  };

  // Update project status
  const updateProjectStatus = async (status: Project['status'], healthScore: number) => {
    if (!currentProject) return;

    const { error } = await supabase
      .from('projects')
      .update({ status, health_score: healthScore })
      .eq('id', currentProject.id);

    if (error) {
      console.error('Error updating project:', error);
      return;
    }

    setCurrentProject({ ...currentProject, status, health_score: healthScore });
  };

  // Save AI analysis results
  const saveAnalysisResults = async (
    newAlerts: Omit<Alert, 'id' | 'project_id' | 'created_at' | 'is_read'>[],
    summary: string,
    status: Project['status'],
    healthScore: number
  ) => {
    if (!currentProject) return;

    // Clear old alerts
    await supabase
      .from('alerts')
      .delete()
      .eq('project_id', currentProject.id);

    // Insert new alerts
    if (newAlerts.length > 0) {
      await supabase.from('alerts').insert(
        newAlerts.map(alert => ({
          ...alert,
          project_id: currentProject.id,
        }))
      );
    }

    // Save new summary
    await supabase.from('ai_summaries').insert({
      project_id: currentProject.id,
      summary,
    });

    // Update project status
    await updateProjectStatus(status, healthScore);

    // Refresh data
    await Promise.all([fetchAlerts(), fetchLatestSummary()]);
  };

  // Initial load
  useEffect(() => {
    if (user) {
      setLoading(true);
      fetchProjects().finally(() => setLoading(false));
    } else {
      setProjects([]);
      setCurrentProject(null);
      setTasks([]);
      setAlerts([]);
      setLatestSummary('');
      setLoading(false);
    }
  }, [user, fetchProjects]);

  // Load project data when current project changes
  useEffect(() => {
    if (currentProject) {
      Promise.all([fetchTasks(), fetchAlerts(), fetchLatestSummary()]);
    }
  }, [currentProject, fetchTasks, fetchAlerts, fetchLatestSummary]);

  // Real-time subscriptions
  useEffect(() => {
    if (!currentProject) return;

    const tasksChannel = supabase
      .channel('tasks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `project_id=eq.${currentProject.id}`,
        },
        () => {
          fetchTasks();
        }
      )
      .subscribe();

    const alertsChannel = supabase
      .channel('alerts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'alerts',
          filter: `project_id=eq.${currentProject.id}`,
        },
        () => {
          fetchAlerts();
        }
      )
      .subscribe();

    const projectsChannel = supabase
      .channel('projects-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
          filter: `id=eq.${currentProject.id}`,
        },
        () => {
          fetchProjects();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(tasksChannel);
      supabase.removeChannel(alertsChannel);
      supabase.removeChannel(projectsChannel);
    };
  }, [currentProject, fetchTasks, fetchAlerts, fetchProjects]);

  return {
    projects,
    currentProject,
    setCurrentProject,
    tasks,
    alerts,
    latestSummary,
    loading,
    createProject,
    createDemoData,
    saveAnalysisResults,
    refreshData: () => Promise.all([fetchProjects(), fetchTasks(), fetchAlerts(), fetchLatestSummary()]),
  };
}
