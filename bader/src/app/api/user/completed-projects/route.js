import connectDB from '@/lib/db'; 
import Project from "@/models/Project";
import { getToken } from "next-auth/jwt";
import jwt from "jsonwebtoken";

export async function GET(req) {
  await connectDB();

  // تحقق من الجلسة
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  let userId;

  if (token?.email) {
    userId = token.sub; // أو حسب اللي بتخزنه وقت تسجيل دخول Google
  } else {
    const rawToken = req.cookies.get("token")?.value;
    if (!rawToken) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }
    const decoded = jwt.verify(rawToken, process.env.JWT_SECRET);
    userId = decoded.userId;
  }
  console.log("User ID:", userId);

  try {
    const projects = await Project.find({
      volunteers: userId,
      status: "completed",
    }).lean();
    console.log("Completed projects:", projects);
    return Response.json({ projects });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: "Failed to fetch completed projects" }),
      { status: 500 }
    );
  }
}
