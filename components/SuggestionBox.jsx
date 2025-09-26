export default function SuggestionBox({ suggestions }) {
  return (
    <div className="bg-gray-900 p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-2">Suggerimenti</h2>
      <ul className="space-y-2">
        {suggestions.map((s) => (
          <li
            key={s.id}
            className={`p-2 rounded ${s.priority === "high" ? "bg-red-600 animate-pulse text-white" : "bg-gray-700"}`}
          >
            {s.text}
          </li>
        ))}
      </ul>
    </div>
  );
}