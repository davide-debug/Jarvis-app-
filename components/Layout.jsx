
import Link from "next/link";
export default function Layout({ children }){
  return (
    <div className="flex min-h-screen bg-[#0d1117] text-white">
      <aside className="w-64 bg-[#161b22] p-4 border-r border-[#30363d]">
        <h1 className="text-xl font-bold mb-6">Jarvis v9</h1>
        <nav className="space-y-3 text-sm">
          <Link href="/trascrizione" className="block hover:text-emerald-400">Trascrizione</Link>
          <Link href="/next-actions" className="block hover:text-emerald-400">Next Best Actions</Link>
          <Link href="/clients" className="block hover:text-emerald-400">Clienti</Link>
          <Link href="/settings" className="block hover:text-emerald-400">Impostazioni</Link>
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
