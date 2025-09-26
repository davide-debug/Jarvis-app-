import { useState, useEffect } from "react";
import Layout from "@/components/Layout";

export default function Settings() {
  const [apiKey, setApiKey] = useState("");

  useEffect(()=>{
    const k = localStorage.getItem("OPENAI_API_KEY") || "";
    setApiKey(k);
  },[]);

  const save = ()=>{
    localStorage.setItem("OPENAI_API_KEY", apiKey.trim());
    alert("API Key salvata in locale ✅");
  }

  return (
    <Layout>
      <div className="max-w-xl card">
        <div className="text-xl font-semibold mb-4">Impostazioni</div>
        <label className="text-sm">OpenAI API Key</label>
        <input className="input mt-1" value={apiKey} onChange={e=>setApiKey(e.target.value)} placeholder="sk-..." />
        <button className="btn mt-4" onClick={save}>Salva</button>
        <p className="text-xs text-slate-400 mt-4">La chiave resta solo nel tuo browser (localStorage).</p>
      </div>
    </Layout>
  );
}