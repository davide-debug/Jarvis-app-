
import Layout from "../components/Layout";
import DealCard from "../components/DealCard";

const mockDeals = [
  { id: "1", name: "SITIS SRL", value: "€18.5k", iic: 82, last: "2g fa", owner: "Tu", next: "Invia proposta" },
  { id: "2", name: "Albergo Belvedere", value: "€42k", iic: 65, last: "1g fa", owner: "Tu", next: "Follow-up 24h" }
];

export default function CrmKanban() {
  return (
    <Layout>
      <h2 className="text-xl font-bold mb-4">CRM Kanban</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 p-4 rounded">
          <h3 className="font-semibold mb-2">Nuovi</h3>
          {mockDeals.map((d) => (
            <DealCard key={d.id} deal={d} onDragStart={() => {}} />
          ))}
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <h3 className="font-semibold mb-2">In corso</h3>
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <h3 className="font-semibold mb-2">Chiusura</h3>
        </div>
      </div>
    </Layout>
  );
}
