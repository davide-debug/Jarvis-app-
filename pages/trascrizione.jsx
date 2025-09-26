import { useEffect, useRef, useState } from "react";
import Layout from "@/components/Layout";
import SuggestionBox from "@/components/SuggestionBox";
import ScriptKanban from "@/components/ScriptKanban";
import { transcribeBlob } from "@/lib/whisper";

export default function Trascrizione() {
  const mediaRef = useRef(null);
  const chunks = useRef([]);
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
    chunks.current = [];
    mediaRef.current.ondataavailable = e => chunks.current.push(e.data);
    mediaRef.current.onstop = async () => {
      const blob = new Blob(chunks.current, { type: "audio/webm" });
      const apiKey = localStorage.getItem("OPENAI_API_KEY");
      try {
        const items = await transcribeBlob(blob, apiKey);
        const sessionId = Date.now();
        const session = { id: sessionId, items, createdAt: new Date().toISOString() };
        const store = JSON.parse(localStorage.getItem("JARVIS_SESSIONS")||"[]");
        localStorage.setItem("JARVIS_SESSIONS", JSON.stringify([session, ...store]));
        setLog(items);
        setSuggestions(["Proponi follow-up via mail", "Fissa recall 24h prima", "Evidenzia incentivo cumulabile"]);
      } catch (e) {
        alert(e.message);
      }
    };
    mediaRef.current.start();
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
            <span className="badge">{rec ? "Registrazione..." : "Pronto"}</span>
          </div>
          <div className="space-y-2 text-sm">
            {log.length===0 ? <div className="text-slate-400">Nessuna trascrizione ancora.</div> :
              log.map((l,i)=>(<div key={i}><span className="text-slate-400">[{l.t}s]</span> {l.text}</div>))
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