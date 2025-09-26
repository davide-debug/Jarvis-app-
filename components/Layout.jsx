import Link from "next/link";

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#0d1117] text-white">
      <aside className="w-56 bg-[#161b22] p-4 border-r border-[#30363d]">
        <h1 className="text-lg font-bold mb-6">Jarvis</h1>
        <nav className="space-y-3">
          <Link href="/" className="block hover:text-emerald-400">🎙️ Trascrizione</Link>
          <Link href="/crm-kanban" className="block hover:text-emerald-400">📊 CRM Kanban</Link>
          <Link href="/recall-mail" className="block hover:text-emerald-400">📧 Mail Recall</Link>
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}