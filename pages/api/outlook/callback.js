export default async function handler(req, res) {
  const { code, state } = req.query;
  res.status(200).json({ ok: true, message: "Callback ricevuto. Implementa exchange code->token lato server.", code, state });
}