import connectDB from '@/lib/db';
import Project from '@/models/Project';

export async function GET() {
  await connectDB();

  try {
    const projects = await Project.find({ status: 'available' }).lean();
    return Response.json({ projects });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Failed to fetch available projects' }), { status: 500 });
  }
}
