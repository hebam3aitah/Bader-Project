"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  Users,
  FileText,
  Clock,
  Award,
  AlertTriangle,
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    issues: 0,
    newUsersThisWeek: 0,
    newIssuesThisWeek: 0,
    statusChart: [],
    userStats: { total: 0, roles: [] },
    topProjects: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/dashboard/stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("خطأ في جلب الإحصائيات:", err);
      }
    };
    fetchStats();
  }, []);

  const COLORS = ["#8557D3", "#4CAF50", "#FF9800", "#E91E63", "#03A9F4"];

  return (
    <div dir="rtl" className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-l from-[#41225b] to-[#261c2f] text-white p-6 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold">لوحة المعلومات الإدارية</h1>
          <p className="mt-2 opacity-90">نظرة عامة على أداء المنصة</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* الإحصائيات الأساسية */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 border-r-4 border-[#41225b] transform transition-transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">
                  إجمالي المشاريع
                </h3>
                <p className="text-3xl font-bold text-gray-800">
                  {stats.projects}
                </p>
              </div>
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <FileText size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border-r-4 border-green-500 transform transition-transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">
                  إجمالي البلاغات
                </h3>
                <p className="text-3xl font-bold text-gray-800">
                  {stats.issues}
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <AlertTriangle size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border-r-4 border-orange-500 transform transition-transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">
                  إجمالي المستخدمين
                </h3>
                <p className="text-3xl font-bold text-gray-800">
                  {stats.userStats.total}
                </p>
              </div>
              <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                <Users size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border-r-4 border-blue-500 transform transition-transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">
                  النشاط الأسبوعي
                </h3>
                <p className="text-3xl font-bold text-gray-800">
                  {(stats.newUsersThisWeek || 0) +
                    (stats.newIssuesThisWeek || 0)}
                </p>
              </div>
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <TrendingUp size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* المستخدمين والبلاغات الجدد */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                المستخدمين الجدد (آخر 7 أيام)
              </h3>
              <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                <Clock size={20} />
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-3xl font-bold text-blue-600">
                  {stats.newUsersThisWeek || 0}
                </p>
              </div>
              <div className="h-16 w-16 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
                <Users size={32} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                البلاغات الجديدة (آخر 7 أيام)
              </h3>
              <div className="p-2 rounded-full bg-red-100 text-red-600">
                <Clock size={20} />
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-3xl font-bold text-red-600">
                  {stats.newIssuesThisWeek || 0}
                </p>
              </div>
              <div className="h-16 w-16 rounded-full flex items-center justify-center bg-red-100 text-red-600">
                <AlertTriangle size={32} />
              </div>
            </div>
          </div>
        </div>

        {/* الرسوم البيانية */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* حالات المشاريع */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                حالات المشاريع
              </h3>
            </div>
            <div className="border-t pt-4">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.statusChart}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {stats.statusChart.map((entry, index) => (
                      <Cell
                        key={`status-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* أدوار المستخدمين */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                توزيع أدوار المستخدمين
              </h3>
            </div>
            <div className="border-t pt-4">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.userStats.roles}
                    dataKey="count"
                    nameKey="role"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {stats.userStats.roles.map((entry, index) => (
                      <Cell
                        key={`user-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* أعلى 3 مشاريع حسب التبرعات */}
        <div className="w-full max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-1">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-[#41225b]">
                أفضل المشاريع أداءً
              </h3>
              <div className="p-2 rounded-full bg-[#fa9e1b]/20 text-[#fa9e1b]">
                <Award size={20} />
              </div>
            </div>

            {/* عرض الجدول للشاشات المتوسطة والكبيرة (md وأكبر) */}
            <div className="hidden md:block border-t pt-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-right">
                  <thead>
                    <tr>
                      <th className="py-3 px-4 bg-[#41225b]/10 font-semibold text-[#41225b] rounded-r-lg">
                        اسم المشروع
                      </th>
                      <th className="py-3 px-4 bg-[#41225b]/10 font-semibold text-[#41225b] text-center">
                        التبرعات
                      </th>
                      <th className="py-3 px-4 bg-[#41225b]/10 font-semibold text-[#41225b] text-center rounded-l-lg">
                        المتطوعين
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.topProjects?.map((proj, index) => (
                      <tr
                        key={index}
                        className="border-b hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-3 px-4 font-medium text-[#41225b]">
                          {proj.title}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-2 py-1 rounded-full bg-[#fa9e1b]/20 text-[#fa9e1b] text-xs font-semibold">
                            {proj.donationsCount || 0}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-2 py-1 rounded-full bg-[#41225b]/20 text-[#41225b] text-xs font-semibold">
                            {proj.volunteersCount || 0}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* عرض البطاقات للشاشات الصغيرة (أقل من md) */}
            <div className="md:hidden border-t pt-4 space-y-4">
              {stats.topProjects?.map((proj, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-bold text-[#41225b]">{proj.title}</h4>
                  </div>
                  <div className="flex items-center justify-around gap-2">
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-500 mb-1">
                        التبرعات
                      </span>
                      <span className="px-3 py-1 rounded-full bg-[#fa9e1b]/20 text-[#fa9e1b] text-sm font-semibold">
                        {proj.donationsCount || 0}
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-500 mb-1">
                        المتطوعين
                      </span>
                      <span className="px-3 py-1 rounded-full bg-[#41225b]/20 text-[#41225b] text-sm font-semibold">
                        {proj.volunteersCount || 0}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
