// app/dashboard/projects/[id]/page.js
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    if (id) {
      axios.get(`/api/projects/${id}`).then((res) => {
        setProject(res.data);
      });
    }
  }, [id]);

  if (!project) return <div className="p-6">جاري تحميل البيانات...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">تفاصيل المشروع</h1>
      <p><strong>العنوان:</strong> {project.title}</p>
      <p><strong>الوصف:</strong> {project.description}</p>
      <p><strong>التصنيف:</strong> {project.category?.name}</p>
      {/* يمكنك عرض بيانات إضافية هنا */}
    </div>
  );
}
