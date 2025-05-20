"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import CompletedVolunteerActivity from "@/app/components/CompletedVolunteerActivity";
import {
  FaEdit,
  FaMapMarkerAlt,
  FaPhone,
  FaUser,
  FaClipboardCheck,
  FaExclamationTriangle,
  FaMedal,
  FaBell,
  FaCheckCircle,
  FaClock,
  FaCamera,
  FaChartLine,
  FaTrophy,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import CompletedProjects from "@/app/components/CompletedProjects";
import ReportedIssuesTab from "@/app/components/ReportedIssuesTab";

export default function UserProfile() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("stats");
  const [showAllNotifications, setShowAllNotifications] = useState(false);

  const [userData, setUserData] = useState({
    name: "",
    phone: "",
    address: "",
    image: "",
    email: "",
  });

  const [completedProjects, setCompletedProjects] = useState([]);
  const [reportedIssues, setReportedIssues] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const resUser = await fetch("/api/current-user");
      if (resUser.status === 401) {
        toast.error("يرجى تسجيل الدخول أولاً");
        return router.push("/login");
      }
      const user = await resUser.json();
      console.log(user);
      setUserData({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
        image: user.image || "",
        email: user.email || "",
      });

      const [completed, issues, notifs] = await Promise.all([
        fetch("/api/user/completed-projects").then((res) => res.json()),
        fetch("/api/user/reported-issues").then((res) => res.json()),
        fetch("/api/user/notifications").then((res) => res.json()),
      ]);

      setCompletedProjects(completed.projects || []);
      setReportedIssues(issues.issues || []);
      setNotifications(notifs.notifications || []);
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء تحميل البيانات");
    }
  };

  const startEdit = (field) => {
    setEditing(field);
    setEditValue(userData[field]);
  };

  const cancelEdit = () => {
    setEditing(null);
  };

  const saveEdit = async () => {
    if (!editing) return;
    try {
      const res = await fetch("/api/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [editing]: editValue }),
      });

      const data = await res.json();

      if (res.ok) {
        setUserData(data.updatedUser);
        toast.success("تم تحديث البيانات بنجاح ✅");
      } else {
        toast.error(data.message || "فشل التحديث ❌");
      }

      setEditing(null);
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء الحفظ ❌");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
    );
    formData.append("folder", "user-profiles");

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      const imageUrl = data.secure_url;

      await fetch("/api/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageUrl }),
      });

      setUserData({ ...userData, image: imageUrl });
      toast.success("تم رفع الصورة بنجاح ✅");
    } catch (error) {
      console.error(error);
      toast.error("فشل رفع الصورة ❌");
    }
  };

  const totalVolunteerHours = useMemo(() => {
    return completedProjects?.reduce((sum, project) => {
      return sum + (project.volunteerHours || 0);
    }, 0);
  }, [completedProjects]);

  const totalReportedIssues = reportedIssues.length;
  const resolvedIssues = reportedIssues.filter(
    (issue) => issue.status === "completed"
  ).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case "issue":
        return <FaExclamationTriangle className="text-red-500" />;
      case "project":
        return <FaClipboardCheck className="text-blue-500" />;
      case "badge":
        return <FaMedal className="text-yellow-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };

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

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 },
    },
  };

  const toggleNotifications = () => {
    setShowAllNotifications(!showAllNotifications);
  };

  const displayedNotifications = showAllNotifications
    ? notifications
    : notifications.slice(0, 4);

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#31124b] to-[#42195e] text-white py-8 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="relative">
                {userData.image ? (
                  <div
                    key={userData.name}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-[#fa9e1b] overflow-hidden"
                  >
                    <img
                      src={userData.image}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-300 rounded-full border-4 border-[#fa9e1b] flex items-center justify-center">
                    <FaUser className="text-3xl text-gray-500" />
                  </div>
                )}
                <label
                  htmlFor="profile-upload"
                  className="absolute bottom-0 right-0 bg-[#fa9e1b] p-2 rounded-full cursor-pointer hover:bg-yellow-600 transition-colors"
                >
                  <FaCamera className="text-white text-sm" />
                </label>
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
              <div className="mr-4">
                <h1 className="text-2xl font-bold">
                  {userData.name || "مرحباً بك"}
                </h1>
                <h5>{userData.email || ""}</h5>
                <div className="flex items-center mt-1 text-sm text-gray-200">
                  <FaMapMarkerAlt className="mr-1" />
                  <span>{userData.address || "لم يتم تحديد العنوان"}</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2 space-x-reverse"></div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        {/* User info cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Card 1 */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-xl shadow-md overflow-hidden border-t-4 border-[#31124b]"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-[#31124b]">
                  المعلومات الشخصية
                </h3>
                <FaUser className="text-[#fa9e1b] text-xl" />
              </div>
              <div className="space-y-4">
                {/* الاسم */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-gray-600">
                    <FaUser className="text-[#fa9e1b] ml-2 text-sm" />
                    <span>الاسم:</span>
                  </div>
                  {editing === "name" ? (
                    <div className="flex gap-2">
                      <input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="border rounded p-1 text-sm"
                      />
                      <button
                        onClick={saveEdit}
                        className="text-green-500 text-sm hover:text-green-700"
                      >
                        حفظ
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="text-red-500 text-sm hover:text-red-700"
                      >
                        إلغاء
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2 items-center">
                      <span>{userData.name}</span>
                      <button onClick={() => startEdit("name")}>
                        <FaEdit className="text-[#fa9e1b] hover:text-yellow-600 transition-colors" />
                      </button>
                    </div>
                  )}
                </div>

                {/* الهاتف */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-gray-600">
                    <FaPhone className="text-[#fa9e1b] ml-2 text-sm" />
                    <span>رقم الهاتف:</span>
                  </div>
                  {editing === "phone" ? (
                    <div className="flex gap-2">
                      <input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="border rounded p-1 text-sm"
                      />
                      <button
                        onClick={saveEdit}
                        className="text-green-500 text-sm hover:text-green-700"
                      >
                        حفظ
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="text-red-500 text-sm hover:text-red-700"
                      >
                        إلغاء
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2 items-center">
                      <span>{userData.phone || "لم يتم تحديد رقم"}</span>
                      <button onClick={() => startEdit("phone")}>
                        <FaEdit className="text-[#fa9e1b] hover:text-yellow-600 transition-colors" />
                      </button>
                    </div>
                  )}
                </div>

                {/* العنوان */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-gray-600">
                    <FaMapMarkerAlt className="text-[#fa9e1b] ml-2 text-sm" />
                    <span>العنوان:</span>
                  </div>
                  {editing === "address" ? (
                    <div className="flex gap-2">
                      <input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="border rounded p-1 text-sm"
                      />
                      <button
                        onClick={saveEdit}
                        className="text-green-500 text-sm hover:text-green-700"
                      >
                        حفظ
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="text-red-500 text-sm hover:text-red-700"
                      >
                        إلغاء
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2 items-center">
                      <span>{userData.address || "لم يتم تحديد العنوان"}</span>
                      <button onClick={() => startEdit("address")}>
                        <FaEdit className="text-[#fa9e1b] hover:text-yellow-600 transition-colors" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-md overflow-hidden border-t-4 border-[#fa9e1b]"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-[#31124b]">
                  إحصائيات التطوع
                </h3>
                <FaChartLine className="text-[#fa9e1b] text-xl" />
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-gradient-to-br from-[#31124b] to-[#42195e] rounded-lg p-4 text-white">
                  <div className="flex items-center justify-between">
                    <FaClock className="text-2xl opacity-80" />
                    <div className="text-right">
                      <p className="text-xs opacity-75">ساعات التطوع</p>
                      <p className="text-xl font-bold">{totalVolunteerHours}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-[#fa9e1b] to-[#f8b957] rounded-lg p-4 text-white">
                  <div className="flex items-center justify-between">
                    <FaExclamationTriangle className="text-2xl opacity-80" />
                    <div className="text-right">
                      <p className="text-xs opacity-75">المشاكل المبلغة</p>
                      <p className="text-xl font-bold">{totalReportedIssues}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-[#31124b] to-[#42195e] rounded-lg p-4 text-white">
                  <div className="flex items-center justify-between">
                    <FaCheckCircle className="text-2xl opacity-80" />
                    <div className="text-right">
                      <p className="text-xs opacity-75">المشاكل المحلولة</p>
                      <p className="text-xl font-bold">{resolvedIssues}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-md overflow-hidden border-t-4 border-[#31124b]"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-[#31124b]">الإشعارات</h3>
                <div className="flex items-center">
                  <FaBell className="text-[#fa9e1b] text-xl" />
                  {notifications.length > 0 && (
                    <span className="bg-[#fa9e1b] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center mr-1">
                      {notifications.length}
                    </span>
                  )}
                </div>
              </div>
              <div className="space-y-3">
                {displayedNotifications.length > 0 ? (
                  <>
                    <AnimatePresence>
                      {displayedNotifications.map((notification) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className={`p-3 rounded-lg border-r-4 ${
                            notification.isRead
                              ? "border-gray-300 bg-gray-50"
                              : "border-[#fa9e1b] bg-amber-50"
                          }`}
                        >
                          <div className="flex items-start">
                            <div className="mt-1 ml-3">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {notification.title}
                              </p>
                              <p className="text-xs text-gray-500">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {notifications.length > 4 && (
                      <button
                        onClick={toggleNotifications}
                        className="text-[#31124b] text-sm hover:text-[#fa9e1b] transition-colors w-full text-center mt-2 flex items-center justify-center"
                      >
                        {showAllNotifications ? (
                          <>
                            <FaChevronUp className="ml-1" />
                            إخفاء بعض الإشعارات
                          </>
                        ) : (
                          <>
                            <FaChevronDown className="ml-1" />
                            عرض جميع الإشعارات ({notifications.length})
                          </>
                        )}
                      </button>
                    )}
                  </>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    لا توجد إشعارات جديدة
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-8">
          <div className="flex border-b overflow-x-auto">
            <button
              onClick={() => setActiveTab("stats")}
              className={`px-6 py-4 flex items-center font-medium text-sm transition-colors ${
                activeTab === "stats"
                  ? "border-b-2 border-[#fa9e1b] text-[#31124b]"
                  : "text-gray-500 hover:text-[#31124b]"
              }`}
            >
              <FaChartLine className="ml-2" /> الإحصائيات والإنجازات
            </button>
            <button
              onClick={() => setActiveTab("projects")}
              className={`px-6 py-4 flex items-center font-medium text-sm transition-colors ${
                activeTab === "projects"
                  ? "border-b-2 border-[#fa9e1b] text-[#31124b]"
                  : "text-gray-500 hover:text-[#31124b]"
              }`}
            >
              <FaClipboardCheck className="ml-2" /> المشاريع التطوعية
            </button>
            <button
              onClick={() => setActiveTab("issues")}
              className={`px-6 py-4 flex items-center font-medium text-sm transition-colors ${
                activeTab === "issues"
                  ? "border-b-2 border-[#fa9e1b] text-[#31124b]"
                  : "text-gray-500 hover:text-[#31124b]"
              }`}
            >
              <FaExclamationTriangle className="ml-2" /> المشاكل المبلغ عنها
            </button>
          </div>

          <div className="p-6">
            {/* Stats & Achievements Tab */}
            {activeTab === "stats" && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="px-2 py-4"
              >
                <div className="bg-gradient-to-br from-purple-50 to-orange-50 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center mb-8">
                    <div className="bg-[#31124b] p-3 rounded-full shadow-md">
                      <FaChartLine className="text-[#fa9e1b] text-xl" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#31124b] mr-3">
                      التقدم والإنجازات
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Progress Chart */}
                    <motion.div
                      variants={itemVariants}
                      className="bg-white rounded-2xl border border-purple-100 shadow-md p-6 h-auto"
                    >
                      <h3 className="text-lg font-medium text-[#31124b] mb-4 flex items-center">
                        <FaClipboardCheck className="text-[#fa9e1b] mr-2" />
                        مشاريع مكتملة
                      </h3>
                      <div className="h-56">
                        <CompletedVolunteerActivity
                          completedProjects={completedProjects}
                        />
                      </div>
                    </motion.div>

                    {/* Achievements Overview */}
                    <motion.div
                      variants={itemVariants}
                      className="bg-white rounded-2xl border border-purple-100 shadow-md p-6"
                    >
                      <h3 className="text-lg font-medium text-[#31124b] mb-4 flex items-center">
                        <FaTrophy className="text-[#fa9e1b] mr-2" />
                        مستوى التطوع
                      </h3>
                      <div className="flex flex-col items-center">
                        <div className="relative w-40 h-40 mb-6">
                          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#31124b] to-[#42195e] opacity-20"></div>
                          <div className="absolute inset-2 rounded-full bg-white"></div>
                          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-[#31124b] to-[#42195e] flex items-center justify-center text-white">
                            <div className="text-center">
                              <div className="text-4xl font-bold">
                                {totalVolunteerHours}
                              </div>
                              <div className="text-sm opacity-90">
                                ساعة تطوع
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="w-full bg-gray-100 rounded-full h-4 mb-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-[#fa9e1b] to-[#f8b957] h-4 rounded-full shadow-inner transition-all duration-500 ease-out"
                            style={{
                              width: `${Math.min(
                                (totalVolunteerHours / 100) * 100,
                                100
                              )}%`,
                            }}
                          ></div>
                        </div>

                        <div className="flex justify-between w-full text-sm text-gray-600 mb-6">
                          <span>0 ساعة</span>
                          <span>100 ساعة</span>
                        </div>

                        <div className="text-center bg-purple-50 rounded-xl p-4 w-full border border-purple-100">
                          <h4 className="font-bold text-[#31124b] text-lg mb-1">
                            متطوع{" "}
                            {totalVolunteerHours >= 50 ? "متقدم" : "مبتدئ"}
                            {totalVolunteerHours >= 50 && " ⭐"}
                          </h4>
                          <p className="text-sm text-gray-700">
                            {totalVolunteerHours >= 50
                              ? "رائع! أنت متطوع متقدم الآن. واصل العطاء!"
                              : `تحتاج إلى ${
                                  50 - totalVolunteerHours
                                } ساعة إضافية للوصول للمستوى المتقدم`}
                          </p>
                          {totalVolunteerHours < 50 && (
                            <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5">
                              <div
                                className="bg-purple-400 h-1.5 rounded-full"
                                style={{
                                  width: `${Math.min(
                                    (totalVolunteerHours / 50) * 100,
                                    100
                                  )}%`,
                                }}
                              ></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Completed Projects Tab */}
            {activeTab === "projects" && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <CompletedProjects
                  completedProjects={completedProjects}
                  activeTab={activeTab}
                />
              </motion.div>
            )}

            {/* Reported Issues Tab */}
            {activeTab === "issues" && (
              <ReportedIssuesTab reportedIssues={reportedIssues} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
