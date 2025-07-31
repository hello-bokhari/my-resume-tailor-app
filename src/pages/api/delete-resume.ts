
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';
import { createServerSupabaseClient } from '../../lib/supabase';
import { ObjectId } from 'mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'DELETE') {
    const { id } = req.query; // Get ID from query parameter

    // Get user from Supabase session
    const supabase = createServerSupabaseClient(req, res);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!id) {
      return res.status(400).json({ message: 'Resume ID is required' });
    }

    try {
      const client = await clientPromise;
      const db = client.db('resume-tailor');
      const collection = db.collection('resumes');

      const result = await collection.deleteOne({ _id: new ObjectId(id as string), userId: user.id });

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Resume not found or not authorized' });
      }

      res.status(200).json({ message: 'Resume deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
