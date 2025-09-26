import Layout from "@/components/Layout";
const items = [
  { name:"TCP Tuscany Chemical Production", sentiment: "positivo", keywords:["5.0","Sabatini"], last:"2025-07-31" },
  { name:"Novareti SPA", sentiment: "neutro", keywords:["bandi","enti pubblici"], last:"2025-07-22" },
  { name:"Petronzi Progressi Marmi", sentiment: "positivo", keywords:["Sabatini","autocarro"], last:"2025-09-22" },
];
export default function Clients(){
  return (
    <Layout>
      <div className="text-xl font-semibold mb-3">Clienti</div>
      <div className="grid md:grid-cols-2 gap-4">
        {items.map((c,i)=>(
          <div key={i} className="card">
            <div className="flex justify-between"><div className="font-semibold">{c.name}</div><div className="badge">{c.sentiment}</div></div>
            <div className="text-sm text-slate-300 mt-2">Keywords: {c.keywords.join(", ")}</div>
            <div className="text-xs text-slate-400 mt-2">Ultima interazione: {c.last}</div>
          </div>
        ))}
      </div>
    </Layout>
  );
}