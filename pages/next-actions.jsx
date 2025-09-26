import Layout from "../components/Layout";
import { createOutlookTask, createZohoTask } from "./lib/tasks";

const customers = [
  { name: "TCP Tuscany Chemical Production", recency: 0.8, engagement: 0.6, sentiment: 0.7, kw: 0.9 },
  { name: "Novareti SPA", recency: 0.6, engagement: 0.7, sentiment: 0.6, kw: 0.5 },
  { name: "Petronzi Progressi Marmi", recency: 0.9, engagement: 0.5, sentiment: 0.5, kw: 0.6 },
];
function score(c) { return +(c.recency + c.engagement + c.sentiment + c.kw).toFixed(2); }

export default function NextActions(){
  const ranked = [...customers].sort((a,b)=>score(b)-score(a));
  const createTasks = async (c)=>{
    const o = await createOutlookTask({ title:`Recall con ${c.name}`, due: new Date().toISOString() });
    const z = await createZohoTask({ title:`Follow-up ${c.name}`, due: new Date().toISOString() });
    alert(`Outlook: ${o.ok ? "OK" : "stub"} | Zoho: ${z.ok ? "OK" : "stub"}`);
  }
  const msConnected = typeof window !== 'undefined' && !!localStorage.getItem('MS_ACCESS_TOKEN');
  const zohoConnected = typeof window !== 'undefined' && !!localStorage.getItem('ZOHO_ACCESS_TOKEN');

  return (
    <Layout>
      <div className="text-xl font-semibold mb-3">Next Best Actions</div>
      <div className="flex gap-2 mb-3">
        <span className={`badge ${msConnected? "bg-green-700":"bg-slate-700"}`}>Outlook: {msConnected? "Connesso":"Non connesso"}</span>
        <span className={`badge ${zohoConnected? "bg-green-700":"bg-slate-700"}`}>Zoho: {zohoConnected? "Connesso":"Non connesso"}</span>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {ranked.map((c,i)=>(
          <div key={i} className="card">
            <div className="flex justify-between"><div className="font-semibold">{c.name}</div><div className="badge">Score {score(c)}</div></div>
            <div className="text-sm text-slate-300 mt-2">Azione: <b>Programma recall 24h</b></div>
            <button className="btn mt-3" onClick={()=>createTasks(c)}>Crea task</button>
          </div>
        ))}
      </div>
    </Layout>
  );
}