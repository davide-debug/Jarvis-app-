export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { to, subject, body, when } = req.body || {};
  // In produzione, salva su DB/queue e invia tramite provider
  return res.status(200).json({ ok: true, id: "reminder-demo", echo: { to, subject, when } });
}