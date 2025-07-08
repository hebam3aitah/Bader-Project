import { getToken } from "next-auth/jwt";
import { authOptions } from "../auth/[...nextauth]/route";
import connectDB from '@/lib/db'; 
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function GET(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // ✅ إذا سجل من Google (NextAuth)
  if (token?.email && token?.name) {
    // جلب المستخدم من قاعدة البيانات للحصول على _id
    const user = await User.findOne({ email: token.email });
    console.log("user", user);
    return Response.json({
      _id: user?._id, // أضف _id إذا كان user موجود
      name: token.name,
      email: token.email,
      phone: token.phone || "غير متوفر",
      address: token.address || "غير متوفر",
      provider: "google",
      image: token.image || "",
      role: token.role || "",
    });
  }

  // ✅ إذا سجل من JWT يدوي
  const rawToken = req.cookies.get("token")?.value;
  if (!rawToken) {
    return new Response(JSON.stringify({ message: "غير مسجل دخول" }), {
      status: 401,
    });
  }

  try {
    const decoded = jwt.verify(rawToken, process.env.JWT_SECRET);
    await connectDB();
    const user = await User.findById(decoded.userId).select(
      "name email phone address image role"
    );
    if (!user)
      return new Response(JSON.stringify({ message: "المستخدم غير موجود" }), {
        status: 404,
      });
    return Response.json({
      _id: user._id, // أضف _id هنا أيضًا
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      address: user.address || "",
      provider: "credentials",
      image: user.image || "",
      role: user.role || "",
    });
  } catch (err) {
    console.error("❌ Error in /api/current-user:", err);

    return new Response(JSON.stringify({ message: "توكن غير صالح" }), {
      status: 401,
    });
  }
}
