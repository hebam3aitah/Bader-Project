import connectDB from "@/lib/db";
import TeamMember from "@/models/TeamMember";
import { NextResponse } from "next/server";

// ✅ GET: جلب كل أعضاء الفريق
export async function GET() {
  try {
    await connectDB();
    const members = await TeamMember.find();
    return NextResponse.json(members);
  } catch (error) {
    return NextResponse.json({ message: "فشل في جلب البيانات", error }, { status: 500 });
  }
}

// ✅ POST: إضافة عضو أو أكثر
export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();

    // يدعم فرد أو مجموعة
    const inserted = Array.isArray(data)
      ? await TeamMember.insertMany(data)
      : await TeamMember.create(data);

    return NextResponse.json({ message: "تمت الإضافة بنجاح", inserted });
  } catch (error) {
    return NextResponse.json({ message: "فشل في الإضافة", error }, { status: 500 });
  }
}
