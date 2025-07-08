import connectDB from '@/lib/db';
import Notification from '@/models/Notification';
import { getToken } from 'next-auth/jwt';
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connectDB();

  // التحقق من الجلسة
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  let userId;

  if (token?.email) {
    userId = token.sub;
  } else {
    const rawToken = req.cookies.get('token')?.value;
    if (!rawToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    try {
      const decoded = jwt.verify(rawToken, process.env.JWT_SECRET);
      userId = decoded.userId || decoded.sub;
    } catch {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
  }

  try {
    const notifications = await Notification.find({ user: mongoose.Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to fetch notifications' }, { status: 500 });
  }
}
