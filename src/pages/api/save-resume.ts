
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { resume, jobDescription, tailoredResume } = req.body;

    if (!resume || !jobDescription || !tailoredResume) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
      const client = await clientPromise;
      const db = client.db('resume-tailor');
      const collection = db.collection('resumes');

      await collection.insertOne({
        resume,
        jobDescription,
        tailoredResume,
        createdAt: new Date(),
      });

      res.status(201).json({ message: 'Resume saved successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
