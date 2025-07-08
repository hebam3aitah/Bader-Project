import { NextResponse } from "next/server";
import connectDB from '@/lib/db'; 
import Organization from "@/models/Organization"; // تستخدم نفس الموديل

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      name,
      organization,
      email,
      phone,
      supportType,
      category,
      message,
      image,
    } = body;
    // تحقق من البيانات المطلوبة
    if (!name || !email || !phone || !supportType) {
      return NextResponse.json(
        { message: "يرجى تعبئة الحقول المطلوبة" },
        { status: 400 }
      );
    }

    await connectDB();

    // إنشاء جهة داعمة جديدة (يمكنك تخصيص المزيد لاحقاً)
    const org = new Organization({
      name: organization || name,
      contactPerson: name,
      email,
      phone,
      supportType,
      category,
      message,
      images: image && image !== "" ? [{ url: image }] : [],
      approved: "pending",
      // بانتظار موافقة الأدمن
    });

    await org.save();

    return NextResponse.json(
      { message: "تم إرسال الطلب بنجاح" },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "خطأ في الخادم" }, { status: 500 });
  }
}
export async function GET() {
  try {
    await connectDB();

    const latestSupporters = await Organization.find({ approved: "approved" })
      .sort({ registeredAt: -1 })
      .limit(4)
      .select("name images category");

    console.log(latestSupporters);

    return NextResponse.json({ supporters: latestSupporters });
  } catch (error) {
    console.error("Error fetching supporters:", error);
    return NextResponse.json(
      { message: "خطأ في جلب البيانات" },
      { status: 500 }
    );
  }
}
