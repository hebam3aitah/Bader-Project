import connectDB from "@/lib/db";
import Project from "@/models/Project";
import Volunteer from "@/models/Volunteer";
import Organization from "@/models/Organization";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  const [projectsCount, volunteersCount, supportersCount] = await Promise.all([
    Project.countDocuments({}),
    Volunteer.countDocuments({ status: "accepted" }),
    Organization.countDocuments({ approved: "approved" }), // ✅ تم التعديل هنا
  ]);

  const stats = [
    {
      icon: "tools",
      title: "مشروع تم إنجازه",
      count: projectsCount,
      description: `تم تنفيذ ${projectsCount} مشروعًا في مختلف الأحياء.`,
    },
    {
      icon: "users",
      title: " التطوعات ",
      count: volunteersCount,
      description: `شهد موقعنا ${volunteersCount}  مشاركة تطوعية فعالة.`,
    },
    {
      icon: "heart",
      title: "داعم",
      count: supportersCount,
      description: `شارك ${supportersCount} جهة داعمة في مسيرة النجاح.`,
    },
  ];

  return NextResponse.json(stats);
}
