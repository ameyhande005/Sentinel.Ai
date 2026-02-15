import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ProjectHealthCard } from "@/components/dashboard/ProjectHealthCard";
import { AIAlertsPanel } from "@/components/dashboard/AIAlertsPanel";
import { DailySummary } from "@/components/dashboard/DailySummary";
import { TasksAtRisk } from "@/components/dashboard/TasksAtRisk";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useProjects, Task } from "@/hooks/useProjects";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { FolderPlus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api";

interface ProjectHealth {
  status: "on-track" | "needs-attention" | "high-risk";
  score: number;
  tasksCompleted: number;
  totalTasks: number;
  blockedTasks: number;
  overdueT: number;
}

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    projects,
    currentProject,
    setCurrentProject,
    tasks,
    alerts,
    latestSummary,
    loading: projectsLoading,
    createProject,
    createDemoData,
    saveAnalysisResults,
  } = useProjects();

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // 🔐 Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  // 📊 Compute health metrics
  const health: ProjectHealth = {
    status: (currentProject?.status as ProjectHealth["status"]) || "needs-attention",
    score: currentProject?.health_score || 0,
    tasksCompleted: tasks.filter((t) => t.status === "completed").length,
    totalTasks: tasks.length,
    blockedTasks: tasks.filter((t) => t.status === "blocked").length,
    overdueT: tasks.filter((t) => {
      if (!t.deadline) return false;
      return new Date(t.deadline) < new Date() && t.status !== "completed";
    }).length,
  };

  // 🔁 Format tasks for UI
  const formattedTasks = tasks.map((t) => ({
    id: t.id,
    name: t.name,
    status: t.status,
    deadline: t.deadline || "",
    lastUpdatedDays: t.last_updated_days,
    assignee: t.assignee || "Unassigned",
    priority: t.priority,
  }));

  // 🔁 Format alerts for UI
  const formattedAlerts = alerts.map((a) => ({
    id: a.id,
    level: a.level,
    title: a.title,
    description: a.description || "",
    timestamp: a.created_at,
  }));

  // 🤖 Run AI analysis (BACKEND CALL)
  const runAnalysis = useCallback(async () => {
    if (!currentProject) return;

    setIsAnalyzing(true);

    try {
      const sanitizedTasks = tasks.map((t) => ({
        name: t.name,
        status: t.status,
        deadline: t.deadline,
        lastUpdatedDays: t.last_updated_days,
        priority: t.priority,
      }));

      const data = await apiRequest("/analyze", {
        method: "POST",
        body: JSON.stringify({
          tasks: sanitizedTasks,
          messages: [],
        }),
      });

      await saveAnalysisResults(
        data.alerts.map((a: any) => ({
          level: a.level,
          title: a.title,
          description: a.description,
        })),
        data.summary,
        data.projectHealth.status,
        data.projectHealth.score
      );

      toast({
        title: "Analysis Complete",
        description: `Detected ${data.alerts.length} issue${
          data.alerts.length !== 1 ? "s" : ""
        } requiring attention`,
      });
    } catch (error: any) {
      console.error("Analysis failed:", error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [currentProject, tasks, saveAnalysisResults, toast]);

  // 🚀 Create demo project
  const handleCreateFirstProject = async () => {
    const project = await createProject(
      "My First Project",
      "Demo project with sample tasks"
    );
    if (project) {
      await createDemoData(project.id);
    }
  };

  // ⏳ Loading auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl gradient-sentinel" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        onRunAnalysis={runAnalysis}
        isAnalyzing={isAnalyzing}
        projects={projects}
        currentProject={currentProject}
        onSelectProject={setCurrentProject}
        onCreateProject={createProject}
        onCreateDemoData={createDemoData}
      />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {projectsLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-40 w-full rounded-xl" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Skeleton className="h-64 rounded-xl" />
              <Skeleton className="h-64 rounded-xl" />
            </div>
            <Skeleton className="h-80 w-full rounded-xl" />
          </div>
        ) : !currentProject ? (
          <Card className="p-12 text-center border-dashed border-2">
            <div className="max-w-md mx-auto space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                <FolderPlus className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">
                  Welcome to Project Sentinel
                </h2>
                <p className="text-muted-foreground">
                  Create your first project to start monitoring with AI-powered
                  insights
                </p>
              </div>
              <Button
                onClick={handleCreateFirstProject}
                size="lg"
                className="gap-2 gradient-sentinel border-0 shadow-lg"
              >
                <Sparkles className="w-4 h-4" />
                Create Demo Project
              </Button>
            </div>
          </Card>
        ) : (
          <>
            <ProjectHealthCard health={health} isLoading={isAnalyzing} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AIAlertsPanel
                alerts={formattedAlerts}
                isLoading={isAnalyzing}
              />
              <DailySummary
                summary={latestSummary}
                isLoading={isAnalyzing}
              />
            </div>

            <TasksAtRisk
              tasks={formattedTasks}
              isLoading={isAnalyzing}
            />
          </>
        )}

        <footer className="text-center py-6 text-sm text-muted-foreground">
          <p>Project Sentinel • AI-Powered Project Intelligence</p>
          <p className="text-xs mt-1">
            Real-time monitoring with live updates
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
