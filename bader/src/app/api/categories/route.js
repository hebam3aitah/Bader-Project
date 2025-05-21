import { connectDB } from '@/lib/mongoose';
import Category from '@/models/Category';

export async function GET() {
  await connectDB();
  const categories = await Category.find();
  return Response.json(categories);
}
