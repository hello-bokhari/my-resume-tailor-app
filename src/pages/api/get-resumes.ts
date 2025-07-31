
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';
import { createServerSupabaseClient } from '../../lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    // Get user from Supabase session
    const supabase = createServerSupabaseClient(req, res);
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log('API Route: User data', user);
    console.log('API Route: Auth error', authError);

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const client = await clientPromise;
      const db = client.db('resume-tailor');
      const collection = db.collection('resumes');

      const userResumes = await collection.find({ userId: user.id }).sort({ createdAt: -1 }).toArray();

      res.status(200).json(userResumes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
