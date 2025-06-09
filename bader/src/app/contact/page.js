"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import axios from "axios";

import { FaEnvelope } from "react-icons/fa";

// Import the map component dynamically with no SSR to avoid window is not defined errors
const Map = dynamic(() => import("../components/LocationPickerMap"), { ssr: false });

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [floating, setFloating] = useState({});
  const [loading, setLoading] = useState(false);

  // Animation for floating elements
  useEffect(() => {
    const interval = setInterval(() => {
      setFloating({
        x: Math.sin(Date.now() / 1000) * 10,
        y: Math.cos(Date.now() / 1500) * 10,
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("يرجى تعبئة جميع الحقول المطلوبة.");
      setLoading(false);
      return;
    }
    try {
      // Here you would typically send the data to your backend
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setIsSubmitted(true);
        // Reset form after 3 seconds
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({ name: "", email: "", phone: "", message: "" });
        }, 3000);
      } else {
        toast.error(data.error || "An error occurred");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Failed to submit form");
    }
  };

  return (
    <div className="min-h-screen ">
      <Head>
        <title>اتصل بنا | مشروع بادر</title>
        <meta
          name="description"
          content="تواصل مع مشروع بادر لإصلاح مشاكل الحي"
        />
      </Head>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <motion.div
          className="absolute w-32 h-32 rounded-full bg-[#fa9e1b] opacity-10 top-20 left-20"
          animate={{ x: floating.x, y: floating.y }}
          transition={{ duration: 2 }}
        />
        <motion.div
          className="absolute w-48 h-48 rounded-full bg-[#fa9e1b] opacity-5 bottom-40 right-10"
          animate={{ x: -floating.x, y: -floating.y }}
          transition={{ duration: 3 }}
        />
        <motion.div
          className="absolute w-24 h-24 rounded-full bg-[#31124b] opacity-20 top-40 right-40"
          animate={{ x: -floating.y, y: floating.x }}
          transition={{ duration: 4 }}
        />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center ">
            <div className=" inline-block p-3 rounded-full bg-[#fa9e1b] bg-opacity-10 mb-4">
              <FaEnvelope size={32} className="text-amber-50" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-[#31124b] mb-4 relative inline-block">
            اتصل بنا{" "}
          </h1>

          <p className="mt-7 text-xl text-[#31124b]font-medium">
            نرحب بتواصلكم معنا في مشروع بادر لإصلاح مشاكل الحي.{" "}
          </p>
          <div className="flex justify-center">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 100 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-16 items-center">
          {/* Contact Form */}
          <motion.div
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-8 border border-b-neutral-800 border-opacity-100 shadow-xl">
              {isSubmitted ? (
                <motion.div
                  className="text-center py-12"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#fa9e1b] mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 [#31124b]"
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
                  <h3 className="text-2xl font-bold [#31124b] mb-2 font-arabic">
                    تم إرسال رسالتك بنجاح!
                  </h3>
                  <p className="text-[#31124b] font-arabic">
                    سنتواصل معك قريباً
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 text-right">
                  <div>
                    <label className="block text-[#fa9e1b] mb-2 font-arabic">
                      الاسم
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-b-neutral-800 border-opacity-100 [#31124b] focus:outline-none focus:ring-2 focus:ring-[#fa9e1b] transition-all duration-300 text-right"
                      placeholder="أدخل اسمك الكامل"
                    />
                  </div>

                  <div>
                    <label className="block text-[#fa9e1b] mb-2 font-arabic">
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-b-neutral-800 border-opacity-100 [#31124b] focus:outline-none focus:ring-2 focus:ring-[#fa9e1b] transition-all duration-300 text-right"
                      placeholder="example@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-[#fa9e1b] mb-2 font-arabic">
                      رقم الهاتف
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-b-neutral-800 border-opacity-100 [#31124b] focus:outline-none focus:ring-2 focus:ring-[#fa9e1b] transition-all duration-300 text-right"
                      placeholder="+966 XX XXX XXXX"
                    />
                  </div>

                  <div>
                    <label className="block text-[#fa9e1b] mb-2 font-arabic">
                      الرسالة
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-b-neutral-800 border-opacity-100 [#31124b] focus:outline-none focus:ring-2 focus:ring-[#fa9e1b] transition-all duration-300 text-right"
                      placeholder="اكتب رسالتك هنا..."
                    />
                  </div>
                  <motion.button
                    type="submit"
                    className="w-full py-3 px-6 bg-[#fa9e1b] hover:bg-[#fbb042] text-[#31124b] font-bold rounded-lg shadow-lg transition-all duration-300 text-lg font-arabic"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    إرسال الرسالة
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            className="w-full lg:w-1/2 text-right"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-[#31124b] mb-6 font-arabic">
                  معلومات التواصل
                </h2>
                <p className="text-[#31124b] mb-8 text-lg font-arabic">
                  يمكنك التواصل معنا مباشرة من خلال النموذج أو باستخدام أي من
                  وسائل الاتصال التالية:
                </p>
              </div>

              <motion.div
                className="flex items-center gap-4 text-[#31124b] transition-colors duration-300"
                whileHover={{ x: 5 }}
              >
                <div className="w-12 h-12 rounded-full bg-[#fa9e1b] bg-opacity-20 flex items-center justify-center shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 "
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-1 font-arabic">الهاتف</h3>
                  <p className="text-lg">+962 7 9075 8867</p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-center gap-4 text-[#31124b]  transition-colors duration-300"
                whileHover={{ x: 5 }}
              >
                <div className="w-12 h-12 rounded-full bg-[#fa9e1b] bg-opacity-20 flex items-center justify-center shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 "
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-1 font-arabic">
                    البريد الإلكتروني
                  </h3>
                  <p className="text-lg">BaderJordan@gmail.com</p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-center gap-4 text-[#31124b] transition-colors duration-300"
                whileHover={{ x: 5 }}
              >
                <div className="w-12 h-12 rounded-full bg-[#fa9e1b] bg-opacity-20 flex items-center justify-center shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 "
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-xl text-[rgb(49,18,75)] mb-1 font-arabic">
                    العنوان
                  </h3>
                  <p className="text-lg font-arabic">
                    {" "}
                    الزرقاء - المملكة الاردنية الهاشمية
                  </p>
                </div>
              </motion.div>

              <div className="pt-6">
                <h3 className="font-bold text-xl mb-4 text-[#31124b] font-arabic">
                  تابعنا على
                </h3>
                <div className="flex gap-4 justify-start">
                  <motion.a
                    href="#"
                    className="w-10 h-10 rounded-full bg-[#fa9e1b] bg-opacity-10 flex items-center justify-center hover:bg-[#fa9e1b] transition-colors duration-300"
                    whileHover={{ y: -5 }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 [#31124b]"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                    </svg>
                  </motion.a>
                  <motion.a
                    href="#"
                    className="w-10 h-10 rounded-full bg-[#fa9e1b] bg-opacity-10 flex items-center justify-center hover:bg-[#fa9e1b] transition-colors duration-300"
                    whileHover={{ y: -5 }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 [#31124b]"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </motion.a>
                  <motion.a
                    href="#"
                    className="w-10 h-10 rounded-full bg-[#fa9e1b] bg-opacity-10 flex items-center justify-center hover:bg-[#fa9e1b] transition-colors duration-300"
                    whileHover={{ y: -5 }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 [#31124b]"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </motion.a>
                  <motion.a
                    href="#"
                    className="w-10 h-10 rounded-full bg-[#fa9e1b] bg-opacity-10 flex items-center justify-center hover:bg-[#fa9e1b] transition-colors duration-300"
                    whileHover={{ y: -5 }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 [#31124b]"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                    </svg>
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Report an Issue CTA */}
        <motion.div
          className="mt-20 bg-gradient-to-r from-[#31124b] to-[#411866] rounded-2xl p-8 shadow-xl border border-white border-opacity-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-right">
              <h3 className="text-2xl font-bold  text-amber-50 mb-5  font-arabic">
                هل لديك مشكلة في حيك؟
              </h3>
              <p className="text-amber-50 mt-5 font-arabic">
                بادر بالإبلاغ عن المشكلة وسنعمل على حلها في أقرب وقت ممكن
              </p>
            </div>
            <motion.a
              href="/report-issue"
              className="px-8 py-3 bg-[#fa9e1b] hover:bg-[#fbb042] text-[#31124b] font-bold rounded-lg shadow-lg transition-all duration-300 text-lg flex items-center gap-2 font-arabic"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
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
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              الإبلاغ عن مشكلة
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* Add custom font for Arabic */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap");

        .font-arabic {
          font-family: "Cairo", sans-serif;
        }

        body {
          direction: rtl;
        }
      `}</style>
    </div>
  );
}
