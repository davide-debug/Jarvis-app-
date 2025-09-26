// Stub integrazione Outlook & Zoho
export async function createOutlookTask({ title, due }) {
  // TODO: implementare OAuth e chiamata Graph API
  console.log("createOutlookTask", { title, due });
  return { ok: true, id: "outlook-demo-id" };
}

export async function createZohoTask({ title, due }) {
  // TODO: implementare OAuth e chiamata Zoho Bigin
  console.log("createZohoTask", { title, due });
  return { ok: true, id: "zoho-demo-id" };
}