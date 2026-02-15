import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import SummaryCard from "@/components/SummaryCard";
import { mockSummary } from "@/lib/mock";

export default function SummariesPage() {
  return (
    <div className="flex bg-slate-100 min-h-screen">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <main className="p-6">
          <h2 className="text-xl font-semibold text-slate-800">
            AI Summaries
          </h2>

          <p className="text-sm text-slate-600 mt-1">
            Auto-generated digests (no manual reporting).
          </p>

          <div className="mt-6">
            <SummaryCard summary={mockSummary} />
          </div>
        </main>
      </div>
    </div>
  );
}