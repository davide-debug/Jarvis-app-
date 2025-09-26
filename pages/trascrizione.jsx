import { useEffect, useRef, useState } from "react";
import Layout from "./components/Layout";
import SuggestionBox from "./components/SuggestionBox";
import ScriptKanban from "./components/ScriptKanban";
import { transcribeBlob } from "./lib/whisper";
import { getSupabase } from "./lib/supabase";

export default function Trascrizione() {
  const mediaRef = useRef(null);
  const streamRef = useRef(null);
  const [rec, setRec] = useState(false);
  const [log, setLog] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [step, setStep] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [duration, setDuration] = useState(0);
  const [words, setWords] = useState(0);
  const [sentiment, setSentiment] = useState("neutro");
  const [objections, setObjections] = useState(0);
  const [callId, setCallId] = useState(null);

  const steps = [
    { title: "Apertura & Empatia", hint: "Rompi il ghiaccio. Domanda guida sul 40% fondi non richiesti.", keywords:["perché","fondi","non richiesti"]},
    { title: "Supera Diffidenza", hint: "Presenta referenze e dati concreti.", keywords:["fiducia","garanzia","referenze"]},
    { title: "Analisi & Investimenti", hint: "ATECO, soci, dimensioni, zona, capex.", keywords:["investimenti","ATECO","macchinari","zona"]},
    { title: "Chiusura & Next Step", hint: "Proposta, scadenze, recall 24h prima.", keywords:["proposta","scadenza","firma","recall"]},
  ];

  const analyzeKPI = (text) => {
    const tokens = text.toLowerCase().split(/\s+/);
    setWords(prev => prev + tokens.length);
    if(text.match(/troppo caro|non funziona|problema/)) setObjections(o=>o+1);
    if(text.match(/bene|buono|ottimo/)) setSentiment("positivo");
    if(text.match(/male|non va/)) setSentiment("negativo");
  };
  const detectStep = (text) => {
    const lower = text.toLowerCase();
    steps.forEach((s,i)=>{ if(s.keywords && s.keywords.some(k=>lower.includes(k.toLowerCase()))) setStep(i); });
  };

  const startRec = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;
    mediaRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus', audioBitsPerSecond: 24000 });

    const cs = parseInt(localStorage.getItem("CHUNK_SIZE") || "5");
    setCountdown(cs); setStartTime(Date.now());
    const interval = setInterval(()=>{
      if(!rec) { clearInterval(interval); return; }
      setCountdown(c=>c>0?c-1:cs);
      setDuration(Math.floor((Date.now()-startTime)/1000));
    },1000);

    const sb = getSupabase();
    if (sb) {
      const { data, error } = await sb.from("calls").insert([{ client_id: null, duration: 0, words: 0, sentiment: "neutro", objections: 0, transcript: "" }]).select().single();
      if (!error && data) setCallId(data.id);
    }

    mediaRef.current.ondataavailable = async (e) => {
      if (e.data && e.data.size > 0) {
        const apiKey = localStorage.getItem("OPENAI_API_KEY");
        try {
          const segs = await transcribeBlob(e.data, apiKey);
          setLog(prev => [...prev, ...segs]);
          segs.forEach(s=>{ analyzeKPI(s.text); detectStep(s.text); });
          setSuggestions(["Proponi follow-up via mail","Fissa recall 24h prima","Evidenzia incentivo cumulabile"]);

          const sessionId = "live-session";
          const store = JSON.parse(localStorage.getItem("JARVIS_SESSIONS")||"[]");
          const updated = [{ id: sessionId, items:[...(log||[]), ...segs], createdAt: new Date().toISOString() }, ...store.filter(s=>s.id!==sessionId)];
          localStorage.setItem("JARVIS_SESSIONS", JSON.stringify(updated));

          const sb2 = getSupabase();
          if (sb2 && callId) {
            const segments = segs.map(s => ({ call_id: callId, start_sec: s.start, end_sec: s.end, text: s.text }));
            await sb2.from("segments").insert(segments);
            const newDuration = segs[segs.length-1].end;
            const aggText = segs.map(s=>s.text).join(" ");
            await sb2.from("calls").update({ duration: newDuration, words, sentiment, objections, transcript: (log.map(s=>s.text).join(" ") + " " + aggText).trim() }).eq("id", callId);
          }
        } catch (err) { console.error("Errore chunk:", err); }
      }
    };

    mediaRef.current.start(cs*1000);
    setRec(true);
  };

  const stopRec = () => {
    mediaRef.current?.stop();
    streamRef.current?.getTracks().forEach(t=>t.stop());
    setRec(false);
  };

  return (
    <Layout>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 card">
          <div className="flex items-center gap-3 mb-3">
            <button className="btn" onClick={rec?stopRec:startRec}>{rec ? "Stop REC" : "Avvia REC"}</button>
            <span className="badge">{rec ? `REC... prossimo invio in ${countdown}s` : "Pronto"}</span>
          </div>
          <div className="space-y-2 text-sm max-h-[400px] overflow-auto">
            {log.length===0 ? <div className="text-slate-400">Nessuna trascrizione ancora.</div> :
              log.map((l,i)=>(<div key={i}><span className="text-slate-400">[{l.start}s - {l.end}s | {l.dur ?? (l.end-l.start)}s]</span> {l.text}</div>))
            }
          </div>
        </div>
        <div className="space-y-4">
          <SuggestionBox suggestions={suggestions} />
          <div className="card text-sm space-y-1">
            <div className="font-semibold mb-1">KPI Live</div>
            <div>⏱️ Durata: {duration}s</div>
            <div>📝 Parole: {words}</div>
            <div>😊 Sentiment: {sentiment}</div>
            <div>❗ Obiezioni: {objections}</div>
            <div className="text-xs text-slate-400">Call ID: {callId || "local only"}</div>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <ScriptKanban steps={steps} current={step} onStep={setStep} />
      </div>
    </Layout>
  );
}