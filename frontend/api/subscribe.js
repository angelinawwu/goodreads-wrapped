export default async function handler(req, res) {
    if (req.method === 'POST') {
      const { email } = req.body;
      
      const SHEET_URL = process.env.GOOGLE_SHEET_URL;
      
      await fetch(SHEET_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, timestamp: new Date().toISOString() })
      });
      
      return res.status(200).json({ success: true });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  }