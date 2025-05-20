"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const arabicMonths = {
  0: "يناير",
  1: "فبراير",
  2: "مارس",
  3: "أبريل",
  4: "مايو",
  5: "يونيو",
  6: "يوليو",
  7: "أغسطس",
  8: "سبتمبر",
  9: "أكتوبر",
  10: "نوفمبر",
  11: "ديسمبر",
};

export default function CompletedVolunteerActivity({ completedProjects }) {
  const groupProjectsByMonth = (projects) => {
    const monthCounts = {};

    projects.forEach((project) => {
      const date = new Date(project.lastStatusUpdate);
      const month = date.getMonth();
      const monthName = arabicMonths[month];

      if (!monthCounts[monthName]) {
        monthCounts[monthName] = 0;
      }

      monthCounts[monthName]++;
    });

    return Object.entries(monthCounts)
      .sort((a, b) => {
        const monthIndexA = Object.values(arabicMonths).indexOf(a[0]);
        const monthIndexB = Object.values(arabicMonths).indexOf(b[0]);
        return monthIndexA - monthIndexB;
      })
      .map(([month, count]) => ({
        name: month,
        completed: count,
      }));
  };

  const chartData = useMemo(() => {
    if (completedProjects && completedProjects.length > 0) {
      return groupProjectsByMonth(completedProjects);
    }
    return [];
  }, [completedProjects]);

  if (!completedProjects || completedProjects.length === 0) {
    return (
      <div className="h-full w-full flex flex-col">
        <h3 className="text-lg font-medium text-[#31124b] mb-3 text-right">
          نشاط التطوع الشهري المكتمل
        </h3>
        <div className="flex-grow flex items-center justify-center text-gray-500">
          لا توجد مشاريع مكتملة حتى الآن
        </div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="h-full w-full flex flex-col">
        <h3 className="text-lg font-medium text-[#31124b] mb-3 text-right">
          نشاط التطوع الشهري المكتمل
        </h3>
        <div className="flex-grow flex items-center justify-center text-gray-500">
          جاري تحميل البيانات...
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col">
      <h3 className="text-lg font-medium text-[#31124b] mb-3 text-right">
        نشاط التطوع الشهري المكتمل
      </h3>
      <div className="text-xs text-gray-500 mb-2 text-right">
        إجمالي المشاريع المكتملة: {completedProjects.length}
      </div>
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 5,
              right: 5,
              left: 5,
              bottom: 25,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={0} textAnchor="end" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="completed" name="المهام المكتملة" fill="#31124b" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
