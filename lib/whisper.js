// lib/whisper.js
export async function transcribeBlob(blob, apiKey) {
  if (!apiKey) throw new Error("OpenAI API Key mancante");

  const formData = new FormData();
  formData.append("file", blob, "audio.webm");
  formData.append("model", "whisper-1");
  formData.append("response_format", "verbose_json"); // 👈 output segmentato

  const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`
    },
    body: formData
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error("Errore Whisper: " + err);
  }

  const data = await res.json();

  // Se segments non esiste, fallback a testo unico
  if (!data.segments) {
    return [{ t: 0, text: data.text }];
  }

  // Segmenti con start secondi + testo
  return data.segments.map(seg => ({
    t: Math.round(seg.start),
    text: seg.text.trim()
  }));
}