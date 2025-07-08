import connectDB from "@/lib/db";
import Organization from "@/models/Organization";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 5;
    const skip = (page - 1) * limit;

    const total = await Organization.countDocuments();
    const supporters = await Organization.find()
      .sort({ registeredAt: -1 })
      .skip(skip)
      .select(
        "name category images registeredAt supportType contactPerson  phone email approved"
      );

    return NextResponse.json({
      supporters,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("فشل في جلب البيانات:", error);
    return NextResponse.json(
      { message: "خطأ في جلب البيانات" },
      { status: 500 }
    );
  }
}
