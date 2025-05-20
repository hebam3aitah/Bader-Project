import { connectDB } from "@/lib/mongoose";
import Donation from "@/models/Donation";
import User from "@/models/User";
import Project from "@/models/Project";
import Organization from "@/models/Organization";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const donations = await Donation.find({})
      .sort({ donatedAt: -1 })
      .populate("donor", "name email role")
      .populate("project", "title")
      .populate("organization", "name");

    return NextResponse.json(donations);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "خطأ في جلب التبرعات" }, { status: 500 });
  }
}
