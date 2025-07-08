import connectDB from '@/lib/db'; 
import Issue from '@/models/Issue';

export async function PUT(req, { params }) {
  await connectDB();
  const { projectId } = await req.json();

  const updated = await Issue.findByIdAndUpdate(
    params.id,
    { projectId },
    { new: true }
  );

  return Response.json(updated);
}
