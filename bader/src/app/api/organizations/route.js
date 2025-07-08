// // ✅ /app/api/organizations/route.js
import connectDB from '@/lib/db'; 
import Organization from "@/models/Organization";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const organizations = await Organization.find({ approved: "pending", }).select(
      "_id name category supportType message images featured phone email"
    );

    const formatted = organizations.map((org) => ({
      _id: org._id,
      name: org.name,
      supportType: org.supportType,
      message: org.message,
      category: org.category,
      images: org.images || [],
      logo: org.images?.[0]?.url || "/placeholder/80/80",
      featured: org.featured || false,
      phone: org.phone,
      email: org.email,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "خطأ في جلب البيانات" },
      { status: 500 }
    );
  }
}
