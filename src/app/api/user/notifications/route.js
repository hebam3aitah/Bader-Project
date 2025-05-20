import { connectDB } from '@/lib/mongoose';
import Notification from '@/models/Notification';
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
    const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 }).lean();
    return Response.json({ notifications });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Failed to fetch notifications' }), { status: 500 });
  }
}
