
import {useEffect, useState} from "react";
import Layout from "../components/Layout";

export default function Clients(){
  const [clients,setClients]=useState([]);
  useEffect(()=>{
    const cs = JSON.parse(localStorage.getItem("JARVIS_CLIENTS")||"[]");
    setClients(cs);
  },[]);

  return (
    <Layout>
      <h2 className="text-xl font-bold mb-4">Clienti</h2>
      {!clients.length && <p className="text-gray-400">Nessun cliente ancora.</p>}
      <div className="space-y-4">
        {clients.map(c=>(
          <div key={c.name} className="bg-gray-800 p-4 rounded">
            <div className="font-semibold text-lg">{c.name}</div>
            <div className="text-sm text-gray-400">Interazioni: {c.history?.length||0}</div>
            {c.history?.slice(-3).reverse().map((h,i)=>(
              <div key={i} className="mt-2 p-2 bg-[#0d1117] rounded border border-[#30363d] text-sm">
                <div>{new Date(h.ts).toLocaleString()} — Sentiment: {h.sentiment} — Engagement: {h.engagement}</div>
                <div className="text-gray-400">Keywords: {(h.keywords||[]).join(", ")||"-"}</div>
                <details className="mt-1">
                  <summary className="cursor-pointer">Trascrizione (estratto)</summary>
                  <div className="mt-1 text-gray-300">{h.transcript.slice(0,400)}...</div>
                </details>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Layout>
  );
}
