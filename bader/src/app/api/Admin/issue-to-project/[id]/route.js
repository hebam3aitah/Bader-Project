import connectDB from "@/lib/db";
import Project from '@/models/Project';

export async function GET(_, context) {
  const params = await context.params
  const {id: ProjectId } = params
  
  await connectDB();
  const project = await Project.findById(ProjectId).populate('category', 'name');
  return Response.json(project);
}

export async function PUT(req, { params }) {
  await connectDB();
  const data = await req.json();
  console.log("daaattttaaaaa" , data)
  const updated = await Project.findByIdAndUpdate(params.id, data, { new: true });
  return Response.json(updated);
}

export async function DELETE(_, { params }) {
  await connectDB();
  await Project.findByIdAndDelete(params.id);
  return Response.json({ message: 'تم حذف المشروع' });
}