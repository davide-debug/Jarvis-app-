export default async function handler(req, res) {
  const clientId = process.env.ZOHO_CLIENT_ID || 'YOUR_ZOHO_CLIENT';
  const redirectUri = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000') + '/api/zoho/callback';
  const scope = encodeURIComponent('ZohoBigin.tasks.ALL,ZohoBigin.modules.ALL,offline_access');
  const url = `https://accounts.zoho.eu/oauth/v2/auth?scope=${scope}&client_id=${clientId}&response_type=code&access_type=offline&redirect_uri=${encodeURIComponent(redirectUri)}`;
  res.status(200).json({ authorize_url: url });
}