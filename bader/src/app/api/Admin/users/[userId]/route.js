import connectDB from "@/lib/db";
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const { userId } = params;
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ message: 'المستخدم غير موجود' }, { status: 404 });
    }

    await User.deleteOne({ _id: userId });

    return NextResponse.json({ message: 'تم حذف المستخدم بنجاح' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'حدث خطأ أثناء حذف المستخدم' }, { status: 500 });
  }
}
