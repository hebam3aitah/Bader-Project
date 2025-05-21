import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Comment from "@/models/Comment";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const comments = await Comment.find({ project: params.id })
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      comments.map((comment) => ({
        id: comment._id,
        user: comment.user?.name || "زائر",
        text: comment.text,
        date: new Date(comment.createdAt).toLocaleDateString("ar-SA", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      }))
    );
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب التعليقات", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    await connectDB();
    const { text, user } = await request.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "يجب كتابة تعليق" }, { status: 400 });
    }

    // ممكن تتأكد إذا بدك userId أو تسمح بأنه يكون null
    // لو بدك تمنع تعليقات بدون userId فيمكن تضيف شرط هنا

    const comment = await Comment.create({
      text,
      project: params.id,
      user: user || null,
    });

    if (user) await comment.populate("user", "name");

    return NextResponse.json({
      id: comment._id,
      userId: user,
      user: comment.user?.name || "زائر",
      text: comment.text,
      date: new Date(comment.createdAt).toLocaleDateString("ar-SA", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء إضافة التعليق", details: error.message },
      { status: 500 }
    );
  }
}
