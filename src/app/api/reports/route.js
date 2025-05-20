import { connectDB } from "@/lib/mongoose";
import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema({
  commentId: { type: String, required: true },
  reason: { type: String, required: true },
  details: { type: String },
  reportedAt: { type: Date, default: Date.now },
});

const Report = mongoose.models.Report || mongoose.model("Report", ReportSchema);

export async function POST(req) {
  try {
    await connectDB();
    const { commentId, reason, details } = await req.json();

    if (!commentId || !reason) {
      return new Response(JSON.stringify({ message: "البيانات ناقصة" }), { status: 400 });
    }

    const newReport = await Report.create({ commentId, reason, details });

    return Response.json({ message: "تم إرسال البلاغ", report: newReport });
  } catch (error) {
    console.error("فشل إرسال البلاغ:", error);
    return new Response(JSON.stringify({ message: "خطأ في الخادم" }), { status: 500 });
  }
}
