import connectDB from "@/lib/db";
import Donation from "@/models/Donation";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();

    // استخراج page و limit من الـ query مع التحقق من صحتهم
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page")) || 1);
    const limit = Math.max(1, parseInt(searchParams.get("limit")) || 10);
    const skip = (page - 1) * limit;

    // الحصول على إجمالي عدد التبرعات
    const totalDonations = await Donation.countDocuments();
    const totalPages = Math.ceil(totalDonations / limit);

    // التحقق إذا كانت الصفحة المطلوبة أكبر من عدد الصفحات
    if (page > totalPages && totalDonations > 0) {
      return NextResponse.json({
        data: [],
        currentPage: page,
        totalPages,
        totalDonations,
        message: "الصفحة المطلوبة خارج النطاق المتاح",
      });
    }

    // جلب التبرعات مع pagination والـ populate
    const donations = await Donation.find({})
      .sort({ donatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("donor", "name email role")
      .populate("project", "title")
      .populate("organization", "name");

    return NextResponse.json({
      data: donations,
      currentPage: page,
      totalPages,
      totalDonations,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "خطأ في جلب التبرعات", error: error.message },
      { status: 500 }
    );
  }
}
