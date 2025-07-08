import connectDB from '@/lib/db'; 
import Project from '@/models/Project';
import Issue from '@/models/Issue';
import User from '@/models/User';

export async function GET() {
  try {
    await connectDB();

    const [projectsCount, issuesCount, projectStatusCounts, userRolesCount] = await Promise.all([
      Project.countDocuments(),
      Issue.countDocuments(),
      Project.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }])
    ]);

    const statusChart = projectStatusCounts.map(item => ({
      name: translateStatus(item._id),
      value: item.count
    }));

    const userStats = {
      total: userRolesCount.reduce((sum, item) => sum + item.count, 0),
      roles: userRolesCount.map((item) => ({
        role: translateRole(item._id),
        count: item.count
      }))
    };

    // 🔹 المستخدمين الجدد خلال الأسبوع
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [newUsersThisWeek, newIssuesThisWeek] = await Promise.all([
      User.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      Issue.countDocuments({ createdAt: { $gte: sevenDaysAgo } })
    ]);

    // 🔹 أعلى 3 مشاريع حسب عدد التبرعات
    const topProjects = await Project.find()
      .sort({ donations: -1 })
      .limit(3)
      .select('title donations volunteers');

    const topProjectsFormatted = topProjects.map(p => ({
      title: p.title,
      donationsCount: p.donations,
      volunteersCount: p.volunteers.length
    }));

    return Response.json({
      projects: projectsCount,
      issues: issuesCount,
      statusChart,
      userStats,
      newUsersThisWeek,
      newIssuesThisWeek,
      topProjects: topProjectsFormatted
    });

  } catch (error) {
    console.error('📛 فشل في API الإحصائيات:', error);
    return new Response(JSON.stringify({ error: 'فشل في جلب الإحصائيات' }), { status: 500 });
  }
}

function translateStatus(status) {
  switch (status) {
    case 'in-progress': return 'قيد التنفيذ';
    case 'completed': return 'مكتمل';
    case 'pending': return 'قيد الانتظار';
    default: return status;
  }
}

function translateRole(role) {
  switch (role) {
    case 'volunteer': return 'متطوع';
    case 'donor': return 'متبرع';
    case 'supporter': return 'داعم';
    case 'admin': return 'أدمن';
    case 'user': return 'مستخدم';
    default: return role || 'غير محدد';
  }
}
