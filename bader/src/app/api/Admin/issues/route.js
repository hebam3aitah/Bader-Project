
import connectDB from "@/lib/db";
import Issue from '@/models/Issue';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDB();
    const issues = await Issue.find()
.select('problemType description location severityLevel status reporterName phone images createdAt')

    .sort({ createdAt: -1 }); // الأحدث أولًا
    return NextResponse.json(issues);

  } catch (error) {
    return NextResponse.json({ error: 'فشل في جلب البلاغات' }, { status: 500 });
    
  }
  
}
