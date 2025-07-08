// ✅ /app/api/issues/[id]/route.js
import connectDB from '@/lib/db'; 
import Issue from "@/models/Issue";
import { NextResponse } from "next/server";

export async function GET(_, { params }) {
  try {
    await connectDB();
    const issue = await Issue.findById(params.id).populate("category", "name");
    if (!issue) {
      return NextResponse.json(
        { message: "المشكلة غير موجودة" },
        { status: 404 }
      );
    }
    return NextResponse.json(issue);
  } catch (err) {
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب البلاغ" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const body = await req.json();
    const updated = await Issue.findByIdAndUpdate(
      params.id,
      {
        problemType: body.problemType,
        description: body.description,
        location: body.location,
        severityLevel: body.severityLevel,
        donationTarget: body.donationTarget,
        volunteerCount: body.volunteerCount,
        volunteerHours: body.volunteerHours,
        images: body.images,
        locationLat: body.locationLat,
        locationLng: body.locationLng,
        locationName: body.locationName,
      },
      { new: true }
    );
    if (!updated)
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update issue" },
      { status: 500 }
    );
  }
}
