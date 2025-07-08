
import connectDB from "@/lib/db";
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import nodemailer from 'nodemailer';
import Joi from 'joi';
import Notification from '@/models/Notification'; // ⬅️ تأكد مستورد موديل Notification بالأعلى

export async function POST(req) {
  try {
    await connectDB();

    const { email, otp } = await req.json();

    // ✅ التحقق باستخدام Joi
    const schema = Joi.object({
      email: Joi.string().email({ tlds: { allow: false } }).required().messages({
        "string.empty": "البريد الإلكتروني مطلوب",
        "string.email": "صيغة البريد غير صحيحة",
      }),
      otp: Joi.string().length(4).pattern(/^\d+$/).required().messages({
        "string.empty": "رمز التحقق مطلوب",
        "string.length": "رمز التحقق يجب أن يكون 4 أرقام",
        "string.pattern.base": "رمز التحقق يجب أن يحتوي على أرقام فقط",
      }),
    });

    const { error } = schema.validate({ email, otp });
    if (error) {
      return Response.json({ message: error.details[0].message }, { status: 400 });
    }

    // ✅ البحث عن المستخدم
    const user = await User.findOne({ email });
    if (!user) {
      return Response.json({ message: 'هذا البريد غير مسجل' }, { status: 404 });
    }

    if (user.IsConfirmed) {
      return Response.json({ message: 'الحساب مفعل مسبقًا' }, { status: 200 });
    }

    if (user.otp !== otp) {
      return Response.json({ message: 'رمز التحقق غير صحيح' }, { status: 401 });
    }

    // ✅ تفعيل الحساب
    user.IsConfirmed = true;
    user.otp = null;
    await user.save();

    // ✅ إنشاء إشعار ترحيب داخل الموقع
await Notification.create({
  title: '🎉 تم تفعيل حسابك!',
  message: `مرحبًا ${user.name}! حسابك أصبح جاهز للاستخدام الكامل.`,
  type: 'welcome',
  severity: 'low',
  user: user._id,
});

    // ✅ توليد التوكن
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // ✅ تخزين التوكن في الكوكيز
    cookies().set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    // ✅ إرسال رسالة ترحيب بعد التفعيل
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
      subject: 'تم تفعيل حسابك',
      html: `
        <div style="direction: rtl; font-family: Tahoma, sans-serif; padding: 20px;">
          <h2 style="color: #31124b;">🎉 تهانينا!</h2>
          <p style="font-size: 15px;">تم تفعيل حسابك بنجاح في منصة <strong>بادر</strong>.</p>
          <p style="font-size: 14px; color: #666;">يمكنك الآن تسجيل الدخول والبدء باستخدام المنصة.</p>
          <div style="margin-top: 20px;">
            <a href="${process.env.BASE_URL}/login" 
               style="display: inline-block; padding: 10px 20px; background-color: #31124b; color: white; text-decoration: none; border-radius: 5px;">
              تسجيل الدخول الآن
            </a>
          </div>
        </div>
      `
    });

    return Response.json({ message: '✅ تم التحقق وتفعيل الحساب' }, { status: 200 });

  } catch (err) {
    console.error('❌ OTP Verify Error:', err);
    return Response.json({ message: '❌ حدث خطأ أثناء التحقق من الرمز' }, { status: 500 });
  }
}
