
import connectDB from "@/lib/db";
import Volunteer from '@/models/Volunteer';
import Project from '@/models/Project';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 5;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const skip = (page - 1) * limit;

    const query = {};
    if (status !== 'all') query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const volunteers = await Volunteer.find(query)
      .populate('projectAssigned', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await Volunteer.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({ volunteers, totalPages });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'فشل في جلب البيانات' }, { status: 500 });
  }
}

