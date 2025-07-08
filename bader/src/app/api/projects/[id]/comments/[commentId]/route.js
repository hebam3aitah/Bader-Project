import { NextResponse } from 'next/server';
import connectDB from '@/lib/db'; 
import Comment from '@/models/Comment';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const comment = await Comment.findById(params.commentId);

    if (!comment) {
      return NextResponse.json({ error: 'التعليق غير موجود' }, { status: 404 });
    }

    // فقط المستخدم صاحب التعليق يمكنه الحذف
    if (comment.user.toString() !== session.user.id) {
      return NextResponse.json({ error: 'ليس لديك صلاحية لحذف هذا التعليق' }, { status: 403 });
    }

    await comment.deleteOne();

    return NextResponse.json({ message: 'تم حذف التعليق بنجاح' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { error: 'فشل حذف التعليق', details: error.message },
      { status: 500 }
    );
  }
}
