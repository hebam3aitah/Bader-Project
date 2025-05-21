"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import {
 FaBuilding 
} from "react-icons/fa";

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: "",
    organization: "",
    email: "",
    phone: "",
    supportType: "",
    category: "",
    message: "",
    image: null,
  });

  const [submitted, setSubmitted] = useState(false);
  const [supporters, setSupporters] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

useEffect(() => {
    const fetchSupporters = async () => {
      try {
        const res = await fetch("/api/support");
        const data = await res.json();
        setSupporters(data.supporters || []);
      } catch (err) {
        console.error("فشل في جلب الداعمين:", err);
      }
    };

    fetchSupporters();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({ ...prev, image: null }));
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let imageUrl = "";

    if (formData.image) {
      const imgData = new FormData();
      imgData.append("file", formData.image);
      imgData.append("upload_preset", "bader-preset");

      try {
        const imgRes = await fetch(
          "https://api.cloudinary.com/v1_1/daaw7azkn/image/upload",
          {
            method: "POST",
            body: imgData,
          }
        );
        const imgResult = await imgRes.json();
        imageUrl = imgResult.secure_url;
      } catch (err) {
        toast.error("فشل رفع الصورة");
        setLoading(false);
        return;
      }
    }

    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          image: imageUrl ? imageUrl : null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "تم إرسال الطلب بنجاح");
        setSubmitted(true);
        setFormData({
          name: "",
          organization: "",
          email: "",
          phone: "",
          supportType: "",
          category: "",
          message: "",
          image: null,
        });
        setImagePreview(null);
      } else {
        toast.error(data.message || "فشل الإرسال");
      }
    } catch (error) {
      console.error("فشل الاتصال بالخادم", error);
      toast.error("حدث خطأ في الإرسال");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Head>
        <title>كن داعماً لنا</title>
        <meta name="description" content="صفحة الدعم والمساهمة" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-gradient-to-r mt-5  text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
          
        </div>
       
        <div className="container mx-auto px-4 text-center relative z-10">
           <div className="inline-flex items-center justify-center p-4 bg-[#fa9e1b] rounded-full mb-4">
                      < FaBuilding  className="text-white text-3xl" />
                    </div>
          <h1 className="text-5xl font-bold mb-4 text-[#31124b]">كن داعماً</h1>
          <p className="mt-2 text-xl text-[#31124b] font-medium">
            ساهم معنا في تحقيق أهدافنا وبناء مستقبل أفضل
          </p>
        </div>
      </header>

      <main className="container  mx-auto px-4 " dir="rtl">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
            <div className="bg-gradient-to-r from-[#31124b] to-[#411866] p-8">
              <h2 className="text-3xl font-bold text-white">
                انضم إلينا كداعم
              </h2>
              <p className="text-[#fa9e1b] mt-3 text-lg">
                املأ النموذج أدناه للمساهمة في دعم مشاريعنا
              </p>
            </div>

            {submitted ? (
              <div className="p-12 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 animate-pulse">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="mt-6 text-2xl font-semibold text-gray-900">
                  تم إرسال بيانات الدعم بنجاح!
                </h3>
                <p className="mt-3 text-gray-600 text-lg">
                  شكراً لك على تقديم الدعم. سنتواصل معك قريباً.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-8 px-8 py-3 bg-[#fa9e1b] text-white rounded-lg hover:bg-[#e8900a] transition duration-300 transform hover:scale-105 font-medium"
                >
                  تقديم طلب دعم آخر
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-8 space-y-6  bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-[#31124b] transition-colors"
                    >
                      الاسم الكامل
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#fa9e1b] focus:border-[#fa9e1b] transition-all"
                      placeholder="أدخل اسمك الكامل"
                    />
                  </div>

                  <div className="group">
                    <label
                      htmlFor="organization"
                      className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-[#31124b] transition-colors"
                    >
                      اسم المؤسسة
                    </label>
                    <input
                      type="text"
                      id="organization"
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#fa9e1b] focus:border-[#fa9e1b] transition-all"
                      placeholder="أدخل اسم المؤسسة (اختياري)"
                    />
                  </div>

                  <div className="group">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-[#31124b] transition-colors"
                    >
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#fa9e1b] focus:border-[#fa9e1b] transition-all"
                      placeholder="أدخل بريدك الإلكتروني"
                    />
                  </div>

                  <div className="group">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-[#31124b] transition-colors"
                    >
                      رقم الهاتف
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#fa9e1b] focus:border-[#fa9e1b] transition-all"
                      placeholder="أدخل رقم هاتفك"
                      dir="rtl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-[#31124b] transition-colors"
                    >
                      نوع الجهة
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#fa9e1b] focus:border-[#fa9e1b] transition-all appearance-none bg-white"
                    >
                      <option value="">اختر نوع الجهة</option>
                      <option value="companies">شركات خاصة</option>
                      <option value="governmental">جهة حكومية</option>
                      <option value="ngos">منظمة غير ربحية</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2 text-gray-700"></div>
                  </div>
                  <div className="group">
                    <label
                      htmlFor="image"
                      className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-[#31124b] transition-colors"
                    >
                      صورة الجهة (اختياري)
                    </label>
                    <div className="mt-1 flex items-center space-x-4 space-x-reverse">
                      <label className="cursor-pointer flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#fa9e1b] transition-colors">
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="معاينة"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-10 w-10 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <span className="mt-2 text-xs text-gray-500">
                              اختر صورة
                            </span>
                          </>
                        )}
                        <input
                          type="file"
                          id="image"
                          name="image"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                      {imagePreview && (
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            setFormData((prev) => ({ ...prev, image: null }));
                          }}
                          className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="group">
                  <label
                    htmlFor="supportType"
                    className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-[#31124b] transition-colors"
                  >
                    نوع الدعم
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
                    {[
                      {
                        value: "مالي",
                        icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                      },
                      {
                        value: "عيني",
                        icon: "M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11",
                      },
                      {
                        value: "تطوعي",
                        icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
                      },
                      {
                        value: "آخر",
                        icon: "M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z",
                      },
                    ].map((type) => (
                      <label
                        key={type.value}
                        className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-all ${
                          formData.supportType === type.value
                            ? "bg-[#31124b] text-white border-[#31124b]"
                            : "border-gray-300 hover:border-[#fa9e1b] hover:bg-[#fa9e1b]/5"
                        }`}
                      >
                        <input
                          type="radio"
                          name="supportType"
                          value={type.value}
                          checked={formData.supportType === type.value}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 mb-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={type.icon}
                          />
                        </svg>
                        <span className="text-sm font-medium">
                          {type.value}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="group">
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-[#31124b] transition-colors"
                  >
                    تفاصيل الدعم
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#fa9e1b] focus:border-[#fa9e1b] transition-all"
                    placeholder="اشرح تفاصيل الدعم الذي ترغب بتقديمه"
                  ></textarea>
                </div>

                <div className="flex justify-center pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-10 py-4 bg-gradient-to-r from-[#31124b] to-[#fa9e1b] text-white rounded-lg hover:shadow-lg transition duration-300 transform hover:scale-105 flex items-center space-x-2 space-x-reverse ${
                      loading ? "opacity-75 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 ml-2 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span>جاري الإرسال...</span>
                      </>
                    ) : (
                      <>
                        <span >إرسال طلب الدعم</span>
                       
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-bold text-center text-[#31124b] mb-8">
              أنواع الدعم المتاحة
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "الدعم المالي",
                  icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                  desc: "ساهم مالياً في تمويل مشاريعنا وأنشطتنا المختلفة لتحقيق أهداف مجتمعية مشتركة",
                },
                {
                  title: "الدعم التطوعي",
                  icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
                  desc: "شارك معنا بوقتك وخبراتك لتحقيق رسالتنا وتنمية المجتمع بشكل إيجابي",
                },
                {
                  title: "الدعم العيني",
                  icon: "M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11",
                  desc: "قدم مواد أو خدمات تساهم في دعم أنشطتنا ومشاريعنا وتطوير برامجنا",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-[#fa9e1b] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex justify-center">
                    <div className="rounded-full bg-gradient-to-r from-[#31124b] to-[#411866] p-4 transform transition-transform duration-300 hover:rotate-12">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-[#fa9e1b]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={item.icon}
                        />
                      </svg>
                    </div>
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-center text-gray-800">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-gray-600 text-center">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <section className="py-16 px-4 my-20 mx-8 bg-gradient-to-r from-[#31124b] to-[#411866] rounded-2xl shadow-xl relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-bold text-white mb-4">
            شركاؤنا الداعمون
          </h2>
          <p className="mt-2 text-[#fa9e1b] text-lg mb-10">
            نشكر جميع الجهات التي ساهمت في دعم مشاريعنا
          </p>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-8">
            {supporters.length > 0 ? (
              supporters.map((supporter, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/10 flex flex-col items-center justify-center h-40 transform transition-all duration-300 hover:scale-105 hover:bg-white/20"
                >
                  {supporter.images?.[0]?.url ? (
                    <img
                      src={supporter.images[0].url}
                      alt={supporter.name}
                      className="w-20 h-20 rounded-full object-cover mb-3 border-2 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#fa9e1b]/80 to-[#fa9e1b] flex items-center justify-center text-white mb-3 shadow-lg">
                      <span className="text-xl font-bold">
                        {supporter.name?.charAt(0) || "?"}
                      </span>
                    </div>
                  )}
                  <span className="text-white font-medium text-sm">
                    {supporter.name}
                  </span>
                </div>
              ))
            ) : (
              <div className="col-span-4 bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/10">
                <p className="text-white text-lg">
                  لا يوجد داعمين حالياً - كن أول الداعمين!
                </p>
                <button
                  onClick={() =>
                    document
                      .querySelector("form")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="mt-4 px-6 py-2 bg-[#fa9e1b] text-white rounded-lg hover:bg-[#e8900a] transition duration-300"
                >
                  قدم الدعم الآن
                </button>
              </div>
            )}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/supporters"
              className="bg-[#fa9e1b] text-[#31124b] hover:bg-[#fa9d1bad] px-8 py-4 rounded-lg transition-colors font-bold text-xl inline-block"
            >
              اطلع على كل شركاؤنا الداعمون 
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
