import dbConnect from "@/lib/connectDb";
import Project from "@/models/Project";
import { NextResponse } from "next/server";

// تعديل مشروع موجود
export async function PUT(req, { params }) {
  await dbConnect();

  try {
    const body = await req.json();
    console.log("body", body);

    const updated = await Project.findByIdAndUpdate(
      params.id,
      {
        category: body.category,
        description: body.description,
        status: body.status,
        donationTarget: body.donationTarget,
        volunteerCount: body.volunteerCount,
        volunteerHours: body.volunteerHours,
        images: body.images,
        locationName: body.locationName, // ✅ أضيفي هذا السطر
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

// حذف مشروع
export async function DELETE(_, { params }) {
  await dbConnect();

  try {
    const deleted = await Project.findByIdAndDelete(params.id);

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
