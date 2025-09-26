import { useState, useEffect } from "react";
import Layout from "@/components/Layout";

export default function Settings() {
  const [apiKey, setApiKey] = useState("");
  const [chunkSize, setChunkSize] = useState(5);

  useEffect(()=>{
    const k = localStorage.getItem("OPENAI_API_KEY") || "";
    setApiKey(k);
    const cs = localStorage.getItem("CHUNK_SIZE") || "5";
    setChunkSize(parseInt(cs));
  },[]);

  const save = ()=>{
    localStorage.setItem("OPENAI_API_KEY", apiKey.trim());
    localStorage.setItem("CHUNK_SIZE", String(chunkSize));
    alert("Impostazioni salvate ✅");
  }

  return (
    <Layout>
      <div className="max-w-xl card space-y-4">
        <div className="text-xl font-semibold">Impostazioni</div>

        <div>
          <label className="text-sm">OpenAI API Key</label>
          <input className="input mt-1" value={apiKey} onChange={e=>setApiKey(e.target.value)} placeholder="sk-..." />
        </div>

        <div>
          <label className="text-sm">Chunk size (secondi)</label>
          <input className="input mt-1" type="number" min="1" max="60"
            value={chunkSize} onChange={e=>setChunkSize(e.target.value)} />
          <p className="text-xs text-slate-400 mt-1">Ogni quanti secondi inviare un pacchetto audio a Whisper.</p>
        </div>

        <button className="btn mt-4" onClick={save}>Salva</button>
      </div>
    </Layout>
  );
}