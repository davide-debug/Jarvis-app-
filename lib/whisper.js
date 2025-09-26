// Placeholder per invio audio a Whisper API
export async function transcribeBlob(blob, apiKey) {
  if (!apiKey) throw new Error("OpenAI API Key mancante");
  // In questa demo non chiamiamo la rete.
  // Restituiamo un testo fittizio con timestamp
  return [
    { t: 0, text: "Ciao, iniziamo la call."},
    { t: 12, text: "Parliamo del progetto e delle obiezioni."},
    { t: 27, text: "Prossimi passi: invio offerta e recall 24h prima."}
  ];
}