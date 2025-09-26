export default function SuggestionBox({ suggestions = [] }) {
  return (
    <div className="card">
      <div className="font-semibold mb-2">Suggerimenti Live</div>
      <ul className="list-disc ml-6 space-y-1">
        {suggestions.map((s,i)=>(<li key={i} className="text-sm">{s}</li>))}
      </ul>
    </div>
  );
}