
export default function ScriptKanban({ steps, currentStep }){
  return (
    <div className="bg-gray-900 p-4 rounded-lg h-full">
      <h2 className="text-lg font-semibold mb-2">Copione</h2>
      <div className="space-y-3">
        {steps.map((s,i)=>(
          <div key={i} className={`p-3 rounded border transition ${currentStep===i+1 ? "bg-emerald-600 text-white border-emerald-400 shadow-lg":"bg-gray-800 border-gray-700"}`}>
            <strong>Step {i+1}:</strong> {s}
          </div>
        ))}
      </div>
    </div>
  );
}
