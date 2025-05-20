'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function EditProjectPage({ params }) {
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    status: 'in-progress',
    priority: 'medium',
  });

  const projectId = params.id;

  useEffect(() => {
    axios.get(`/api/projects/${projectId}`).then(res => {
      const p = res.data;
      setProject(p);
      setFormData({
        title: p.title,
        description: p.description,
        location: p.location || '',
        status: p.status,
        priority: p.priority,
      });
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/projects/${projectId}`, formData);
      router.push('/dashboard/projects');
    } catch (error) {
      console.error('فشل في تعديل المشروع:', error);
    }
  };

  if (!project) return <p className="p-6">جاري تحميل البيانات...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto" dir="rtl">
      <h1 className="text-2xl font-bold mb-4">تعديل المشروع</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">العنوان</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">الوصف</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">الموقع</label>
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">الحالة</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="pending">قيد الانتظار</option>
            <option value="in-progress">قيد التنفيذ</option>
            <option value="completed">مكتمل</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">الأولوية</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="urgent">عاجلة</option>
            <option value="medium">متوسطة</option>
            <option value="low">منخفضة</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded"
        >
          حفظ التعديلات
        </button>
      </form>
    </div>
  );
}