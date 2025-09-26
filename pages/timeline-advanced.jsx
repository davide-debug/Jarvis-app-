import Layout from "@/components/Layout";
import { useEffect, useState, useRef } from "react";

function useSessions(){
  const [sessions, setSessions] = useState([]);
  useEffect(()=>{
    const s = JSON.parse(localStorage.getItem("JARVIS_SESSIONS")||"[]");
    setSessions(s);
  },[]);
  return [sessions];
}

export default function TimelineAdvanced(){
  const [sessions] = useSessions();
  const [audioUrl, setAudioUrl] = useState(null);
  const audioRef = useRef(null);

  return (
    <Layout>
      <div className="text-xl font-semibold mb-3">Timeline avanzata</div>
      {sessions.length===0 ? <div className="card">Nessuna sessione salvata.</div> :
        <div className="grid gap-4">
          {sessions.map(s => (
            <div className="card" key={s.id}>
              <div className="flex justify-between items-center">
                <div className="font-semibold">Sessione {s.id}</div>
                <div className="badge">{new Date(s.createdAt).toLocaleString()}</div>
              </div>
              <div className="text-sm text-slate-300 mt-2 space-y-1">
                {s.items.map((l,i)=>(<div key={i}>[{l.t}s] {l.text}</div>))}
              </div>
              <div className="mt-3">
                <audio ref={audioRef} controls src={audioUrl || ""} className="w-full" />
                <div className="text-xs text-slate-400 mt-1">Player audio (demo): collega l’URL della registrazione quando disponibile.</div>
              </div>
            </div>
          ))}
        </div>}
    </Layout>
  );
}