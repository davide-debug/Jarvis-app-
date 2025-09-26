import { useState } from "react";
import Layout from "../components/Layout";
import DealCard from "../components/DealCard";

const STAGES = ["Prospect", "Qualifica", "Proposta", "Negoziazione", "Chiusura"];
const seedDeals = [
  { id: "d1", name: "SITIS SRL", value: "€18.5k", stage: "Qualifica", iic: 82, last: "2g fa", next: "Invia proposta", owner: "Tu" },
  { id: "d2", name: "Albergo Belvedere", value: "€42k", stage: "Proposta", iic: 88, last: "1g fa", next: "Follow-up 24h", owner: "Tu" }
];

export default function CrmKanban() {
  const [deals, setDeals] = useState(seedDeals);

  function onDragStart(e, id) {
    e.dataTransfer.setData("text/plain", id);
  }

  function onDrop(e, stage) {
    const id = e.dataTransfer.getData("text/plain");
    setDeals(prev => prev.map(d => (d.id === id ? { ...d, stage } : d)));
  }

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {STAGES.map(stage => (
          <div
            key={stage}
            className="bg-[#0f1620] rounded-2xl border border-[#30363d] p-3"
            onDragOver={e => e.preventDefault()}
            onDrop={e => onDrop(e, stage)}
          >
            <div className="font-semibold mb-3">{stage}</div>
            {deals.filter(d => d.stage === stage).map(deal => (
              <DealCard key={deal.id} deal={deal} onDragStart={onDragStart} />
            ))}
          </div>
        ))}
      </div>
    </Layout>
  );
}