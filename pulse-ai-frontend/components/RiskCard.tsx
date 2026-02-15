import { RiskItem } from "@/lib/types";

export default function RiskCard({ risk }: { risk: RiskItem }) {
  const levelStyle =
    risk.riskLevel === "high"
      ? "bg-red-50 border-red-200 text-red-700"
      : risk.riskLevel === "medium"
        ? "bg-yellow-50 border-yellow-200 text-yellow-700"
        : "bg-green-50 border-green-200 text-green-700";

  return (
    <div className="p-4 rounded-xl border bg-white shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500">{risk.taskId}</p>
          <h3 className="font-semibold">{risk.title}</h3>
          <p className="text-sm text-gray-600 mt-1">
            Assignee: {risk.assignee} • Due: {risk.dueDate}
          </p>
        </div>

        <div className={`px-3 py-1 rounded-full border text-xs ${levelStyle}`}>
          {risk.riskLevel.toUpperCase()} ({risk.riskScore})
        </div>
      </div>

      <div className="mt-3">
        <p className="text-sm font-medium">Reasons</p>
        <ul className="list-disc ml-5 text-sm text-gray-700 mt-1">
          {risk.reasons.map((r, idx) => (
            <li key={idx}>{r}</li>
          ))}
        </ul>
      </div>

      {risk.evidence.length > 0 && (
        <div className="mt-3">
          <p className="text-sm font-medium">Evidence</p>
          {risk.evidence.map((e, idx) => (
            <div key={idx} className="mt-2 p-3 rounded-md bg-gray-50 border">
              <p className="text-xs text-gray-500">
                {e.source.toUpperCase()} •{" "}
                {new Date(e.timestamp).toLocaleString()}
              </p>
              <p className="text-sm mt-1">{e.snippet}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
