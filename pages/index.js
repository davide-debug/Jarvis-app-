import Layout from "./components/Layout";
export default function Home() {
  return (
    <Layout>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <h1 className="text-2xl font-bold mb-2">Benvenuto in Jarvis 2 – v13</h1>
          <p className="text-slate-300">Trascrivi call in chunk Opus 24kbps, salva in Supabase, genera task Outlook/Zoho.</p>
        </div>
        <div className="card">
          <div className="font-semibold mb-2">Getting Started</div>
          <ol className="list-decimal ml-6 text-sm space-y-1">
            <li>Impostazioni → inserisci OpenAI Key, Supabase URL+Anon</li>
            <li>Trascrizione → Avvia REC</li>
            <li>Timeline/Report → vedi storico dal DB</li>
          </ol>
        </div>
      </div>
    </Layout>
  );
}