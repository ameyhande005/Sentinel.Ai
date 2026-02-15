import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { mockAlerts, mockIntegrations } from "@/lib/mock";

export default function SettingsPage() {
  return (
    <div className="flex bg-slate-100 min-h-screen">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <main className="p-6">
          <h2 className="text-xl font-semibold text-slate-800">
            Settings
          </h2>

          <p className="text-sm text-slate-600 mt-1">
            Privacy-first controls (least privilege + opt-in channels).
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition">
              <h3 className="font-semibold text-slate-800">
                Alert Settings
              </h3>

              <div className="mt-4 text-sm text-slate-700 space-y-2">
                <p>
                  Slack Alerts:{" "}
                  {mockAlerts.slackAlertsEnabled ? "Enabled ✅" : "Disabled ❌"}
                </p>
                <p>
                  Email Digest:{" "}
                  {mockAlerts.emailDigestEnabled ? "Enabled ✅" : "Disabled ❌"}
                </p>
                <p>
                  Threshold: {mockAlerts.alertThreshold.toUpperCase()}
                </p>
              </div>

              <p className="text-xs text-slate-500 mt-4">
                In MVP: toggles will call backend endpoint later.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition">
              <h3 className="font-semibold text-slate-800">
                Integrations
              </h3>

              <div className="mt-4 text-sm text-slate-700 space-y-2">
                <p>
                  Jira:{" "}
                  {mockIntegrations.jiraConnected ? "Connected ✅" : "Not Connected ❌"}
                </p>
                <p>
                  Slack:{" "}
                  {mockIntegrations.slackConnected ? "Connected ✅" : "Not Connected ❌"}
                </p>
                <p>
                  Projects: {mockIntegrations.selectedProjects.join(", ")}
                </p>
                <p>
                  Channels: {mockIntegrations.selectedChannels.join(", ")}
                </p>
              </div>

              <p className="text-xs text-slate-500 mt-4">
                Only selected channels are analyzed. No DMs. No attachments.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
