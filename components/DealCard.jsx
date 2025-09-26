export default function DealCard({ deal, onDragStart }) {
  function handleMail() {
    window.location.href = `mailto:commerciale@${deal.name
      .replace(/\s+/g, "")
      .toLowerCase()}.it?subject=Recall%20Appuntamento%20con%20${deal.name}`;
  }

  function handleWhatsApp() {
    window.open(
      `https://wa.me/390000000000?text=Ciao%20${deal.name},%20volevo%20aggiornarti%20su%20...`,
      "_blank"
    );
  }

  function handleCall() {
    window.location.href = "tel:+390000000000";
  }

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, deal.id)}
      className="rounded-xl bg-[#161b22] border border-[#30363d] p-3 hover:border-[#58a6ff] transition"
    >
      <div className="flex items-start justify-between">
        <div className="font-semibold">{deal.name}</div>
        <div className="text-sm text-gray-300">{deal.value}</div>
      </div>

      <div className="mt-2">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>IIC</span>
          <span>{deal.iic}</span>
        </div>
        <div className="w-full h-2 bg-[#0d1117] rounded mt-1">
          <div
            className={`h-2 rounded ${iicColor(deal.iic)}`}
            style={{ width: `${deal.iic}%` }}
          />
        </div>
      </div>

      <div className="mt-3 text-xs text-gray-400 flex items-center justify-between">
        <span>Ultimo: {deal.last}</span>
        <span className="px-2 py-0.5 bg-[#0d1117] rounded border border-[#30363d]">
          {deal.owner}
        </span>
      </div>

      <div className="mt-2 text-sm">
        <span className="text-gray-400">Next:</span>{" "}
        <span className="font-medium">{deal.next}</span>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          onClick={handleMail}
          className="text-xs px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500"
        >
          Mail
        </button>
        <button
          onClick={handleWhatsApp}
          className="text-xs px-2 py-1 rounded bg-emerald-700 hover:bg-emerald-600"
        >
          WhatsApp
        </button>
        <button
          onClick={handleCall}
          className="text-xs px-2 py-1 rounded bg-emerald-800 hover:bg-emerald-700"
        >
          Chiama
        </button>
      </div>
    </div>
  );
}

function iicColor(val) {
  if (val >= 80) return "bg-green-500";
  if (val >= 60) return "bg-yellow-500";
  return "bg-red-500";
}