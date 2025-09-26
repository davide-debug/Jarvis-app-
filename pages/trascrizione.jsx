
import { useState, useRef } from "react";
import Layout from "../components/Layout";

export default function Trascrizione() {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mr = new MediaRecorder(stream);
    mediaRecorderRef.current = mr;
    chunksRef.current = [];

    mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    mr.onstop = async () => {
      const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
      const formData = new FormData();
      formData.append("file", audioBlob, "audio.webm");
      formData.append("model", "whisper-1");

      try {
        const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
          method: "POST",
          headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}` },
          body: formData,
        });
        const data = await res.json();
        if (data.text) setTranscript((p) => p + "\n" + data.text);
        else setTranscript((p) => p + "\n[Errore API] " + JSON.stringify(data));
      } catch (e) {
        setTranscript((p) => p + "\n[Errore rete] " + e.message);
      }
    };

    mr.start();
    setRecording(true);
  }

  function stopRecording() {
    const mr = mediaRecorderRef.current;
    if (mr && mr.state !== "inactive") {
      mr.stop();
      setRecording(false);
    }
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Trascrizione live</h2>
        <div className="mb-4 flex gap-2">
          {!recording ? (
            <button onClick={startRecording} className="bg-emerald-600 px-4 py-2 rounded">Inizia REC</button>
          ) : (
            <button onClick={stopRecording} className="bg-red-600 px-4 py-2 rounded">Stop</button>
          )}
        </div>
        <div className="bg-black text-white p-4 rounded h-64 overflow-y-scroll whitespace-pre-wrap">
          {transcript || "La trascrizione apparira qui..."}
        </div>
      </div>
    </Layout>
  );
}
