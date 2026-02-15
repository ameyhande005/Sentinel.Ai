'use client';

import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border p-6">
      <h1 className="text-xl font-bold text-sidebar-primary mb-6">
        Pulse AI
      </h1>

      <nav className="space-y-3">
        <Link href="/dashboard">
          <div className="rounded-md px-3 py-2 hover:bg-sidebar-accent cursor-pointer">
            Dashboard
          </div>
        </Link>

        <Link href="/create-project">
          <div className="rounded-md px-3 py-2 hover:bg-sidebar-accent cursor-pointer">
            Create Project
          </div>
        </Link>

        <Link href="/profile">
          <div className="rounded-md px-3 py-2 hover:bg-sidebar-accent cursor-pointer">
            Profile
          </div>
        </Link>

        <Link href="/settings">
          <div className="rounded-md px-3 py-2 hover:bg-sidebar-accent cursor-pointer">
            Settings
          </div>
        </Link>
      </nav>
    </aside>
  );
}
