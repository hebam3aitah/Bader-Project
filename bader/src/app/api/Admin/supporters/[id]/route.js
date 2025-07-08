import connectDB from "@/lib/db";
import Organization from "@/models/Organization";
import nodemailer from 'nodemailer';
import { NextResponse } from "next/server";

// ✅ تعديل أو رفض أو قبول جهة
export async function PUT(req, { params }) {
  try {
    await connectDB();
    const body = await req.json();
    const { action, ...updates } = body;

    const org = await Organization.findById(params.id);
    if (!org) {
      return NextResponse.json({ message: "الجهة غير موجودة" }, { status: 404 });
    }

    if (action === "approve") {
      org.approved = true;
      await org.save();

      await sendMail({
        to: org.email,
        subject: "تم قبول الجهة الداعمة",
        html: `<p>مرحبًا ${org.contactPerson || org.name}،</p>
               <p>تمت الموافقة على الجهة الخاصة بكم. شكرًا لمساهمتكم.</p>`,
      });

      return NextResponse.json({ message: "تم القبول" });
    }

    if (action === "reject") {
      await org.deleteOne();

      await sendMail({
        to: org.email,
        subject: "رفض الجهة الداعمة",
        html: `<p>عذرًا ${org.contactPerson || org.name}،</p>
               <p>نأسف لإبلاغكم بأنه لم يتم قبول الجهة الخاصة بكم.</p>`,
      });

      return NextResponse.json({ message: "تم الرفض" });
    }

    // ✅ تعديل بيانات عامة
    const updated = await Organization.findByIdAndUpdate(params.id, updates, {
      new: true,
    });

    return NextResponse.json(updated);
  } catch (err) {
   console.error("PUT /api/Admin/supporters/[id] FAILED:", err); // ✅ عرض مفصل
  return NextResponse.json({ message: "فشل في التحديث", error: err.message }, { status: 500 });
  }
}
