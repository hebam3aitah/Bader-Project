import connectDB from "@/lib/db";
import User from '@/models/User';
import Project from '@/models/Project';
import Volunteer from '@/models/Volunteer';
import Issue from '@/models/Issue';
import Donation from '@/models/Donation';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const roleFilter = searchParams.get("role");
    const search = searchParams.get("search")?.toLowerCase() || "";
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    let userQuery = {};
    if (roleFilter && roleFilter !== 'all') {
      userQuery.role = roleFilter;
    }
    if (search) {
      userQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const totalUsers = await User.countDocuments(userQuery);
    const users = await User.find(userQuery).skip(skip).limit(limit);

    const result = await Promise.all(
      users.map(async (user) => {
        // عدد المشاريع المبلغ عنها (مشاريع مرتبطة بـ Issues التي بلّغ عنها المستخدم)
        const issuesReported = await Issue.find({ reportedBy: user._id }).select('_id');
        const issueIds = issuesReported.map(issue => issue._id);
        const reportedProjectsCount = await Project.countDocuments({
          createdFromIssue: { $in: issueIds }
        });

        // عدد المشاريع التي تطوع فيها المستخدم
        const volunteeredProjectsCount = await Project.countDocuments({
          volunteers: user._id
        });

        // مجموع التبرعات التي قدمها المستخدم
        const donations = await Donation.aggregate([
          { $match: { donor: user._id } },
          { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
        ]);
        const totalDonations = donations.length > 0 ? donations[0].totalAmount : 0;

        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          reportedProjectsCount,
          volunteeredProjectsCount,
          totalDonations,
        };
      })
    );

    return NextResponse.json({ users: result, total: totalUsers, page, totalPages: Math.ceil(totalUsers / limit) });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'حدث خطأ' }, { status: 500 });
  }
}
