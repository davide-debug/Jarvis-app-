export async function createOutlookTask({ title, due }) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('MS_ACCESS_TOKEN') : null;
  if (!token) { console.warn('Outlook non connesso. Uso stub.'); return { ok: false, stub: true, id: 'outlook-stub' }; }
  const listsRes = await fetch('https://graph.microsoft.com/v1.0/me/todo/lists', {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!listsRes.ok) return { ok: false, error: await listsRes.text() };
  const lists = await listsRes.json();
  const defaultListId = lists?.value?.[0]?.id;
  if (!defaultListId) return { ok: false, error: 'Nessuna lista ToDo trovata' };
  const create = await fetch(`https://graph.microsoft.com/v1.0/me/todo/lists/${defaultListId}/tasks`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, dueDateTime: { dateTime: due, timeZone: 'UTC' } })
  });
  if (!create.ok) return { ok: false, error: await create.text() };
  const task = await create.json();
  return { ok: true, id: task.id };
}
export async function createZohoTask({ title, due }) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('ZOHO_ACCESS_TOKEN') : null;
  if (!token) { console.warn('Zoho Bigin non connesso. Uso stub.'); return { ok: false, stub: true, id: 'zoho-stub' }; }
  const res = await fetch('https://www.zohoapis.eu/bigin/v2/Tasks', {
    method: 'POST',
    headers: { Authorization: `Zoho-oauthtoken ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: [{ Subject: title, Due_Date: due.slice(0,10) }] })
  });
  const data = await res.json();
  if (data?.data?.[0]?.code === 'SUCCESS') return { ok: true, id: data.data[0].details.id };
  return { ok: false, error: JSON.stringify(data) };
}