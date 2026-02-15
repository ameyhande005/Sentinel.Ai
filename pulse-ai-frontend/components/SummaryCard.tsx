import { DailySummary } from "@/lib/types";

export default function SummaryCard({ summary }: { summary: DailySummary }) {
  return (
    <div className="p-4 rounded-xl border bg-white shadow-sm">
      <h3 className="font-semibold">Daily Digest — {summary.date}</h3>

      <div className="mt-3">
        <p className="text-sm font-medium">Top Risks</p>
        <ul className="list-disc ml-5 text-sm text-gray-700 mt-1">
          {summary.topRisks.map((r, idx) => (
            <li key={idx}>{r}</li>
          ))}
        </ul>
      </div>

      <div className="mt-3">
        <p className="text-sm font-medium">Blocked Tasks</p>
        <ul className="list-disc ml-5 text-sm text-gray-700 mt-1">
          {summary.blockedTasks.map((r, idx) => (
            <li key={idx}>{r}</li>
          ))}
        </ul>
      </div>

      <div className="mt-3">
        <p className="text-sm font-medium">Changes Today</p>
        <ul className="list-disc ml-5 text-sm text-gray-700 mt-1">
          {summary.changesToday.map((r, idx) => (
            <li key={idx}>{r}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
