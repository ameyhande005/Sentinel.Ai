import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import RiskCard from "@/components/RiskCard";
import { mockRisks } from "@/lib/mock";

export default function RisksPage() {
  const blocked = mockRisks.filter((r) => r.status === "blocked");
  const atRisk = mockRisks.filter((r) => r.status === "at_risk");

  return (
    <div className="flex bg-slate-100 min-h-screen">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <main className="p-6 bg-slate-100">
          <h2 className="text-xl font-semibold text-slate-800">
            Risks Board
          </h2>

          <p className="text-sm text-slate-600 mt-1">
            Explainable risks from deterministic rules + AI extracted signals.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div>
              <h3 className="font-semibold text-slate-700 mb-3">
                Blocked
              </h3>
              <div className="flex flex-col gap-4">
                {blocked.map((r) => (
                  <RiskCard key={r.id} risk={r} />
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-700 mb-3">
                At Risk
              </h3>
              <div className="flex flex-col gap-4">
                {atRisk.map((r) => (
                  <RiskCard key={r.id} risk={r} />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
