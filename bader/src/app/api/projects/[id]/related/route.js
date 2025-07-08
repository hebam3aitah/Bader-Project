import connectDB from '@/lib/db';
import Project from '@/models/Project';

export async function GET(_, { params }) {
  try {
    await connectDB();

    // جلب المشروع الحالي للحصول على التصنيف
    const currentProject = await Project.findById(params.id);
    if (!currentProject) {
      return new Response(JSON.stringify({ message: 'المشروع غير موجود' }), { status: 404 });
    }

    // جلب مشاريع بنفس التصنيف لكن غير المشروع الحالي
    const related = await Project.find({
      _id: { $ne: currentProject._id },
      category: currentProject.category,
    })
      .sort({ reportedAt: -1 })
      .limit(3);

    const formatted = related.map((proj) => ({
      id: proj._id,
      title: proj.title,
      image: proj.images?.[0] || '/api/placeholder/400/200',
    }));

    return Response.json(formatted);
  } catch (error) {
    console.error('فشل تحميل المشاريع المشابهة:', error);
    return new Response(JSON.stringify({ message: 'فشل تحميل المشاريع المشابهة' }), {
      status: 500,
    });
  }
}
