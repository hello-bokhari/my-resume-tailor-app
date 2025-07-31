import { NextApiRequest, NextApiResponse } from 'next';
import { tailorResume } from '../../lib/gemini';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { resume, jobDescription } = req.body;

    if (!resume || !jobDescription) {
      return res.status(400).json({ message: 'Resume and job description are required' });
    }

    try {
      const tailoredResume = await tailorResume(resume, jobDescription);
      res.status(200).json({ tailoredResume });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
