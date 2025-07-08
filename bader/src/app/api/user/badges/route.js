import  connectDB from '@/lib/db';
import Project from '@/models/Project';
import Issue from '@/models/Issue';
import { getToken } from 'next-auth/jwt';
import jwt from 'jsonwebtoken';

export async function GET(req) {
  await connectDB();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  let userId;

  if (token?.email) {
    userId = token.sub;
  } else {
    const rawToken = req.cookies.get('token')?.value;
    if (!rawToken) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
    const decoded = jwt.verify(rawToken, process.env.JWT_SECRET);
    userId = decoded.userId;
  }

  try {
    const completedProjects = await Project.find({ volunteers: userId, status: 'completed' });
    const reportedIssues = await Issue.find({ reportedBy: userId });

    const badges = [];

    if (completedProjects.length >= 3) {
      badges.push({ id: 1, name: 'المتطوع النشط', achieved: true, description: 'أكملت 3 مشاريع تطوعية' });
    }
    if (reportedIssues.length >= 3) {
      badges.push({ id: 2, name: 'مراقب الحي', achieved: true, description: 'أبلغت عن 3 مشاكل في الحي' });
    }
    if (completedProjects.reduce((sum, p) => sum + (p.hours || 0), 0) >= 15) {
      badges.push({ id: 3, name: 'متطوع الذهبي', achieved: true, description: 'وصلت إلى 15 ساعة تطوع' });
    }

    return Response.json({ badges });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Failed to fetch badges' }), { status: 500 });
  }
}
