export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email } = req.body;
    
    const SHEET_URL = process.env.GOOGLE_SHEET_URL;
    
    if (!SHEET_URL) {
      return res.status(500).json({ error: 'GOOGLE_SHEET_URL not configured' });
    }
    
    try {
      await fetch(SHEET_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, timestamp: new Date().toISOString() })
      });
      
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  return res.status(405).json({ error: 'Method not allowed' });
}