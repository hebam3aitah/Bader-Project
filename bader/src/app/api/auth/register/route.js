
import connectDB from "@/lib/db";
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import Joi from 'joi';

export async function POST(req) {
  try {
    await connectDB();

    const { name, email, password, phone, address } = await req.json();

    // ✅ التحقق باستخدام Joi
    const schema = Joi.object({
      name: Joi.string().min(3).required().messages({
        "string.empty": "الاسم مطلوب",
        "string.min": "الاسم يجب أن يكون 3 أحرف على الأقل",
      }),
      email: Joi.string().email({ tlds: { allow: false } }).required().messages({
        "string.empty": "البريد الإلكتروني مطلوب",
        "string.email": "البريد الإلكتروني غير صالح",
      }),
      password: Joi.string()
        .min(8)
        .pattern(new RegExp('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[!@#$%^&*])'))
        .required()
        .messages({
          "string.empty": "كلمة المرور مطلوبة",
          "string.min": "كلمة المرور يجب أن تكون 8 أحرف على الأقل",
          "string.pattern.base": "كلمة المرور يجب أن تحتوي على حرف، رقم، ورمز",
        }),
      phone: Joi.string().pattern(/^07\d{8}$/).required().messages({
        "string.empty": "رقم الهاتف مطلوب",
        "string.pattern.base": "رقم الهاتف يجب أن يبدأ بـ 07 ويكون 10 أرقام",
      }),
      address: Joi.string().required().messages({
        "string.empty": "العنوان مطلوب",
      }),
    });

    const { error } = schema.validate({ name, email, password, phone, address });

    if (error) {
      return Response.json({ message: error.details[0].message }, { status: 400 });
    }

    // ✅ التأكد من عدم تكرار البريد
    const existing = await User.findOne({ email });
    if (existing) {
      return Response.json({ message: 'البريد الإلكتروني مستخدم مسبقًا' }, { status: 409 });
    }

    // ✅ تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ توليد رمز التحقق
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      IsConfirmed: false,
      otp,
    });

    await user.save();
   
    // ✅ إرسال الإيميل بشكل HTML أنيق
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
      subject: 'رمز التحقق من البريد الإلكتروني',
      html: `
      <div style="font-family: Tahoma, sans-serif; direction: rtl; padding: 20px; background-color: #f4f4f4;">
        <div style="max-width: 500px; margin: auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <h2 style="color: #31124b; text-align: center;">مرحبًا بك في <span style="color:#fa9e1b;">بادر</span>!</h2>
          <p style="text-align: center; color: #444;">رمز التحقق الخاص بك هو:</p>
          <div style="font-size: 32px; font-weight: bold; color: #fa9e1b; text-align: center; margin: 20px 0;">${otp}</div>
          <p style="text-align: center;">يرجى إدخال هذا الرمز في صفحة التحقق لتفعيل حسابك.</p>
          <div style="text-align: center; margin-top: 20px;">
            <a href="${process.env.BASE_URL}/EmailVerificationPage" style="background: #31124b; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">الذهاب إلى صفحة التحقق</a>
          </div>
          <hr style="margin: 30px 0;" />
          <p style="text-align: center; font-size: 12px; color: #999;">إذا لم تقم بطلب إنشاء الحساب، يرجى تجاهل هذا البريد.</p>
        </div>
      </div>
      `,
    });

    return Response.json({ message: 'تم إرسال رمز التحقق إلى بريدك الإلكتروني' }, { status: 200 });

  } catch (err) {
    console.error('❌ Register Error:', err);
    return Response.json({ message: 'حدث خطأ أثناء التسجيل' }, { status: 500 });
  }
}
