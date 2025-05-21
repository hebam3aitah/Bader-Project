import { connectDB } from '@/lib/mongoose';
import mongoose from 'mongoose';

const Report = mongoose.models.Report || mongoose.model("Report");

export async function DELETE(_, { params }) {
  try {
    await connectDB();

    const { id } = params;

    const deleted = await Report.findByIdAndDelete(id);

    if (!deleted) {
      return new Response(JSON.stringify({ message: 'البلاغ غير موجود' }), { status: 404 });
    }

    return Response.json({ message: 'تم حذف البلاغ بنجاح' });
  } catch (error) {
    console.error("فشل في حذف البلاغ:", error);
    return new Response(JSON.stringify({ message: 'خطأ في حذف البلاغ' }), { status: 500 });
  }
}
