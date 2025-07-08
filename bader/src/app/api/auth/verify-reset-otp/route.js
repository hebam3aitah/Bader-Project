import connectDB from "@/lib/db";
import User from '@/models/User';

export async function POST(req) {
  await connectDB();
  const { email, otp } = await req.json();

  const user = await User.findOne({ email });
  if (!user || user.otp !== otp) {
    return Response.json({ message: 'رمز التحقق غير صحيح' }, { status: 400 });
  }

  return Response.json({ message: 'رمز التحقق صحيح' });
}
