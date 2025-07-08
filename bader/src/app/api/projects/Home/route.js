import connectDB from '@/lib/db';
import Project from "@/models/Project";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();

    // رجعي آخر ٤ مشاريع بناءً على الأحدث في reportedAt
    const projects = await Project.find()
      .sort({ reportedAt: -1 })
      .limit(4)
      .populate("category", "name");

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("❌ Error loading projects:", error.message);
    return NextResponse.json(
      { message: "خطأ في تحميل المشاريع", error: error.message },
      { status: 500 }
    );
  }
}
