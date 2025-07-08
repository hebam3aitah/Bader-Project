import connectDB from '@/lib/db'; 
import User from '@/models/User';
import { getToken } from 'next-auth/jwt';
import jwt from 'jsonwebtoken';

export async function PUT(req) {
  try {
    await connectDB();

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    let userId;

    // ✅ مستخدم Google
    if (token?.email && token?.name) {
      const user = await User.findOne({ email: token.email });
      if (!user) {
        return Response.json({ message: 'المستخدم غير موجود' }, { status: 404 });
      }
      userId = user._id;
    } 
    // ✅ مستخدم JWT
    else {
      const rawToken = req.cookies.get('token')?.value;
      if (!rawToken) {
        return Response.json({ message: 'غير مصرح' }, { status: 401 });
      }

      const decoded = jwt.verify(rawToken, process.env.JWT_SECRET);
      userId = decoded.userId;
    }

    const updates = await req.json();
    console.log('📦 Updates received:', updates);

    // ✅ حدد الحقول المسموحة فقط
    const allowedFields = ['name', 'phone', 'address', 'image', 'location'];
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([key]) => allowedFields.includes(key))
    );
    console.log('🎯 Filtered updates:', filteredUpdates);

    const updatedUser = await User.findByIdAndUpdate(userId, filteredUpdates, { new: true }).select('name email phone address image');

    // ✅ ضمان إرجاع القيم كـ string
    return Response.json({
      message: 'تم تحديث الحساب بنجاح ✅',
      updatedUser: {
        name: updatedUser.name || '',
        email: updatedUser.email || '',
        phone: updatedUser.phone || '',
        address: updatedUser.address || '',
        image: updatedUser.image || '',
      },
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Error in /api/update-profile:', error);
    return Response.json({ message: 'فشل تحديث الحساب ❌' }, { status: 500 });
  }
}
