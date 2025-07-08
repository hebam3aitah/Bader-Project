import connectDB from "@/lib/db";
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  await connectDB();
  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user) {
    return Response.json({ message: 'الحساب غير موجود' }, { status: 404 });
  }

  const hashed = await bcrypt.hash(password, 10);
  user.password = hashed;
  user.otp = null; // مسح OTP بعد الاستخدام
  await user.save();

  return Response.json({ message: 'تم تغيير كلمة المرور بنجاح' });
}
