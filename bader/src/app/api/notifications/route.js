import connectDB from '@/lib/db'; 
import Notification from '@/models/Notification';

export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();

    const { title, message, severity = 'medium', link = '', user = null } = data;

    const notification = await Notification.create({
      title,
      message,
      severity,
      link,
      user,
    });

    return Response.json(notification);
  } catch (error) {
    console.error('Error creating notification:', error);
    return new Response('Failed to create notification', { status: 500 });
  }
}
export async function GET(req) {
    try {
      await connectDB();
      const { searchParams } = new URL(req.url);
      const userId = searchParams.get('user'); // لو بدك فلترة لمستخدم معين فقط
  
      let filter = {};
      if (userId) {
        filter.user = userId;
      }
  
      const notifications = await Notification.find(filter)
        .sort({ createdAt: -1 });
  
      return Response.json(notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return new Response('Failed to fetch notifications', { status: 500 });
    }
  }
  
