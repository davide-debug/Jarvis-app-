export async function transcribeBlob(blob, apiKey) {
  if (!apiKey) throw new Error("OpenAI API Key mancante");
  const formData = new FormData();
  formData.append("file", blob, "audio.webm");
  formData.append("model", "whisper-1");
  formData.append("response_format", "verbose_json");
  const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { "Authorization": `Bearer ${apiKey}` },
    body: formData
  });
  if (!res.ok) throw new Error("Errore Whisper: " + await res.text());
  const data = await res.json();
  if (!data.segments) return [{ start: 0, end: null, dur: null, text: data.text }];
  return data.segments.map(seg => ({
    start: Math.round(seg.start),
    end: Math.round(seg.end),
    dur: Math.round(seg.end - seg.start),
    text: seg.text.trim()
  }));
}