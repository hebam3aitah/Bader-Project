"use client";

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import ProjectCard from "../components/projectcard";
import { motion } from "framer-motion";
import {
  FiSearch,
  FiChevronDown,
  FiLoader,
  FiAlertCircle,
} from "react-icons/fi";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const projectsRef = useRef(null);
  const limit = 8;

  // Status mapping for Arabic
  const statusMap = {
    "in-progress": "قيد التنفيذ",
    completed: "مكتمل",
  };

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/projects", {
          params: { page, limit, category, status },
        });

        // Map status values to Arabic
        const projectsWithArabicStatus = res.data.projects.map((project) => ({
          ...project,
          statusArabic: statusMap[project.status] || project.status,
        }));

        setProjects(projectsWithArabicStatus);
        setFilteredProjects(projectsWithArabicStatus);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error("❌ فشل جلب المشاريع:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [page, category, status]);

  // Search projects
  useEffect(() => {
    if (searchTerm) {
      const filtered = projects.filter(
        (project) =>
          project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProjects(filtered);
    } else {
      setFilteredProjects(projects);
    }
  }, [searchTerm, projects]);

  // Scroll to projects when filters change
  useEffect(() => {
    if (projectsRef.current && !loading && page > 1) {
      projectsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [filteredProjects, loading, page]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center py-16 min-h-[300px]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="mb-4"
      >
        <FiLoader className="text-4xl text-[#fa9e1b]" />
      </motion.div>
      <p className="font-semibold text-[#31124b]">جارٍ تحميل المشاريع...</p>
    </div>
  );

  const renderError = () => (
    <div className="flex flex-col items-center justify-center py-16 bg-red-50 rounded-xl min-h-[300px]">
      <FiAlertCircle className="text-4xl text-red-500 mb-4" />
      <h3 className="text-xl font-bold text-red-600 mb-2">عذراً، حدث خطأ!</h3>
      <p className="text-red-500 text-center max-w-md">
        لم نتمكن من تحميل المشاريع حالياً. يرجى المحاولة مرة أخرى لاحقاً أو
        التواصل مع الدعم الفني.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="mt-6 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition-colors duration-300"
      >
        إعادة المحاولة
      </button>
    </div>
  );

  const renderNoResults = () => (
    <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-xl min-h-[300px]">
      <img
        src="/no-results.svg"
        alt="لا توجد نتائج"
        className="w-32 h-32 mb-4 opacity-60"
      />
      <h3 className="text-xl font-bold text-gray-600 mb-2">
        لا توجد مشاريع مطابقة
      </h3>
      <p className="text-gray-500 text-center max-w-md">
        لم نجد أي مشاريع تطابق معايير البحث الحالية. يرجى تعديل المعايير أو
        تجربة كلمات بحث مختلفة.
      </p>
      <button
        onClick={() => {
          setSearchTerm("");
          setCategory("all");
          setStatus("all");
          setPage(1);
        }}
        className="mt-6 bg-[#31124b] hover:bg-[#2a0f40] text-white px-6 py-2 rounded-md transition-colors duration-300"
      >
        إعادة ضبط التصفية
      </button>
    </div>
  );

  return (
    <div
      className="bg-gradient-to-b from-gray-50 to-white min-h-screen"
      dir="rtl"
    >
      {/* Hero Section */}
      <motion.div
        className="relative text-white py-16 px-4 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10"></div>

        <div className="container mx-auto relative z-10">
          <motion.div
            variants={headerVariants}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-[#31124b] text-center mb-4">
              مشاريع <span className="text-[#fa9e1b]">بادر</span> الخيرية
            </h1>
            <p className="mt-6 text-xl text-[#31124b] text-center  max-w-3xl mx-auto opacity-90 mb-8">
              تصفح مشاريعنا وكن جزءاً من صناعة الأثر من خلال المساهمة أو التطوع
            </p>
          </motion.div>

          {/* Search & Filter - Enhanced Design */}
          <div className="max-w-4xl mx-auto relative">
            <div
              className={
                "bg-white rounded-xl shadow-sm transition-all duration-300 p-4 border border-gray-100 hover:shadow-md"
              }
            >
              <div className="flex flex-col md:flex-row gap-3">
                {/* Search Input */}
                <div className="relative flex-grow">
                  <div
                    className={`flex items-center transition-all duration-200 rounded-lg overflow-hidden ${
                      isSearchFocused ? "ring-2 ring-amber-400 shadow-sm" : ""
                    } bg-gray-50 border border-gray-200`}
                  >
                    <input
                      type="text"
                      placeholder="ابحث عن مشروع..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setIsSearchFocused(false)}
                      className="w-full py-3 px-4 pr-12 bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
                    />
                    <FiSearch className="absolute right-3 text-gray-500 text-xl" />
                  </div>
                </div>
                <div className="relative">
                  <select
                    className="w-full px-10 py-2.5 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition-all duration-300 appearance-none text-gray-700"
                    onChange={(e) => {
                      setStatus(e.target.value);
                      setPage(1);
                    }}
                    value={status}
                  >
                    <option value="all">كل الحالات</option>
                    <option value="in-progress">قيد التنفيذ</option>
                    <option value="completed">مكتمل</option>
                  </select>
                  <FiChevronDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Projects Section */}
      <div ref={projectsRef} className="container mx-auto px-4 py-12">
        {loading ? (
          renderLoading()
        ) : error ? (
          renderError()
        ) : filteredProjects.length === 0 ? (
          renderNoResults()
        ) : (
          <>
            <motion.div
              ref={projectsRef}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-6 mt-8"
            >
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project._id}
                  id={project._id}
                  image={project.images[0]}
                  month={new Date(project.lastStatusUpdate).toLocaleDateString(
                    "ar-EG",
                    {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }
                  )}
                  title={project.title}
                  description={project.description}
                  status={
                    project.statusArabic ||
                    statusMap[project.status] ||
                    "قيد التنفيذ"
                  }
                  donations={project.donations || 0}
                  donationTarget={project.donationTarget || 100}
                  showDonate={project.status !== "completed"}
                  showVolunteer={project.status !== "completed"}
                  project={project}
                />
              ))}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex justify-center mt-12"
              >
                <div className="bg-white shadow-lg rounded-full px-2 py-1 inline-flex items-center">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className={`px-4 py-2 rounded-full ${
                      page === 1
                        ? "text-black cursor-not-allowed"
                        : "text-[#31124b] hover:bg-purple-50"
                    } transition-colors duration-300`}
                  >
                    السابق
                  </button>

                  <div className="flex px-2">
                    {[...Array(totalPages)].map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setPage(idx + 1)}
                        className={`w-10 h-10 mx-1 rounded-full flex items-center justify-center transition-all duration-300 ${
                          page === idx + 1
                            ? "bg-[#fa9e1b] text-black font-bold transform scale-110"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className={`px-4 py-2 rounded-full ${
                      page === totalPages
                        ? "text-black cursor-not-allowed"
                        : "text-[#31124b] hover:bg-purple-50"
                    } transition-colors duration-300`}
                  >
                    التالي
                  </button>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
