export default async function handler(req, res) {
  const tenant = process.env.MS_TENANT_ID || 'common';
  const clientId = process.env.MS_CLIENT_ID || 'YOUR_CLIENT_ID';
  const redirectUri = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000') + '/api/outlook/callback';
  const scopes = encodeURIComponent('Tasks.ReadWrite offline_access');
  const url = `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&response_mode=query&scope=${scopes}&state=abc`;
  res.status(200).json({ authorize_url: url });
}