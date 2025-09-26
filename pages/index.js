import { useState } from "react";
import Layout from "../components/Layout";
import SuggestionBox from "../components/SuggestionBox";

export default function Home() {
  const [transcript, setTranscript] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  function addSuggestion(text, priority = "normal") {
    const newSugg = { id: Date.now(), text, priority };
    setSuggestions((prev) => [...prev, newSugg]);
    if (priority === "high") playBeep();
  }

  return (
    <Layout>
      <div className="flex gap-6">
        <div className="flex-1">
          <h2 className="text-lg font-semibold mb-2">Trascrizione live</h2>
          <button
            onClick={() => {
              setTranscript((prev) => prev + "\n[Demo trascrizione: Cliente parla di budget]");
              addSuggestion("Parlano di budget: chiedi disponibilità", "high");
            }}
            className="bg-green-600 px-4 py-2 rounded hover:bg-green-500"
          >
            ▶️ Simula Trascrizione
          </button>
          <pre className="bg-gray-800 p-4 rounded-lg mt-4 whitespace-pre-wrap">
            {transcript}
          </pre>
        </div>
        <div className="w-80">
          <SuggestionBox suggestions={suggestions} />
        </div>
      </div>
    </Layout>
  );
}

function playBeep() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(880, ctx.currentTime);
  gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  oscillator.start();
  oscillator.stop(ctx.currentTime + 0.2);
}