// pages/api/tailor.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { resume, jobDesc } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) return res.status(500).json({ error: 'Missing Gemini API key' });

  const prompt = `
You are an expert resume assistant. Given the following resume and job description, tailor the resume to better match the job. Highlight key strengths, suggest improvements, and rewrite relevant parts if needed.

Resume:
${resume}

Job Description:
${jobDesc}

Tailored Resume:
`;

  try {
    const geminiResponse = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + apiKey,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    const data = await geminiResponse.json();
    const result = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini.';

    return res.status(200).json({ result });
  } catch (error) {
    console.error('Gemini API error:', error);
    return res.status(500).json({ error: 'Failed to generate resume.' });
  }
}
