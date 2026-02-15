import {
  AlertSettings,
  DailySummary,
  IntegrationStatus,
  ProjectHealth,
  RiskItem
} from "./types";

export const mockHealth: ProjectHealth = {
  projectId: "p1",
  projectName: "Pulse AI - Hackathon",
  healthScore: 73,
  updatedAt: new Date().toISOString()
};

export const mockRisks: RiskItem[] = [
  {
    id: "r1",
    taskId: "JIRA-231",
    title: "Backend API endpoint for attendance sync",
    assignee: "Mithila",
    dueDate: "2026-01-25",
    riskLevel: "high",
    riskScore: 88,
    reasons: [
      "Due in 3 days",
      "No updates in 4 days",
      "Blocker mentioned in Slack"
    ],
    evidence: [
      {
        source: "slack",
        snippet:
          "Blocked waiting for backend API endpoint approval. Might take 2-3 days.",
        timestamp: new Date().toISOString()
      }
    ],
    status: "blocked"
  },
  {
    id: "r2",
    taskId: "JIRA-198",
    title: "Frontend integration for Alerts Panel",
    assignee: "Amey",
    dueDate: "2026-01-27",
    riskLevel: "medium",
    riskScore: 61,
    reasons: ["Due soon", "Status not updated recently"],
    evidence: [],
    status: "at_risk"
  }
];

export const mockSummary: DailySummary = {
  id: "s1",
  date: "2026-01-22",
  topRisks: ["JIRA-231 high risk due to dependency delay"],
  blockedTasks: ["JIRA-231 (API dependency)"],
  changesToday: ["New blocker detected from Slack", "2 tasks moved into at-risk"]
};

export const mockAlerts: AlertSettings = {
  slackAlertsEnabled: true,
  emailDigestEnabled: false,
  alertThreshold: "medium"
};

export const mockIntegrations: IntegrationStatus = {
  jiraConnected: true,
  slackConnected: true,
  selectedProjects: ["Pulse AI - Hackathon"],
  selectedChannels: ["#engineering", "#daily-standup"]
};
