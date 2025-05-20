"use client";

import { useState } from "react";
import Head from "next/head";
import {
  FaHandsHelping,
  FaUser,
  FaBriefcase,
  FaCalendarAlt,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";
import axios from "axios"; 
import { useSearchParams } from "next/navigation";
import Swal from 'sweetalert2';

export default function VolunteerPage() {
  const searchParams = useSearchParams();
  const project_id = searchParams.get("project_id");

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    job: "",
    phone: "",
    email: "",
    experience: "",
    interests: "",
    availability: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // في دالة handleSubmit:
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `/api/volunteer?project_id=${project_id || ""}`,
        formData
      );
if (response.data.message === "تم تسجيلك كمتطوع بنجاح!") {
  Swal.fire({
    title: 'شكراً لتسجيلك!',
    text: 'سنتواصل معك قريباً.',
    icon: 'success',
    confirmButtonText: 'موافق',
  });
        setFormData({
          name: "",
          age: "",
          job: "",
          phone: "",
          email: "",
          experience: "",
          interests: "",
          availability: "",
        });
      } else {
      Swal.fire({
  title: 'رسالة من السيرفر',
  text: response.data.message,
  icon: response.data.status === 'warning' ? 'warning' : 'error',
});

      }
    } catch (error) {
      console.error(
        "فشل التسجيل:",
        error.response?.data?.message || error.message
      );
Swal.fire({
  title: 'فشل التسجيل',
  text: 'أنت مسجل بالفعل كمتطوع.',
  icon: 'error',
  confirmButtonText: 'حسناً',
});    }
  };

  return (
    <div className="min-h-screen ">
      <Head>
        <title>التسجيل كمتطوع</title>
        <meta name="description" content="نموذج التسجيل كمتطوع" />
      </Head>

      <main className="container mt-6 mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* رأس الصفحة */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center p-4 bg-[#fa9e1b] rounded-full mb-4">
              <FaHandsHelping className="text-white text-3xl" />
            </div>
               <h1 className="text-5xl font-bold mb-4 text-[#31124b]">
              سجل كمتطوع
            </h1>
                    <p className="mt-6 text-xl text-[#31124b] font-medium">

              انضم إلينا وكن جزءاً من التغيير الإيجاب
            </p>
          </div>
        </div>
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* رأس النموذج */}
          <div
            className="bg-white rounded-lg shadow-lg overflow-hidden"
            dir="rtl"
          >
            <div className="bg-gradient-to-r from-[#31124b] to-[#411866] py-6 px-8">
              <h2 className="text-2xl font-bold text-white">
                نموذج التسجيل كمتطوع{" "}
              </h2>
              <p className="text-[#fa9e1b] text-opacity-90 mt-5  ">
                الحقول المطلوبة مميزة بعلامة (*)
              </p>
            </div>
          </div>

          {/* نموذج التسجيل */}
          <form
            onSubmit={handleSubmit}
            className="p-8 space-y-6 bg-gray-50 "
            dir="rtl"
          >
            <div className="grid md:grid-cols-2 gap-6">
              {/* الاسم الكامل */}
              <div dir="ltr">
                <label
                  className="block text-right mb-2 font-semibold text-[#31124b]"
                  htmlFor="name"
                >
                  <span className="flex items-center justify-end gap-2">
                    <span className="text-red-500">*</span>الاسم الكامل
                    <FaUser className="text-[#31124b]" />
                  </span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#31124b] text-right"
                  placeholder="أدخل اسمك الكامل"
                />
              </div>

              {/* العمر */}
              <div>
                <label
                  dir="ltr"
                  className="block text-right mb-2 font-semibold text-[#31124b]"
                  htmlFor="age"
                >
                  <span className="flex items-center justify-end gap-2">
                    <span className="text-red-500">*</span>العمر
                    <FaCalendarAlt className="text-[#31124b]" />
                  </span>
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  min="16"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#31124b] text-right"
                  placeholder="أدخل عمرك"
                  dir="rtl"
                />
              </div>

              {/* الوظيفة/المهنة */}
              <div dir="ltr">
                <label
                  className="block text-right mb-2 font-semibold text-[#31124b]"
                  htmlFor="job"
                >
                  <span className="flex items-center justify-end gap-2">
                    <span className="text-red-500">*</span>الوظيفة/المهنة
                    <FaBriefcase className="text-[#31124b]" />
                  </span>
                </label>
                <input
                  type="text"
                  id="job"
                  name="job"
                  value={formData.job}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#31124b] text-right"
                  placeholder="أدخل وظيفتك الحالية"
                  dir="rtl"
                />
              </div>

              {/* رقم الهاتف */}
              <div dir="ltr">
                <label
                  className="block text-right mb-2 font-semibold text-[#31124b]"
                  htmlFor="phone"
                >
                  <span className="flex items-center justify-end gap-2">
                    <span className="text-red-500">*</span>رقم الهاتف
                    <FaPhone className="text-[#31124b]" />
                  </span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#31124b] text-right"
                  placeholder="أدخل رقم هاتفك"
                  dir="rtl"
                />
              </div>

              {/* البريد الإلكتروني */}
              <div dir="ltr">
                <label
                  className="block text-right mb-2 font-semibold text-[#31124b]"
                  htmlFor="email"
                >
                  <span className="flex items-center justify-end gap-2">
                    <span className="text-red-500">*</span>البريد الإلكتروني
                    <FaEnvelope className="text-[#31124b]" dir="rtl" />
                  </span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#31124b] text-right"
                  placeholder="أدخل بريدك الإلكتروني"
                />
              </div>

              {/* أوقات التطوع المفضلة */}
              <div dir="ltr">
                <label
                  className="block text-right mb-2 font-semibold text-[#31124b]"
                  htmlFor="availability"
                >
                  <span className="text-red-500 mr-2">*</span>
                  أوقات التطوع المفضلة
                </label>

                <select
                  id="availability"
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#31124b] text-right"
                >
                  <option value="">اختر الوقت المناسب</option>
                  <option value="weekdays_morning">
                    أيام الأسبوع - صباحًا
                  </option>
                  <option value="weekdays_evening">أيام الأسبوع - مساءً</option>
                  <option value="weekends">عطلة نهاية الأسبوع</option>
                  <option value="flexible">مرن / حسب الحاجة</option>
                </select>
              </div>
            </div>

            {/* الخبرات السابقة */}
            <div>
              <label
                className="block text-right mb-2 font-semibold text-[#31124b]"
                htmlFor="experience"
              >
                الخبرات السابقة في مجال التطوع (إن وجدت)
              </label>
              <textarea
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#31124b] text-right"
                placeholder="اذكر خبراتك السابقة في العمل التطوعي"
              ></textarea>
            </div>

            {/* المهارات والاهتمامات */}
            <div>
              <label
                className="block text-right mb-2 font-semibold text-[#31124b]"
                htmlFor="interests"
              >
                المهارات والاهتمامات
              </label>
              <textarea
                id="interests"
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#31124b] text-right"
                placeholder="اذكر مهاراتك واهتماماتك التي يمكن أن تفيد في العمل التطوعي"
              ></textarea>
            </div>

            {/* زر التقديم */}
            <div className="flex justify-center mt-8">
              <button
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-[#31124b] to-[#fa9e1b] text-white font-bold rounded-full transition-transform transform hover:scale-105 hover:shadow-lg"
              >
                تقديم طلب التطوع
              </button>
            </div>
          </form>

          {/* التذييل */}
          <div className="bg-gray-100 p-6 text-center border-t border-gray-200">
            <p className="text-[#31124b]">
              شكراً لاهتمامك بالانضمام إلينا! سنقوم بمراجعة طلبك والتواصل معك في
              أقرب وقت ممكن.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
