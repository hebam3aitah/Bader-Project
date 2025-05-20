import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaClipboardCheck,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaTimes,
  FaImage,
  FaThumbsUp,
  FaComment,
  FaShare,
  FaUsers,
} from "react-icons/fa";

// التنوعات للحركة
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// دالة لتحديد لون الحالة
const getStatusColor = (status) => {
  switch (status) {
    case "completed":
      return "bg-green-500";
    case "in-progress":
      return "bg-blue-500";
    case "pending":
      return "bg-yellow-500";
    default:
      return "bg-gray-500";
  }
};

// ترجمة الحالة للعربية
const translateStatus = (status) => {
  switch (status) {
    case "completed":
      return "مكتمل";
    case "in-progress":
      return "قيد التنفيذ";
    case "pending":
      return "قيد الانتظار";
    default:
      return status;
  }
};

// ترجمة الأولوية للعربية
const translatePriority = (priority) => {
  switch (priority) {
    case "urgent":
      return "عاجل";
    case "medium":
      return "متوسط";
    case "low":
      return "منخفض";
    default:
      return priority;
  }
};

const CompletedProjects = ({ completedProjects, activeTab }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // فتح نافذة التفاصيل
  const openProjectDetails = (project) => {
    setSelectedProject(project);
    setShowDetails(true);
  };

  // إغلاق نافذة التفاصيل
  const closeProjectDetails = () => {
    setShowDetails(false);
  };

  return (
    <>
      {activeTab === "projects" && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center mb-6 border-b pb-4">
            <div className="bg-[#fef4e6] p-2 rounded-full">
              <FaClipboardCheck className="text-[#fa9e1b] text-xl" />
            </div>
            <h2 className="text-xl font-bold text-[#31124b] mr-3">
              المشاريع التي تطوعت فيها
            </h2>
          </div>

          {completedProjects && completedProjects.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-[#f9f5ff] border-b">
                    <th className="py-4 px-4 text-right text-sm font-medium text-[#31124b]">
                      المشروع
                    </th>
                    <th className="py-4 px-4 text-right text-sm font-medium text-[#31124b]">
                      التاريخ
                    </th>
                    <th className="py-4 px-4 text-right text-sm font-medium text-[#31124b]">
                      الحالة
                    </th>
                    <th className="py-4 px-4 text-right text-sm font-medium text-[#31124b]">
                      التفاصيل
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {completedProjects.map((project) => (
                    <motion.tr
                      key={project._id || project.id}
                      variants={itemVariants}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-4 font-medium text-[#31124b]">
                        {project.title}
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {project.lastStatusUpdate
                          ? new Date(
                              project.lastStatusUpdate
                            ).toLocaleDateString("ar-EG", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "غير محدد"}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs text-white ${getStatusColor(
                            project.status
                          )}`}
                        >
                          {translateStatus(project.status)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => openProjectDetails(project)}
                          className="bg-[#f9f5ff] text-[#31124b] px-3 py-1 rounded-lg hover:bg-[#f0e6ff] transition-colors flex items-center justify-center"
                        >
                          <span>عرض التفاصيل</span>
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <motion.div
              variants={itemVariants}
              className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300"
            >
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaClipboardCheck className="text-gray-400 text-2xl" />
              </div>
              <h3 className="text-[#31124b] font-medium text-lg mb-2">
                لم تشارك في أي مشاريع بعد
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                ابدأ رحلتك التطوعية الآن وساهم في تنمية مجتمعك!
              </p>
              <button className="bg-[#fa9e1b] text-white px-6 py-2 rounded-lg hover:bg-[#e89018] transition-colors shadow-md">
                استكشف فرص التطوع
              </button>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* نافذة التفاصيل المنبثقة */}
      <AnimatePresence>
        {showDetails && selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#000000b1] bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={closeProjectDetails}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl overflow-hidden max-w-3xl w-full max-h-screen shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* رأس النافذة المنبثقة */}
              <div className="bg-[#31124b] text-white p-4 flex justify-between items-center">
                <h3 className="text-xl font-bold">{selectedProject.title}</h3>
                <button
                  onClick={closeProjectDetails}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  <FaTimes />
                </button>
              </div>

              {/* صور المشروع (إذا وجدت) */}
              {selectedProject.images && selectedProject.images.length > 0 ? (
                <div className="relative h-64 bg-gray-100">
                  <img
                    src={selectedProject.images[0]}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-32 bg-gray-100 flex items-center justify-center">
                  <FaImage className="text-gray-400 text-4xl" />
                </div>
              )}

              {/* محتوى النافذة المنبثقة */}
              <div className="p-6 overflow-y-auto max-h-96">
                {/* معلومات أساسية */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="text-gray-500 text-sm mb-2">الوصف</h4>
                    <p className="text-[#31124b]">
                      {selectedProject.description}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* الموقع */}
                    {selectedProject.location && (
                      <div className="flex items-start">
                        <div className="bg-[#fef4e6] p-2 rounded-full">
                          <FaMapMarkerAlt className="text-[#fa9e1b]" />
                        </div>
                        <div className="mr-3">
                          <h4 className="text-gray-500 text-sm">الموقع</h4>
                          <p className="text-[#31124b]">
                            {selectedProject.location}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* تاريخ التقرير */}
                    {selectedProject.reportedAt && (
                      <div className="flex items-start">
                        <div className="bg-[#fef4e6] p-2 rounded-full">
                          <FaCalendarAlt className="text-[#fa9e1b]" />
                        </div>
                        <div className="mr-3">
                          <h4 className="text-gray-500 text-sm">
                            تاريخ التقرير
                          </h4>
                          <p className="text-[#31124b]">
                            {new Date(
                              selectedProject.reportedAt
                            ).toLocaleDateString("ar-EG", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* عدد المتطوعين */}
                    <div className="flex items-start">
                      <div className="bg-[#fef4e6] p-2 rounded-full">
                        <FaUsers className="text-[#fa9e1b]" />
                      </div>
                      <div className="mr-3">
                        <h4 className="text-gray-500 text-sm">عدد المتطوعين</h4>
                        <p className="text-[#31124b]">
                          {selectedProject.volunteerCount ||
                            selectedProject.volunteers?.length ||
                            0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* الحالة والأولوية */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-gray-500 text-sm mb-2">الحالة</h4>
                    <span
                      className={`px-3 py-1 rounded-full text-xs text-white ${getStatusColor(
                        selectedProject.status
                      )}`}
                    >
                      {translateStatus(selectedProject.status)}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-gray-500 text-sm mb-2">الأولوية</h4>
                    <span
                      className={`px-3 py-1 rounded-full text-xs text-white ${
                        selectedProject.priority === "urgent"
                          ? "bg-red-500"
                          : selectedProject.priority === "medium"
                          ? "bg-orange-500"
                          : "bg-blue-500"
                      }`}
                    >
                      {translatePriority(selectedProject.priority)}
                    </span>
                  </div>
                </div>

                {/* إحصائيات التفاعل */}
                <div className="border-t pt-4">
                  <h4 className="text-gray-500 text-sm mb-4">
                    إحصائيات التفاعل
                  </h4>
                  <div className="flex justify-around">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center text-gray-600 mb-1">
                        <FaThumbsUp />
                        <span className="mr-1">إعجابات</span>
                      </div>
                      <span className="text-[#31124b] font-bold">
                        {selectedProject.likesCount || 0}
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="flex items-center text-gray-600 mb-1">
                        <FaComment />
                        <span className="mr-1">تعليقات</span>
                      </div>
                      <span className="text-[#31124b] font-bold">
                        {selectedProject.comments?.length || 0}
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="flex items-center text-gray-600 mb-1">
                        <FaShare />
                        <span className="mr-1">مشاركات</span>
                      </div>
                      <span className="text-[#31124b] font-bold">
                        {selectedProject.shareCount || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* أزرار أسفل النافذة */}
              <div className="bg-gray-50 p-4 flex justify-end">
                <button
                  onClick={closeProjectDetails}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors ml-2"
                >
                  إغلاق
                </button>
                <button className="bg-[#fa9e1b] text-white px-4 py-2 rounded-lg hover:bg-[#e89018] transition-colors">
                  مشاركة المشروع
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CompletedProjects;
