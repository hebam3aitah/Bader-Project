// import connectDB from '@/lib/db';
// import { NextResponse } from "next/server";
// import mongoose from "mongoose";
// import { cookies } from "next/headers";
// import jwt from "jsonwebtoken";

// export async function POST(request) {
//   try {
//     const { db } =await connectDB();


//     // 1. استخراج بيانات النموذج
//     const formData = await request.json();
//     console.log("🔥 volunteerData:", formData);

//     // 2. استخراج project_id من URL
//     const { searchParams } = new URL(request.url);
//     const project_id = searchParams.get("project_id");
//     console.log("🔥 project_id from URL:", project_id);

//     // 3. استخراج التوكن من الكوكيز
//     const cookieStore = await cookies();
//     const token = cookieStore.get("token")?.value;
//     console.log("🔥 token:", token);

//     if (!token) {
//       return NextResponse.json(
//         { message: "يجب تسجيل الدخول أولاً" },
//         { status: 401 }
//       );
//     }

//     // 4. فك التوكن
//     let userId;
//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       userId = decoded.userId || decoded.sub;
//       console.log("🔥 decoded userId:", userId);
//     } catch (jwtError) {
//       return NextResponse.json(
//         { message: "جلسة غير صالحة، يرجى تسجيل الدخول مرة أخرى" },
//         { status: 401 }
//       );
//     }

//     // 5. التحقق من التكرار
//     const volunteerCollection = db.collection("volunteers");
//     const existingVolunteer = await volunteerCollection.findOne({
//       volunteer: new mongoose.Types.ObjectId(userId),
//       ...(project_id && {
//         projectAssigned: new mongoose.Types.ObjectId(project_id),
//       }),
//     });

//     if (existingVolunteer) {
//       return NextResponse.json(
//         {
//           message: project_id
//             ? "أنت مسجل بالفعل كمتطوع في هذا المشروع"
//             : "أنت مسجل بالفعل كمتطوع عام",
//         },
//         { status: 400 }
//       );
//     }

//     // 6. إنشاء سجل المتطوع
//     const newVolunteer = {
//       ...formData,
//       volunteer: new mongoose.Types.ObjectId(userId),
//       status: "pending",
//       appliedAt: new Date(),
//       ...(project_id && {
//         projectAssigned: new mongoose.Types.ObjectId(project_id),
//       }),
//     };

//     const volunteerResult = await volunteerCollection.insertOne(newVolunteer);

//     // 7. ربطه بالمشروع إذا في project_id
//     if (project_id) {
//       const projectCollection = db.collection("projects");
//       await projectCollection.updateOne(
//         { _id: new mongoose.Types.ObjectId(project_id) },
//         { $addToSet: { volunteers: new mongoose.Types.ObjectId(userId) } }
//       );
//     }

//     return NextResponse.json(
//       {
//         message: "تم تسجيلك كمتطوع بنجاح!",
//         volunteerId: volunteerResult.insertedId,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Error in volunteer registration:", error);
//     return NextResponse.json(
//       { message: "حدث خطأ أثناء التسجيل" },
//       { status: 500 }
//     );
//   }
// }
import connectDB from '@/lib/db';
import Volunteer from '@/models/Volunteer';
import Project from '@/models/Project';
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    await connectDB();

    const formData = await request.json();
    const { searchParams } = new URL(request.url);
    const project_id = searchParams.get("project_id");

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "يجب تسجيل الدخول أولاً" },
        { status: 401 }
      );
    }

    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.userId || decoded.sub;
    } catch (jwtError) {
      return NextResponse.json(
        { message: "جلسة غير صالحة، يرجى تسجيل الدخول مرة أخرى" },
        { status: 401 }
      );
    }

    const existingVolunteer = await Volunteer.findOne({
      volunteer: new mongoose.Types.ObjectId(userId),
      ...(project_id && { projectAssigned: new mongoose.Types.ObjectId(project_id) }),
    });

    if (existingVolunteer) {
      return NextResponse.json(
        {
          message: project_id
            ? "أنت مسجل بالفعل كمتطوع في هذا المشروع"
            : "أنت مسجل بالفعل كمتطوع عام",
        },
        { status: 400 }
      );
    }

    const newVolunteer = await Volunteer.create({
      ...formData,
      volunteer: new mongoose.Types.ObjectId(userId),
      status: "pending",
      appliedAt: new Date(),
      ...(project_id && { projectAssigned: new mongoose.Types.ObjectId(project_id) }),
    });

    if (project_id) {
      await Project.updateOne(
        { _id: new mongoose.Types.ObjectId(project_id) },
        { $addToSet: { volunteers: new mongoose.Types.ObjectId(userId) } }
      );
    }

    return NextResponse.json(
      {
        message: "تم تسجيلك كمتطوع بنجاح!",
        volunteerId: newVolunteer._id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in volunteer registration:", error);
    return NextResponse.json(
      { message: "حدث خطأ أثناء التسجيل" },
      { status: 500 }
    );
  }
}
