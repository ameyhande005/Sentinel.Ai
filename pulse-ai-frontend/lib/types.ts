export type RiskLevel = "low" | "medium" | "high";

export type ProjectHealth = {
  projectId: string;
  projectName: string;
  healthScore: number; // 0 - 100
  updatedAt: string;
};

export type RiskItem = {
  id: string;
  taskId: string;
  title: string;
  assignee: string;
  dueDate: string;
  riskLevel: RiskLevel;
  riskScore: number; // 0 - 100
  reasons: string[];
  evidence: {
    source: "jira" | "slack";
    snippet: string;
    timestamp: string;
  }[];
  status: "blocked" | "at_risk" | "normal";
};

export type DailySummary = {
  id: string;
  date: string;
  topRisks: string[];
  blockedTasks: string[];
  changesToday: string[];
};

export type AlertSettings = {
  slackAlertsEnabled: boolean;
  emailDigestEnabled: boolean;
  alertThreshold: RiskLevel;
};

export type IntegrationStatus = {
  jiraConnected: boolean;
  slackConnected: boolean;
  selectedProjects: string[];
  selectedChannels: string[];
};
