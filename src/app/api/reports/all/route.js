import { connectDB } from "@/lib/mongoose";
import mongoose from "mongoose";

const Report = mongoose.models.Report || mongoose.model("Report");

export async function GET() {
  try {
    await connectDB();
    const reports = await Report.find().sort({ reportedAt: -1 });
    return Response.json(reports);
  } catch (error) {
    console.error("فشل في تحميل البلاغات:", error);
    return new Response(JSON.stringify({ message: "حدث خطأ" }), { status: 500 });
  }
}
