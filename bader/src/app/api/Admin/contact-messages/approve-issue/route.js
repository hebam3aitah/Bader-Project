// File: /app/api/admin/approve-issue/route.js

import { NextResponse } from 'next/server';
import connectDB from "@/lib/db";
import Issue from '@/models/Issue';
import Project from '@/models/Project';
import { getToken } from 'next-auth/jwt';

export async function POST(req) {
  try {
    await connectDB();
    const token = await getToken({ req });

    if (!token || token.role !== 'admin') {
      return NextResponse.json({ message: 'غير مصرح' }, { status: 401 });
    }

    const body = await req.json();
    const { issueId, updatedFields } = body;

    if (!issueId) {
      return NextResponse.json({ message: 'رقم البلاغ مفقود' }, { status: 400 });
    }

    // تحديث البلاغ
    const issue = await Issue.findById(issueId);
    if (!issue) return NextResponse.json({ message: 'البلاغ غير موجود' }, { status: 404 });

    // تعديل الحقول في البلاغ إذا لزم
    Object.assign(issue, updatedFields);
    issue.status = 'approved';
    issue.reviewedByAdmin = true;
    await issue.save();

    // إنشاء مشروع بناءً على البلاغ
    const project = new Project({
      title: issue.Title,
      description: issue.Description,
      images: issue.Images,
      location: issue.Location,
      category: issue.Category,
      dangerLevel: issue.DangerLvl,
      createdFromIssue: issue._id,
      status: 'open',
    });
    await project.save();

    // ربط المشروع بالبلاغ
    issue.projectId = project._id;
    await issue.save();

    return NextResponse.json({ message: 'تمت الموافقة وتحويل البلاغ إلى مشروع', project });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'حدث خطأ أثناء الموافقة على البلاغ' }, { status: 500 });
  }
}
