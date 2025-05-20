import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import { connectDB } from './mongoose';

export async function getCurrentUser() {
  const cookieStore = await  cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    console.log('🔴 لا يوجد توكن');
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await connectDB();
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      console.log('🔴 لم يتم العثور على المستخدم');
      return null;
    }

    console.log('✅ المستخدم الحالي:', user);
    return user;
  } catch (err) {
    console.error('🔴 خطأ أثناء فك التوكن:', err.message);
    return null;
  }
}
