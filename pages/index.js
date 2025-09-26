import Layout from "@/components/Layout";

export default function Home() {
  return (
    <Layout>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <h1 className="text-2xl font-bold mb-2">Benvenuto in Jarvis 2</h1>
          <p className="text-slate-300">Trascrivi call, segui il copione, genera follow-up, timeline e report.</p>
        </div>
        <div className="card">
          <div className="font-semibold mb-2">Getting Started</div>
          <ol className="list-decimal ml-6 text-sm space-y-1">
            <li>Vai su <b>Impostazioni</b> e inserisci la tua OpenAI API Key</li>
            <li>Apri <b>Trascrizione</b> e avvia REC</li>
            <li>Controlla <b>Timeline</b> e <b>Report</b></li>
          </ol>
        </div>
      </div>
    </Layout>
  );
}