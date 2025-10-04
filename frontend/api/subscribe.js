import { put, list } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email } = req.body;
    
    // Get existing subscribers
    const { blobs } = await list({ prefix: 'subscribers-' });
    const subscribers = new Set();
    
    for (const blob of blobs) {
      const response = await fetch(blob.url);
      const data = await response.text();
      data.split('\n').forEach(e => subscribers.add(e.trim()));
    }
    
    // Add new email
    subscribers.add(email);
    
    // Save updated list
    await put(`subscribers-${Date.now()}.txt`, Array.from(subscribers).join('\n'), {
      access: 'public',
    });
    
    return res.status(200).json({ success: true });
  }
  return res.status(405).json({ error: 'Method not allowed' });
}