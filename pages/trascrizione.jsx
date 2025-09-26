import { useEffect, useRef, useState } from "react";
import Layout from "@/components/Layout";
import SuggestionBox from "@/components/SuggestionBox";
import ScriptKanban from "@/components/ScriptKanban";
import { transcribeBlob } from "@/lib/whisper";

export default function Trascrizione() {
  const mediaRef = useRef(null);
  const [rec, setRec] = useState(false);
  const [log, setLog] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [step, setStep] = useState(0);

  const steps = [
    { title: "Apertura & Empatia", hint: "Rompi il ghiaccio. Domanda guida sul 40% fondi non richiesti."},
    { title: "Supera Diffidenza", hint: "Presenta referenze e dati concreti."},
    { title: "Analisi & Investimenti", hint: "ATECO, soci, dimensioni, zona, capex."},
    { title: "Chiusura & Next Step", hint: "Proposta, scadenze, recall 24h prima."},
  ];

  const startRec = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRef.current = new MediaRecorder(stream);

    mediaRef.current.ondataavailable = async (e) => {
      if (e.data && e.data.size > 0) {
        const apiKey = localStorage.getItem("OPENAI_API_KEY");
        try {
          const segs = await transcribeBlob(e.data, apiKey);
          setLog(prev => [...prev, ...segs]);
          setSuggestions([
            "Proponi follow-up via mail",
            "Fissa recall 24h prima",
            "Evidenzia incentivo cumulabile"
          ]);
          // Salvataggio incrementale in localStorage
          const sessionId = "live-session";
          const store = JSON.parse(localStorage.getItem("JARVIS_SESSIONS")||"[]");
          const updated = [{ id: sessionId, items:[...(log||[]), ...segs], createdAt: new Date().toISOString() }, ...store.filter(s=>s.id!==sessionId)];
          localStorage.setItem("JARVIS_SESSIONS", JSON.stringify(updated));
        } catch (err) {
          console.error("Errore chunk:", err);
        }
      }
    };

    // Avvia con chunk ogni 5 secondi
    const cs = parseInt(localStorage.getItem("CHUNK_SIZE") || "5");
    mediaRef.current.start(cs * 1000);
    setRec(true);
  };

  const stopRec = () => {
    mediaRef.current?.stop();
    setRec(false);
  };

  return (
    <Layout>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 card">
          <div className="flex items-center gap-2 mb-3">
            <button className="btn" onClick={rec?stopRec:startRec}>{rec ? "Stop REC" : "Avvia REC"}</button>
            <span className="badge">{rec ? "Registrazione in corso (chunk)" : "Pronto"}</span>
          </div>
          <div className="space-y-2 text-sm max-h-[400px] overflow-auto">
            {log.length===0 ? <div className="text-slate-400">Nessuna trascrizione ancora.</div> :
              log.map((l,i)=>(<div key={i}><span className="text-slate-400">[{l.start}s - {l.end}s | {l.dur}s]</span> {l.text}</div>))
            }
          </div>
        </div>
        <SuggestionBox suggestions={suggestions} />
      </div>

      <div className="mt-4">
        <ScriptKanban steps={steps} current={step} onStep={setStep} />
      </div>
    </Layout>
  );
}