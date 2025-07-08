
import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import { NextResponse } from "next/server";

// جلب المشاريع مع فلترة حسب الحالة
export async function GET(req) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const filter = {};
  if (status && status !== "all") {
    filter.status = status;
  }

  try {
    const projects = await Project.find(filter)
      .populate("category")
      .sort({ createdAt: -1 });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return NextResponse.json(
      { message: "فشل في جلب المشاريع" },
      { status: 500 }
    );
  }
}

// إنشاء مشروع جديد
export async function POST(req) {
  await dbConnect();

  try {
    const body = await req.json();

    const newProject = new Project({
      title: body.title,
      description: body.description,
      status: body.status || "in-progress",
      donationTarget: body.donationTarget || 0,
      volunteerCount: body.volunteerCount || 0,
      volunteerHours: body.volunteerHours || 0,
      images: body.images || [],
      mainImage: body.mainImage || body.images?.[0] || null, // ✅ أضف الصورة الرئيسية
      category: body.category || null, // ✅ ضروري لو التصنيف مطلوب لاحقًا
    });

    console.log("newProject", newProject);

    await newProject.save();

    return NextResponse.json(
      { message: "تم إنشاء المشروع بنجاح" },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Failed to create project:", error.message);

    if (error.errors) {
      for (const key in error.errors) {
        console.error(
          `🛑 Validation error at [${key}]: ${error.errors[key].message}`
        );
      }
    }

    return NextResponse.json(
      { message: "فشل في إنشاء المشروع", error: error.message },
      { status: 500 }
    );
  }
}
