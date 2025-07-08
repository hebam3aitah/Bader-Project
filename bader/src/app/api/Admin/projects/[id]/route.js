import connectDB from "@/lib/db";
import Project from "@/models/Project";
import { NextResponse } from "next/server";

export async function PUT(req) {
  await dbConnect();

  try {
    const body = await req.json();

    // استخراج ID من الـ URL
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop(); // أو استخدم regex إذا المسار مختلف

    const updated = await Project.findByIdAndUpdate(
      id,
      {
        category: body.category,
        description: body.description,
        status: body.status,
        donationTarget: body.donationTarget,
        volunteerCount: body.volunteerCount,
        volunteerHours: body.volunteerHours,
        images: body.images,
        locationName: body.locationName,
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { message: "المشروع غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "تم تحديث المشروع بنجاح" });
  } catch (error) {
    console.error("Failed to update project:", error);
    return NextResponse.json(
      { message: "فشل في تعديل المشروع" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  await dbConnect();

  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    const deleted = await Project.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { message: "المشروع غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "تم حذف المشروع بنجاح" });
  } catch (error) {
    console.error("Failed to delete project:", error);
    return NextResponse.json(
      { message: "فشل في حذف المشروع" },
      { status: 500 }
    );
  }
}