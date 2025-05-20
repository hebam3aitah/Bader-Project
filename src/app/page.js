"use client";

import Link from "next/link";
import HeroSection from "./components/herosection";
import { useState, useEffect, useRef } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";
import ProjectsSection from "./components/ProjectsSection";
import PartnersPage from "./components/PartnersSection";
import EnhancedSupportSection from "./components/EnhancedSupportSection";
import {
  MapPin,
  Send,
  Users,
  Building,
  Check,
  User,
} from "lucide-react";

export default function Home() {
  const [stats, setStats] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const achievementsRef = useRef(null);

  // Counter component
  const Counter = ({ end, suffix = "", className }) => {
    const [count, setCount] = useState(0);
    const counterRef = useRef(null);

    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            let startTime;
            const duration = 1500;

            const animate = (timestamp) => {
              if (!startTime) startTime = timestamp;
              const progress = Math.min((timestamp - startTime) / duration, 1);
              const currentCount = Math.floor(progress * end);
              setCount(currentCount);

              if (progress < 1) {
                requestAnimationFrame(animate);
              }
            };

            requestAnimationFrame(animate);
          }
        },
        { threshold: 0.1 }
      );

      if (counterRef.current) observer.observe(counterRef.current);

      return () => {
        if (counterRef.current) observer.unobserve(counterRef.current);
      };
    }, [end]);

    return (
      <div ref={counterRef} className={className}>
        {count}
        {suffix}
      </div>
    );
  };

  const animations = {
    fadeInUp: {
      hidden: { opacity: 0, y: 40 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" },
      },
    },
    staggerChildren: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.15,
        },
      },
    },
    floatingAnimation: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse",
      },
    },
  };

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch stats data
        const statsRes = await axios.get("/api/about/stats");
        setStats(statsRes.data);
        setLoadingStats(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoadingStats(false);
      }
    };

    fetchData();
  }, []);

  const features = [
    {
      icon: <MapPin size={24} className="text-white" />,
      bgColor: "#fa9e1b",
      title: "تقديم البلاغات بسهولة",
      description:
        "إمكانية الإبلاغ عن المشكلات بسهولة مع تحديد الموقع والوصف وإرفاق الصور",
    },
    {
      icon: <Send size={24} className="text-white" />,
      bgColor: "#31124b",
      title: "تحويل البلاغات إلى مشاريع",
      description:
        "مراجعة البلاغات من قبل المسؤولين وتحويلها إلى مشاريع قابلة للتنفيذ",
    },
    {
      icon: <Users size={24} className="text-white" />,
      bgColor: "#fa9e1b",
      title: "دعم المجتمع",
      description:
        "فتح المشاريع للمتطوعين والمتبرعين من أبناء المجتمع   ",
    },
    {
      icon: <Building size={24} className="text-white" />,
      bgColor: "#31124b",
      title: "رعاية الشركات",
      description:
        "إمكانية انضمام الشركات كداعم رسمي للمشاريع  ",
    },
    {
      icon: <Check size={24} className="text-white" />,
      bgColor: "#fa9e1b",
      title: "تتبع حالة المشاريع",
      description:
        "متابعة حالة كل مشروع (قيد التنفيذ -مكتمل )",
    },
    {
      icon: <User size={24} className="text-white" />,
      bgColor: "#31124b",
      title: "ملف المستخدم الشخصي",
      description:
        "إمكانية عرض جميع المساهمات والمشاريع التي شارك فيها المستخدم ومتابعة تطورها",
    },
  ];

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <HeroSection />

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2
            className="text-3xl font-bold mb-2 text-center"
            style={{ color: "#31124b" }}
          >
            ميزات المنصة
          </h2>
          <p className="text-center text-[#31124b] text-xl m-8">
            مجموعة من الخصائص المتكاملة لتمكين المجتمع من حل المشكلات العامة
          </p>

          <div className="rtl font-sans max-w-6xl mx-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-[#31124b] border border-[#31124b] hover:shadow-lg transition duration-300 flex flex-col"
                >
                  <div className="flex items-center mb-4">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center ml-4"
                      style={{ backgroundColor: feature.bgColor }}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-[#31124b]">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text mt-2  text-stone-950   text-right leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#31124b]">
            كيف نعمل على تحسين الحي؟
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-[#31124b] border border-[#31124b] hover:shadow-lg transition duration-300 flex flex-col">
              <div className="text-[#662480] text-4xl mb-4 flex justify-center">
                <svg
                  className="w-16 h-16"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm9 4a1 1 0 10-2 0v6a1 1 0 102 0V7zm-3 2a1 1 0 10-2 0v4a1 1 0 102 0V9zm-3 3a1 1 0 10-2 0v1a1 1 0 102 0v-1z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#31124b] text-center">
                تحديد المشاكل
              </h3>
              <p className="text-gray-700 text-center">
                نستمع لسكان الحي ونقوم بتحليل ودراسة المشاكل الملحة التي تواجه
                مجتمعنا
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-[#31124b] border border-[#31124b] hover:shadow-lg transition duration-300 flex flex-col">
              <div className="text-[#fa9e1b] text-4xl mb-4 flex justify-center">
                <svg
                  className="w-16 h-16"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#31124b] text-center">
                تكوين فرق العمل
              </h3>
              <p className="text-gray-700 text-center">
                نجمع المتطوعين والداعمين من أصحاب الخبرات المتنوعة للعمل على حل
                مشاكل الحي
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-[#31124b] border border-[#31124b] hover:shadow-lg transition duration-300 flex flex-col">
              <div className="text-[#31124b] text-4xl mb-4 flex justify-center">
                <svg
                  className="w-16 h-16"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#31124b] text-center">
                تنفيذ المشاريع
              </h3>
              <p className="text-gray-700 text-center">
                ننفذ الحلول العملية ونقيم تأثيرها في المجتمع مع المتابعة
                المستمرة لضمان نجاحها
              </p>
            </div>
          </div>
        </div>
      </div>

      

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={animations.fadeInUp}
        className="mb-28 mx-10 observe-section"
        ref={achievementsRef}
      >
              <div className=" px-4 bg-white">

        <div className="text-center mt-8">
          <h1 className="text-4xl mb-5 font-bold text-[#31124b] inline-block relative">
            إنجازاتنا في بادر
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 m-20">
          {loadingStats ? (
            <div className="col-span-3 text-center py-12">
              <div className="inline-block p-3 rounded-full bg-[#fa9e1b] bg-opacity-10 animate-pulse">
                <i className="fas fa-spinner fa-spin text-3xl text-[#fa9e1b]"></i>
              </div>
              <p className="mt-4 text-xl text-gray-600">
                جارٍ تحميل الإنجازات...
              </p>
            </div>
          ) : (
            stats.map(({ icon, title, count, description }, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="bg-white p-10 rounded-2xl shadow-lg relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#fa9e1b] opacity-10 rounded-full transform translate-x-12 -translate-y-12"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#31124b] opacity-10 rounded-full transform -translate-x-16 translate-y-16"></div>

                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-[#31124b] flex items-center justify-center mb-8 transform -rotate-6 shadow-lg">
                    <i className={`fas fa-${icon} text-[#fa9e1b] text-3xl`}></i>
                  </div>
                  <Counter
                    end={count}
                    suffix="+"
                    className="text-7xl font-bold text-[#31124b]"
                  />
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4 mt-3">
                    {title}
                  </h3>
                  <div className="h-1.5 w-20 bg-[#fa9e1b] mb-5"></div>
                  <p className="text-lg text-gray-600">{description}</p>
                </div>
              </motion.div>
            ))
          )}
        </div>
        </div>
      </motion.div>
      

      <ProjectsSection />

      <PartnersPage />

      <EnhancedSupportSection />
    </div>
  );
}
