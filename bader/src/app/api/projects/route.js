import connectDB from '@/lib/db';
import Project from "@/models/Project";
import Category from "@/models/Category";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 4;
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const skip = (page - 1) * limit;

    let filter = {};

    // فلترة الحالة: إذا اختار المستخدم حالة معينة
    if (status && status !== "all") {
      filter.status = status;
    } else {
      // لو ما اختارش حالة، نعرض المشاريع بحالات محددة (مثلاً القيد والتنفيذ والمكتمل)
      filter.status = { $in: ["completed", "in-progress"] };
    }

    // فلترة التصنيف
    if (category && category !== "all") {
      filter.category = category;
    }

    // فلترة البحث على العنوان والوصف (نصي، case-insensitive)
    if (search && search.trim() !== "") {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const projects = await Project.find(filter)
      .populate("category", "name")
      .sort({ reportedAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await Project.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({ projects, totalCount, totalPages });
  } catch (error) {
    console.error("❌ Error loading projects:", error.message);
    return NextResponse.json(
      { message: "خطأ في تحميل المشاريع", error: error.message },
      { status: 500 }
    );
  }
}
