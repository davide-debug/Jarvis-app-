import Link from "next/link";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-50 backdrop-blur border-b border-slate-800/60 bg-slate-900/40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex gap-3 flex-wrap items-center">
          <Link className="font-semibold" href="/">🤖 Jarvis 2</Link>
          <div className="flex gap-3 text-sm">
            <Link href="/trascrizione">Trascrizione</Link>
            <Link href="/timeline-advanced">Timeline</Link>
            <Link href="/reports">Report</Link>
            <Link href="/next-actions">Next Actions</Link>
            <Link href="/clients">Clienti</Link>
            <Link href="/deminimis">De Minimis</Link>
            <Link href="/settings">Impostazioni</Link>
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto p-4">{children}</main>
      <footer className="max-w-6xl mx-auto px-4 py-10 text-xs text-slate-400">
        Build {new Date().toISOString().slice(0,10)} – v11
      </footer>
    </div>
  );
}