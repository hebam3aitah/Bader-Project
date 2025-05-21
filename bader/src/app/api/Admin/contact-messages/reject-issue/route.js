// /api/admin/reject-issue
import { getToken } from 'next-auth/jwt';
import { connectDB } from '@/lib/mongoose';
import Issue from '@/models/Issue';

export async function POST(req) {
  await connectDB();

  const token = await getToken({ req });
  if (!token || token.role !== 'admin') {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  const { issueId, reason } = await req.json();

  if (!issueId) {
    return new Response(JSON.stringify({ message: 'issueId is required' }), { status: 400 });
  }

  const issue = await Issue.findById(issueId);
  if (!issue) {
    return new Response(JSON.stringify({ message: 'Issue not found' }), { status: 404 });
  }

  issue.status = 'rejected';
  issue.reviewedByAdmin = true;
  await issue.save();

  // TODO: إرسال إشعار للمستخدم بأنه تم رفض البلاغ، يمكن استخدام البريد أو Notification System

  return new Response(JSON.stringify({ message: 'Issue rejected successfully' }), { status: 200 });
}
