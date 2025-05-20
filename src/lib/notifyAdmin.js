import connectDB from '@/lib/connectDb';
import Notification from '@/models/Notification';

export async function sendAdminNotification({ title, message, severity = 'medium', link = '' }) {
  try {
    await connectDB();
    await Notification.create({
      title,
      message,
      severity,
      link,
    });
    console.log('🔔 تم حفظ الإشعار في قاعدة البيانات');
  } catch (err) {
    console.error('❌ فشل حفظ الإشعار:', err);
  }
}
