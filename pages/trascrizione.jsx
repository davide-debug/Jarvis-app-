
import {useEffect, useRef, useState} from "react";
import Layout from "../components/Layout";
import ScriptKanban from "../components/ScriptKanban";
import SuggestionBox from "../components/SuggestionBox";

export default function Trascrizione(){
  const [client, setClient] = useState("");
  const [clients, setClients] = useState([]);
  const [recording,setRecording]=useState(false);
  const [transcript,setTranscript]=useState("");
  const [time,setTime]=useState(0);
  const [step,setStep]=useState(1);
  const [sentiment,setSentiment]=useState("neutro");
  const [youTalkPct,setYouTalkPct]=useState(50);
  const [engagement,setEngagement]=useState(50);
  const [keywords,setKeywords]=useState([]);
  const [log,setLog]=useState([]);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const steps=[
    "Empatia e introduzione del problema",
    "Presentazione azienda e credibilità",
    "Esperienze precedenti con bandi",
    "Investimenti attuali e futuri",
    "Proposta e prossimi step",
  ];

  useEffect(()=>{
    const cs = JSON.parse(localStorage.getItem("JARVIS_CLIENTS")||"[]");
    setClients(cs);
    if(cs[0]) setClient(cs[0].name);
  },[]);

  function addClient(){
    const name = prompt("Nome cliente?");
    if(!name) return;
    const cs = JSON.parse(localStorage.getItem("JARVIS_CLIENTS")||"[]");
    if(!cs.find(c=>c.name===name)){
      cs.push({ name, history: [] });
      localStorage.setItem("JARVIS_CLIENTS", JSON.stringify(cs));
      setClients(cs);
      setClient(name);
    }
  }

  function estimateYouVsClient(text){
    const lines = text.split("\n");
    let you=0, cli=0;
    lines.forEach(l=>{
      const x=l.trim().toLowerCase();
      if(x.startsWith("tu:")) you+=l.length;
      else if(x.startsWith("cliente:")) cli+=l.length;
    });
    const tot = you+cli;
    if(tot>0) setYouTalkPct(Math.round((you/tot)*100));
  }
  function detectKeywords(text){
    const watch = ["sabatini","de minimis","credito d'imposta","formazione","digitalizzazione","garanzie"];
    const found=[]; watch.forEach(k=>{ if(text.toLowerCase().includes(k)) found.push(k); });
    setKeywords(prev=>Array.from(new Set([...(prev||[]),...found])));
  }
  function updateEngagement(){
    const sentScore = sentiment==="positivo"?85: sentiment==="neutro"?60:35;
    const clientTalkScore = 100 - Math.abs(60 - (100 - youTalkPct));
    const score = Math.max(0, Math.min(100, Math.round(0.5*sentScore + 0.5*clientTalkScore)));
    setEngagement(score);
  }
  async function analyze(snippet, currentStep){
    try{
      const key=localStorage.getItem("OPENAI_API_KEY");
      if(!key) return currentStep;
      const r1 = await fetch("https://api.openai.com/v1/chat/completions",{
        method:"POST", headers:{ "Content-Type":"application/json","Authorization":`Bearer ${key}`},
        body: JSON.stringify({ model:"gpt-4o-mini", messages:[
          {role:"system", content:"Decidi se avanzare step ('next') o restare ('stay') su uno script vendita."},
          {role:"user", content:`Step corrente ${currentStep}/${steps.length}. Testo: "${snippet}"`}
        ], temperature:0.2, max_tokens:6 })
      });
      const d1 = await r1.json();
      const out = (d1.choices?.[0]?.message?.content||"stay").toLowerCase();
      const decision = out.includes("next") && currentStep<steps.length ? "next":"stay";
      setLog(l=>[...l,{t:new Date().toLocaleTimeString(), type:"step", decision, snippet: snippet.slice(0,120)}]);
      const newStep = decision==="next"? currentStep+1: currentStep;

      const r2 = await fetch("https://api.openai.com/v1/chat/completions",{
        method:"POST", headers:{ "Content-Type":"application/json","Authorization":`Bearer ${key}`},
        body: JSON.stringify({ model:"gpt-4o-mini", messages:[
          {role:"system", content:"Classifica sentiment del cliente come 'positivo', 'neutro' o 'scettico'."},
          {role:"user", content: snippet}
        ], temperature:0.0, max_tokens:6 })
      });
      const d2 = await r2.json();
      setSentiment((d2.choices?.[0]?.message?.content||"neutro").toLowerCase());

      return newStep;
    }catch(e){
      setLog(l=>[...l,{t:new Date().toLocaleTimeString(), type:"error", decision:"stay", snippet:e.message}]);
      return currentStep;
    }
  }

  async function startRecording(){
    const stream = await navigator.mediaDevices.getUserMedia({ audio:true });
    const mr = new MediaRecorder(stream);
    mediaRecorderRef.current = mr;
    chunksRef.current=[];
    mr.ondataavailable = e=>{ if(e.data.size>0) chunksRef.current.push(e.data); };
    mr.onstop = async ()=>{
      const audioBlob = new Blob(chunksRef.current, { type:"audio/webm" });
      const form = new FormData();
      form.append("file", audioBlob, "audio.webm");
      form.append("model", "whisper-1");
      try{
        const key=localStorage.getItem("OPENAI_API_KEY");
        const res = await fetch("https://api.openai.com/v1/audio/transcriptions",{ method:"POST", headers:{ Authorization:`Bearer ${key}` }, body: form });
        const data = await res.json();
        if(data.text){
          setTranscript(p=>p+"\n"+data.text);
          const snip = data.text.slice(-400);
          estimateYouVsClient(data.text);
          detectKeywords(data.text);
          const ns = await analyze(snip, step);
          if(ns!==step) setStep(ns);
          updateEngagement();
          // save to client profile
          if(client){
            const reader = new FileReader();
            reader.onloadend = ()=>{
              const audio64 = reader.result;
              const cs = JSON.parse(localStorage.getItem("JARVIS_CLIENTS")||"[]");
              const ix = cs.findIndex(c=>c.name===client);
              if(ix>-1){
                const rec = { ts: Date.now(), transcript: data.text, sentiment, engagement, youTalkPct, keywords, step: ns };
                cs[ix].history = cs[ix].history || [];
                cs[ix].history.push(rec);
                localStorage.setItem("JARVIS_CLIENTS", JSON.stringify(cs));
              }
            };
            reader.readAsDataURL(audioBlob);
          }
        } else {
          setTranscript(p=>p+"\n[Errore API] "+JSON.stringify(data));
        }
      }catch(e){ setTranscript(p=>p+"\n[Errore rete] "+e.message); }
    };
    mr.start();
    setRecording(true);
    setTime(0);
    const timer = setInterval(()=>setTime(t=>t+1),1000);
    mr.onstop = ()=>clearInterval(timer);
  }
  function stopRecording(){
    const mr = mediaRecorderRef.current;
    if(mr && mr.state!=="inactive"){ mr.stop(); setRecording(false); }
  }

  const suggestions=[
    {id:1,text:"Concorda data e orario per il prossimo step",priority:"high"},
    {id:2,text:"Ricapitola benefici con esempi numerici",priority:"normal"},
  ];

  return (
    <Layout>
      <div className="mb-4 flex items-center gap-3">
        <label>Cliente:</label>
        <select value={client} onChange={e=>setClient(e.target.value)} className="bg-[#0d1117] border border-[#30363d] rounded p-2">
          {clients.map(c=><option key={c.name}>{c.name}</option>)}
        </select>
        <button onClick={addClient} className="bg-gray-700 px-3 py-2 rounded">+ Aggiungi</button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <ScriptKanban steps={steps} currentStep={step}/>

        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-bold mb-2">Trascrizione live</h2>
          <div className="mb-2 flex gap-2 flex-wrap">
            {!recording ? <button onClick={startRecording} className="bg-emerald-600 px-4 py-2 rounded">Inizia REC</button>
                        : <button onClick={stopRecording} className="bg-red-600 px-4 py-2 rounded">Stop</button>}
          </div>
          <div className="bg-black p-2 rounded h-64 overflow-y-auto whitespace-pre-wrap">{transcript || "La trascrizione apparirà qui..."}</div>
        </div>

        <SuggestionBox suggestions={suggestions}/>
      </div>

      <div className="grid grid-cols-5 gap-4 mt-4">
        <div className="bg-gray-800 p-4 rounded">Tempo: {time}s</div>
        <div className="bg-gray-800 p-4 rounded">Step: {step}/{steps.length}</div>
        <div className="bg-gray-800 p-4 rounded">Sentiment: {sentiment}</div>
        <div className="bg-gray-800 p-4 rounded">Tu/Cliente: {youTalkPct}% / {100-youTalkPct}%</div>
        <div className="bg-gray-800 p-4 rounded">Engagement: {engagement}</div>
      </div>
    </Layout>
  );
}
