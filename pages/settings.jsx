
import {useEffect,useState} from "react";
import Layout from "../components/Layout";
export default function Settings(){
  const [apiKey,setApiKey]=useState("");
  useEffect(()=>{ const k=localStorage.getItem("OPENAI_API_KEY"); if(k) setApiKey(k); },[]);
  function save(){ localStorage.setItem("OPENAI_API_KEY", apiKey); alert("Salvato!"); }
  return (
    <Layout>
      <div className="max-w-lg bg-gray-800 p-6 rounded">
        <h2 className="text-xl font-bold mb-3">Impostazioni</h2>
        <label className="block mb-1">OpenAI API Key</label>
        <input type="password" value={apiKey} onChange={e=>setApiKey(e.target.value)} className="w-full p-2 rounded bg-[#0d1117] border border-[#30363d]" />
        <button onClick={save} className="mt-3 bg-emerald-600 px-4 py-2 rounded">Salva</button>
      </div>
    </Layout>
  );
}
