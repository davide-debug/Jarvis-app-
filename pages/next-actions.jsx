
import {useEffect, useMemo, useState} from "react";
import Layout from "../components/Layout";

function scoreClient(c){
  // Heuristic score: recent interaction recency + avg engagement + sentiment bonus + keyword bonus
  if(!c.history || !c.history.length) return 0;
  const last = c.history[c.history.length-1];
  const now = Date.now();
  const days = (now - last.ts)/(1000*60*60*24);
  const recency = Math.max(0, 100 - Math.min(100, Math.round(days*10))); // 0-100
  const avgEng = Math.round(c.history.reduce((a,b)=>a+(b.engagement||50),0)/c.history.length);
  const sentBonus = last.sentiment==="positivo"? +10 : last.sentiment==="scettico"? -10 : 0;
  const kwBonus = (last.keywords||[]).length * 2;
  return Math.max(0, Math.min(100, Math.round(0.4*avgEng + 0.4*recency + 0.2*(50+sentBonus+kwBonus))));
}

export default function NextActions(){
  const [clients, setClients] = useState([]);

  useEffect(()=>{
    const cs = JSON.parse(localStorage.getItem("JARVIS_CLIENTS")||"[]");
    setClients(cs);
  },[]);

  const ranked = useMemo(()=>{
    return [...clients].map(c=>({ ...c, score: scoreClient(c) })).sort((a,b)=>b.score-a.score);
  },[clients]);

  function nextAction(c){
    const last = c.history?.[c.history.length-1];
    if(!last) return "Nessuna azione suggerita.";
    if(last.sentiment==="positivo" && last.engagement>70) return "Invia proposta commerciale entro 24h e fissa call di follow-up.";
    if(last.sentiment==="neutro") return "Invia case study + richiedi disponibilità per approfondimento.";
    if(last.sentiment==="scettico") return "Prepara risposte alle obiezioni e prova un re-contact breve tra 3-5 giorni.";
    return "Invia follow-up standard e monitora aperture.";
  }

  return (
    <Layout>
      <h2 className="text-xl font-bold mb-4">Next Best Actions</h2>
      {!ranked.length && <p className="text-gray-400">Nessun cliente ancora inserito.</p>}
      <div className="space-y-3">
        {ranked.map(c=>(
          <div key={c.name} className="bg-gray-800 p-4 rounded border border-[#30363d]">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-lg">{c.name}</div>
                <div className="text-sm text-gray-400">Score: {c.score}</div>
                <div className="text-sm text-gray-400">Ultimo sentiment: {c.history?.[c.history.length-1]?.sentiment || "-"}</div>
              </div>
              <div className="text-right max-w-xl text-sm">{nextAction(c)}</div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
