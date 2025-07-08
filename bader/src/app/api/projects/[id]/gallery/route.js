import connectDB from '@/lib/db'; 
import Project from '@/models/Project';

export async function GET(_, { params }) {
  try {
    await connectDB();

    const project = await Project.findById(params.id).select('images');
    if (!project) {
      return new Response(JSON.stringify({ message: 'المشروع غير موجود' }), { status: 404 });
    }

    return Response.json({ images: project.images });
  } catch (error) {
    console.error('فشل تحميل الصور:', error);
    return new Response(JSON.stringify({ message: 'حدث خطأ' }), { status: 500 });
  }
}
