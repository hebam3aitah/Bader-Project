import connectDB from '@/lib/db'; 
import Issue from '@/models/Issue';

export async function GET() {
  try {
    await connectDB();

    // نجلب كل المشاكل (لاحقًا نقدر نضيف فلترة)
    const issues = await Issue.find({})
      .populate('Category', 'name')
      .populate('projectId', 'title status');

    return Response.json(issues);
  } catch (error) {
    console.error('فشل في جلب المشاكل:', error);
    return new Response('خطأ داخلي', { status: 500 });
  }
}
