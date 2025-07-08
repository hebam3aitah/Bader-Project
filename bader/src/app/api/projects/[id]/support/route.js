import connectDB from '@/lib/db';
import Project from '@/models/Project';

export async function GET(_, { params }) {
  try {
    await connectDB();

    const project = await Project.findById(params.id);
    if (!project) {
      return new Response(JSON.stringify({ message: 'المشروع غير موجود' }), { status: 404 });
    }

    const result = {
      donations: project.donations || 0,
      volunteers: project.volunteers || 0,
    };

    return Response.json(result);
  } catch (error) {
    console.error('فشل تحميل بيانات الدعم:', error);
    return new Response(JSON.stringify({ message: 'خطأ في الخادم' }), { status: 500 });
  }
}
