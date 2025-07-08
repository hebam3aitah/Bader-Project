import connectDB from "@/lib/db";
import Issue from '@/models/Issue';
import { NextResponse } from 'next/server';

export async function PUT(req) {
  try {
    await connectDB();
    const data = await req.json();
    const { id, title, description, location, severity, category } = data;

    const updated = await Issue.findByIdAndUpdate(
      id,
      { title, description, location, severity, category },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: 'البلاغ غير موجود' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'فشل في التحديث' }, { status: 500 });
  }
}
