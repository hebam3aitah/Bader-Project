import connectDB from "@/lib/db";
import Organization from "@/models/Organization";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const partners = await Organization.find({ approved: "approved" }).select("name images");

    // تحويل البيانات بحيث ترجع فقط أول صورة من المصفوفة لكل جهة (إذا موجودة)
    const formattedPartners = partners.map((partner) => ({
      _id: partner._id,
      name: partner.name,
      image: partner.images.length > 0 ? partner.images[0].url : null, // أول صورة أو null
    }));

    return NextResponse.json(formattedPartners);
  } catch (error) {
    return NextResponse.json(
      { message: "فشل في جلب الشركاء", error: error.message },
      { status: 500 }
    );
  }
}
