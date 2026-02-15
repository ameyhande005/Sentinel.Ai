export default function Page() {
  return (
    <div className="min-h-screen bg-slate-100 flex">

      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-100 p-6">
        <h2 className="text-2xl font-bold text-indigo-400">Pulse AI</h2>

        <nav className="mt-8 space-y-3 text-sm">
          <a href="/dashboard" className="block text-indigo-400 font-medium">
            Dashboard
          </a>
          <a href="/summary" className="block hover:text-indigo-300 transition">
            Summary
          </a>
          <a href="/risks" className="block hover:text-indigo-300 transition">
            Risks
          </a>
          <a href="/settings" className="block hover:text-indigo-300 transition">
            Settings
          </a>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 bg-slate-100">
        <h1 className="text-3xl font-semibold text-slate-800">
          Project Overview
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Card title="Active Tasks" value="24" />
          <Card title="Blocked Tasks" value="3" />
          <Card title="Delivery Risk" value="Medium" />
        </div>
      </main>
    </div>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6 border border-slate-200">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="text-2xl font-bold text-slate-800 mt-2">{value}</p>
    </div>
  );
}