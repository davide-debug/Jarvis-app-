import Layout from "../components/Layout";
import DealCard from "../components/DealCard";

const mockDeals = [
  { id: 1, name: "Cliente A", value: "€20k", iic: 75, last: "10 giorni fa", owner: "Davide", next: "Invio preventivo" },
  { id: 2, name: "Cliente B", value: "€50k", iic: 40, last: "20 giorni fa", owner: "Marco", next: "Recall" }
];

export default function CrmKanban() {
  return (
    <Layout>
      <h2 className="text-xl font-bold mb-4">CRM Kanban</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-800 p-4 rounded">
          <h3 className="font-semibold mb-2">Nuovi</h3>
          {mockDeals.map((d) => (
            <DealCard key={d.id} deal={d} onDragStart={() => {}} />
          ))}
        </div>
      </div>
    </Layout>
  );
}