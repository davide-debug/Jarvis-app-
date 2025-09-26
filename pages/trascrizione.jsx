import { useState } from "react";
import Layout from "../components/Layout";

export default function Trascrizione() {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");

  let mediaRecorder;
  let audioChunks = [];

  async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (e) => {
      audioChunks.push(e.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      const formData = new FormData();
      formData.append("file", audioBlob, "audio.webm");
      formData.append("model", "whisper-1");

      try {
        const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
          },
          body: formData,
        });
        const data = await response.json();
        setTranscript((prev) => prev + "\n" + data.text);
      } catch (error) {
        console.error("Errore trascrizione:", error);
      }

      audioChunks = [];
    };

    mediaRecorder.start();
    setRecording(true);
  }

  function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      setRecording(false);
    }
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Trascrizione live</h2>
        <div className="mb-4 flex gap-2">
          {!recording ? (
            <button
              onClick={startRecording}
              className="bg-emerald-600 px-4 py-2 rounded"
            >
              Inizia REC
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="bg-red-600 px-4 py-2 rounded"
            >
              Stop
            </button>
          )}
        </div>
        <div className="bg-black text-white p-4 rounded h-64 overflow-y-scroll whitespace-pre-wrap">
          {transcript || "La trascrizione apparirà qui..."}
        </div>
      </div>
    </Layout>
  );
}