
import connectDB from "@/lib/db";
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Joi from 'joi'; // ⬅️ استدعاء Joi

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();
      // ✅ تحقق باستخدام Joi
      const schema = Joi.object({
        email: Joi.string().email({ tlds: { allow: false } }).required().messages({
          'string.empty': 'البريد الإلكتروني مطلوب',
          'string.email': 'صيغة البريد غير صحيحة',
        }),
        password: Joi.string().min(6).required().messages({
          'string.empty': 'كلمة المرور مطلوبة',
          'string.min': 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
        }),
      });
  
      const { error } = schema.validate({ email, password });
  
      if (error) {
        return new Response(JSON.stringify({ message: error.details[0].message }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

    const user = await User.findOne({ email });

    // if (!user) {
    //   return new Response(JSON.stringify({ message: 'البريد غير مسجل' }), { status: 404 });
    // }

   
    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) {
    //   return new Response(JSON.stringify({ message: 'كلمة المرور غير صحيحة' }), { status: 401 });
    // }

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return new Response(JSON.stringify({ message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' }), { status: 401 });
    }
    if (!user.IsConfirmed) {
      return new Response(JSON.stringify({ message: 'يرجى تأكيد البريد الإلكتروني أولاً' }), { status: 403 });
    }

    
    const token = jwt.sign(
      { userId: user._id, role: user.role || 'user' }, // ⬅️ أضفنا role هنا
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // إعداد الكوكي
    const cookie = `token=${token}; Path=/; HttpOnly; Max-Age=604800; SameSite=Strict; ${
      process.env.NODE_ENV === 'production' ? 'Secure;' : ''
    }`;

    return new Response(JSON.stringify({ message: 'تم تسجيل الدخول بنجاح' }), {
      status: 200,
      headers: {
        'Set-Cookie': cookie,
        'Content-Type': 'application/json',
      },
    });

  } catch (err) {
    console.error('Login Error:', err);
    return new Response(JSON.stringify({ message: 'حدث خطأ أثناء تسجيل الدخول' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
