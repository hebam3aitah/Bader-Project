import connectDB from "@/lib/db";
import Volunteer from "@/models/Volunteer";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function PUT(req, { params }) {
  const { id: volunteerId } = params;

  try {
    await connectDB();

    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { message: "يرجى إرسال الحالة الجديدة" },
        { status: 400 }
      );
    }

    // فقط تحديث الـ status بدون ما نلمس باقي الحقول
    const updatedVolunteer = await Volunteer.findByIdAndUpdate(
      volunteerId,
      { status },
      { new: true, runValidators: false } // نمنع الـ validation
    );

    if (!updatedVolunteer) {
      return NextResponse.json(
        { message: "المتطوع غير موجود" },
        { status: 404 }
      );
    }

    // إرسال إيميل بناءً على الحالة
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let subject = "";
    let html = "";

    if (status === "accepted") {
      subject = "تم قبول طلبك للتطوع";
      html = `<p>مرحبًا ${updatedVolunteer.name}،</p><p>تم قبول طلبك للتطوع بنجاح 🎉</p>`;
    } else if (status === "rejected") {
      subject = "تم رفض طلبك للتطوع";
      html = `<p>مرحبًا ${updatedVolunteer.name}،</p><p>نأسف، تم رفض طلبك.</p>`;
    } else if (status === "pending") {
      subject = "طلبك قيد المراجعة";
      html = `<p>مرحبًا ${updatedVolunteer.name}،</p><p>طلبك الآن قيد المراجعة.</p>`;
    }

    await transporter.sendMail({
      from: `"منصة بادر" <${process.env.EMAIL_USER}>`,
      to: updatedVolunteer.email,
      subject,
      html,
    });

    return NextResponse.json({ message: "تم تحديث الحالة بنجاح ✅" });
  } catch (err) {
    console.error("PUT /volunteers/[id] error:", err);
    return NextResponse.json(
      { message: "فشل في التحديث", error: err.message },
      { status: 500 }
    );
  }
}
