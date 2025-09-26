export default async function handler(req, res) {
  const { code } = req.query;
  res.status(200).json({ ok: true, message: "Callback Zoho ricevuto. Implementa exchange code->token (server).", code });
}