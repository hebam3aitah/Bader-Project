
import connectDB from '@/lib/db'; 
import Notification from '@/models/Notification';

export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const notification = await Notification.findByIdAndUpdate(
      id,
      { seen: true },
      { new: true }
    );

    if (!notification) {
      return new Response('Notification not found', { status: 404 });
    }

    return Response.json(notification);
  } catch (error) {
    console.error('Error updating notification:', error);
    return new Response('Failed to update notification', { status: 500 });
  }
}
