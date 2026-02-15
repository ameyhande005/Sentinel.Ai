import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-slate-100 p-6">
      <h2 className="text-2xl font-bold text-indigo-400">Pulse AI</h2>

      <nav className="mt-8 space-y-3 text-sm">
        <Link href="/dashboard" className="block hover:text-indigo-300">
          Dashboard
        </Link>

        <Link href="/summary" className="block hover:text-indigo-300">
          Summary
        </Link>

        <Link href="/risks" className="block hover:text-indigo-300">
          Risks
        </Link>

        <Link href="/settings" className="block hover:text-indigo-300">
          Settings
        </Link>
      </nav>
    </aside>
  );
}
