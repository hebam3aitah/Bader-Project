import connectDB from '@/lib/db';
import Project from '@/models/Project';

export async function GET() {
  await connectDB();
  const projects = await Project.find({})
    .populate('category', 'name')
    .populate('issue', 'Title');
  return Response.json(projects);
}
