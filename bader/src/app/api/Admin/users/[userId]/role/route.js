import connectDB from "@/lib/db";
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const { userId } = params;
    const { role } = await req.json();

    const validRoles = ["user", "admin", "volunteer", "donor", "supporter"];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ message: 'الدور غير صالح' }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: 'المستخدم غير موجود' }, { status: 404 });
    }

    user.role = role;
    await user.save();

    return NextResponse.json({ message: 'تم تحديث الدور بنجاح', role: user.role });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'حدث خطأ أثناء تحديث الدور' }, { status: 500 });
  }
}
