import connectDB from '@/lib/db';
import Project from "@/models/Project";
import jwt from "jsonwebtoken";

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // تأكدي إن JWT_SECRET موجود بالـ .env
    return decoded.userId;
  } catch (err) {
    return null;
  }
};

export async function POST(req, { params }) {
  const { id } = params; // ← هيك مناخد قيمة [id] من اسم الملف
  console.log("🔥 project ID:", id);

  // سحب التوكن من الكوكيز
  const token = req.cookies.get("token")?.value;
  console.log("🔥 token:", token);

  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userId = verifyToken(token);
  console.log("🔥 userId:", userId);

  if (!userId) {
    return new Response("Invalid token", { status: 401 });
  }

  await connectDB();

  try {
    const project = await Project.findById(id); // ← استخدام الـ id
    if (!project) {
      return new Response("Project not found", { status: 404 });
    }

    // Toggle like/unlike
    if (!project.likes.includes(userId)) {
      project.likes.push(userId);
      project.likesCount += 1;
    } else {
      project.likes = project.likes.filter(
        (like) => like.toString() !== userId
      );
      project.likesCount -= 1;
    }

    await project.save();

    return new Response(JSON.stringify(project), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Error liking project", { status: 500 });
  }
}
