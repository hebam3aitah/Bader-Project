import connectDB from "@/lib/db";
import User from '@/models/User';
import nodemailer from 'nodemailer';

export async function POST(req) {
  await connectDB();
  const { email } = await req.json();

  if (!email) {
    return Response.json({ message: 'البريد الإلكتروني مطلوب' }, { status: 400 });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return Response.json({ message: 'هذا البريد غير مسجل' }, { status: 404 });
  }

  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  user.otp = otp;
  await user.save();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"بادر" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'رمز إعادة تعيين كلمة المرور',
    text: `رمز التحقق هو: ${otp}`,
  });

  return Response.json({ message: 'تم إرسال رمز التحقق للبريد الإلكتروني' });
}
