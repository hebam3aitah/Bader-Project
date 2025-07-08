// /app/api/donations/stats/route.js

import { NextResponse } from 'next/server';
import connectDB from '@/lib/db'; 
import Donation from '@/models/Donation';

export async function GET() {
  try {
    await connectDB();

    const projectStats = await Donation.aggregate([
      { $match: { project: { $ne: null } } },
      { $group: { _id: '$project', total: { $sum: '$amount' } } },
    ]);

    const organizationStats = await Donation.aggregate([
      { $match: { organization: { $ne: null } } },
      { $group: { _id: '$organization', total: { $sum: '$amount' } } },
    ]);

    const generalStats = await Donation.aggregate([
      { $match: { isGeneral: true } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    return NextResponse.json({
      projectStats,
      organizationStats,
      generalStats: generalStats[0]?.total || 0,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'فشل تحميل الإحصائيات' }, { status: 500 });
  }
}
