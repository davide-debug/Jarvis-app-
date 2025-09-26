import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { getSupabase } from "../lib/supabase";

export default function TimelineAdvanced(){
  const [sessions, setSessions] = useState([]);

  useEffect(()=>{
    const load = async ()=>{
      const sb = getSupabase();
      if (sb) {
        const { data, error } = await sb.from("calls").select("id, created_at, duration, transcript, segments ( start_sec, end_sec, text )").order("created_at", { ascending: false });
        if (!error && data) { setSessions(data); return; }
      }
      // fallback localStorage
      const s = JSON.parse(localStorage.getItem("JARVIS_SESSIONS")||"[]");
      setSessions(s.map(x=>({ id:x.id, created_at:x.createdAt, duration: x.items?.at(-1)?.end ?? 0, segments: x.items?.map(i=>({start_sec:i.start,end_sec:i.end,text:i.text})) || [] })));
    };
    load();
  },[]);

  return (
    <Layout>
      <div className="text-xl font-semibold mb-3">Timeline avanzata</div>
      {sessions.length===0 ? <div className="card">Nessuna sessione salvata.</div> :
        <div className="grid gap-4">
          {sessions.map(s => (
            <div className="card" key={s.id}>
              <div className="flex justify-between items-center">
                <div className="font-semibold">Sessione {s.id}</div>
                <div className="badge">{new Date(s.created_at).toLocaleString()}</div>
              </div>
              <div className="text-sm text-slate-300 mt-2 space-y-1">
                {(s.segments||[]).map((l,i)=>(<div key={i}>[{l.start_sec??0}s - {l.end_sec??0}s] {l.text}</div>))}
              </div>
            </div>
          ))}
        </div>}
    </Layout>
  );
}