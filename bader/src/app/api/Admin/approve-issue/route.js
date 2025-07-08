import connectDB from "@/lib/db";
import Issue from '@/models/Issue';
import Project from '@/models/Project';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    await connectDB();
    const { id } = await req.json();

    const issue = await Issue.findById(id);
    if (!issue) return NextResponse.json({ error: 'البلاغ غير موجود' }, { status: 404 });

    issue.status = 'approved';
    await issue.save();


    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'فشل في قبول البلاغ' }, { status: 500 });
  }
}
