export default function ScriptKanban({ steps = [], current = 0, onStep }) {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {steps.map((s, i) => (
        <div key={i} className={`card ${i === current ? "ring-2 ring-sky-500" : ""}`}>
          <div className="text-sm opacity-70">Step {i+1}</div>
          <div className="font-semibold">{s.title}</div>
          <p className="text-sm text-slate-300 mt-2">{s.hint}</p>
          {s.keywords && <p className="text-xs text-slate-400 mt-1">Keywords: {s.keywords.join(", ")}</p>}
          <button className="btn mt-3" onClick={() => onStep?.(i)}>Vai</button>
        </div>
      ))}
    </div>
  );
}