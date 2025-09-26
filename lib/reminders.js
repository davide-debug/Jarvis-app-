// Invio mail recall 24h prima (stub)
export async function scheduleRecallEmail({ to, subject, body, when }) {
  // In produzione: persist e cron/queue
  console.log("scheduleRecallEmail", { to, subject, when });
  return { ok: true, id: "recall-demo-id" };
}