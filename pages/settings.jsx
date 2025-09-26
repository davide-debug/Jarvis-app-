import { useState, useEffect } from "react";
import Layout from "../components/Layout";

export default function Settings() {
  const [apiKey, setApiKey] = useState("");
  const [chunkSize, setChunkSize] = useState(5);
  const [supabaseUrl, setSupabaseUrl] = useState("");
  const [supabaseAnon, setSupabaseAnon] = useState("");
  const [msClientId, setMsClientId] = useState("");
  const [msTenantId, setMsTenantId] = useState("");
  const [zohoClientId, setZohoClientId] = useState("");
  const [zohoClientSecret, setZohoClientSecret] = useState("");

  useEffect(()=>{
    setApiKey(localStorage.getItem("OPENAI_API_KEY") || "");
    setChunkSize(parseInt(localStorage.getItem("CHUNK_SIZE") || "5"));
    setSupabaseUrl(localStorage.getItem("SUPABASE_URL") || "");
    setSupabaseAnon(localStorage.getItem("SUPABASE_ANON_KEY") || "");
    setMsClientId(localStorage.getItem("MS_CLIENT_ID") || "");
    setMsTenantId(localStorage.getItem("MS_TENANT_ID") || "");
    setZohoClientId(localStorage.getItem("ZOHO_CLIENT_ID") || "");
    setZohoClientSecret(localStorage.getItem("ZOHO_CLIENT_SECRET") || "");
  },[]);

  const save = ()=>{
    localStorage.setItem("OPENAI_API_KEY", apiKey.trim());
    localStorage.setItem("CHUNK_SIZE", String(chunkSize));
    localStorage.setItem("SUPABASE_URL", supabaseUrl.trim());
    localStorage.setItem("SUPABASE_ANON_KEY", supabaseAnon.trim());
    localStorage.setItem("MS_CLIENT_ID", msClientId.trim());
    localStorage.setItem("MS_TENANT_ID", msTenantId.trim());
    localStorage.setItem("ZOHO_CLIENT_ID", zohoClientId.trim());
    localStorage.setItem("ZOHO_CLIENT_SECRET", zohoClientSecret.trim());
    alert("Impostazioni salvate ✅");
  }

  const connectOutlook = async ()=>{
    window.open("/api/outlook/auth", "_blank");
  };
  const connectZoho = async ()=>{
    window.open("/api/zoho/auth", "_blank");
  };

  return (
    <Layout>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card space-y-4">
          <div className="text-xl font-semibold">Base</div>
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
          <button className="btn" onClick={save}>Salva</button>
        </div>

        <div className="card space-y-4">
          <div className="text-xl font-semibold">Supabase</div>
          <div>
            <label className="text-sm">SUPABASE URL</label>
            <input className="input mt-1" value={supabaseUrl} onChange={e=>setSupabaseUrl(e.target.value)} placeholder="https://xxxx.supabase.co" />
          </div>
          <div>
            <label className="text-sm">SUPABASE ANON KEY</label>
            <input className="input mt-1" value={supabaseAnon} onChange={e=>setSupabaseAnon(e.target.value)} placeholder="eyJhbGciOi..." />
          </div>
          <button className="btn" onClick={save}>Salva</button>
        </div>

        <div className="card space-y-4">
          <div className="text-xl font-semibold">Outlook (Microsoft Graph)</div>
          <div className="grid md:grid-cols-2 gap-2">
            <div>
              <label className="text-sm">MS Client ID</label>
              <input className="input mt-1" value={msClientId} onChange={e=>setMsClientId(e.target.value)} placeholder="app guid" />
            </div>
            <div>
              <label className="text-sm">MS Tenant ID</label>
              <input className="input mt-1" value={msTenantId} onChange={e=>setMsTenantId(e.target.value)} placeholder="common o tenant guid" />
            </div>
          </div>
          <button className="btn" onClick={connectOutlook}>Connetti Outlook</button>
        </div>

        <div className="card space-y-4">
          <div className="text-xl font-semibold">Zoho Bigin</div>
          <div className="grid md:grid-cols-2 gap-2">
            <div>
              <label className="text-sm">Zoho Client ID</label>
              <input className="input mt-1" value={zohoClientId} onChange={e=>setZohoClientId(e.target.value)} placeholder="client id" />
            </div>
            <div>
              <label className="text-sm">Zoho Client Secret</label>
              <input className="input mt-1" value={zohoClientSecret} onChange={e=>setZohoClientSecret(e.target.value)} placeholder="client secret" />
            </div>
          </div>
          <button className="btn" onClick={connectZoho}>Connetti Zoho Bigin</button>
        </div>
      </div>
    </Layout>
  );
}