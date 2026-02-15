import { Shield, Sparkles, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { UserMenu } from './UserMenu';
import { ProjectSelector } from './ProjectSelector';
import { Project } from '@/hooks/useProjects';

interface DashboardHeaderProps {
  onRunAnalysis: () => void;
  isAnalyzing: boolean;
  projects: Project[];
  currentProject: Project | null;
  onSelectProject: (project: Project) => void;
  onCreateProject: (name: string, description?: string) => Promise<Project | null>;
  onCreateDemoData: (projectId: string) => Promise<void>;
}

export function DashboardHeader({ 
  onRunAnalysis, 
  isAnalyzing,
  projects,
  currentProject,
  onSelectProject,
  onCreateProject,
  onCreateDemoData,
}: DashboardHeaderProps) {
  return (
    <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-sentinel flex items-center justify-center shadow-lg shadow-primary/25">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold tracking-tight">Project Sentinel</h1>
              <p className="text-xs text-muted-foreground">AI-Powered Intelligence</p>
            </div>
          </div>

          {/* Project Selector */}
          <div className="flex-1 flex justify-center max-w-md">
            <ProjectSelector
              projects={projects}
              currentProject={currentProject}
              onSelectProject={onSelectProject}
              onCreateProject={onCreateProject}
              onCreateDemoData={onCreateDemoData}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              onClick={onRunAnalysis}
              disabled={isAnalyzing || !currentProject}
              size="sm"
              className="gap-2 gradient-sentinel border-0 shadow-lg shadow-primary/25 hover:opacity-90 transition-all"
            >
              {isAnalyzing ? (
                <>
                  <Activity className="w-4 h-4 animate-pulse" />
                  <span className="hidden sm:inline">Analyzing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span className="hidden sm:inline">Run AI Analysis</span>
                </>
              )}
            </Button>
            
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
