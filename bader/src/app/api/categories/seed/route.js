import connectDB from "@/lib/db";
import Category from '@/models/Category';

export async function POST() {
  await connectDB();
  const names = [
    'مشاكل الطرق والرصيف',
    'إنارة الشوارع',
    'تراكم النفايات',
    'مشاكل الصرف الصحي',
    'حدائق ومساحات عامة',
    'تلوث بيئي',
    'أخرى'
  ];

  const inserted = await Promise.all(names.map(async name => {
    const exists = await Category.findOne({ name });
    return exists || await new Category({ name }).save();
  }));

  return Response.json({ message: 'تمت إضافة التصنيفات', data: inserted });
}
