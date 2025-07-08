import connectDB from "@/lib/db";
import Issue from '@/models/Issue';
import { NextResponse } from 'next/server';

export async function GET(_, { params }) {
  try {
    await connectDB();
    const issue = await Issue.findById(params.id);

    if (!issue) {
      return NextResponse.json({ error: 'البلاغ غير موجود' }, { status: 404 });
    }

    return NextResponse.json(issue);
  } catch (err) {
    return NextResponse.json({ error: 'فشل في جلب البلاغ' }, { status: 500 });
  }
}
