"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { saveAs } from "file-saver";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable"; // مهم جدًا!
// import "@/fonts/ArabicFont-normal";

export default function AdminIssuesPage() {
  const [issues, setIssues] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showAllImages, setShowAllImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [severityFilter, setSeverityFilter] = useState("");

  // تقسيم الصفحات
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const router = useRouter();

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      const res = await axios.get("/api/Admin/issues");
      setIssues(res.data);
      setLoading(false);
    } catch (err) {
      toast.error("فشل في جلب البلاغات");
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.post("/api/Admin/approve-issue", { id });
      toast.success("تم قبول البلاغ وتحويله إلى مشروع");
      fetchIssues();
    } catch (err) {
      toast.error("فشل في القبول");
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.post("/api/Admin/reject-issue", { id });
      toast.success("تم رفض البلاغ");
      fetchIssues();
    } catch (err) {
      toast.error("فشل في الرفض");
    }
  };

  // تحويل التاريخ إلى تنسيق قابل للقراءة
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      return format(new Date(dateString), "dd MMM yyyy - HH:mm", {
        locale: ar,
      });
    } catch (e) {
      return "-";
    }
  };

  // تصدير البيانات إلى CSV
  const exportToCSV = () => {
    try {
      const dataToExport = filteredIssues.map((issue) => ({
        "نوع المشكلة": issue.problemType || "",
        الوصف: issue.description || "",
        الموقع: issue.location || "",
        "مستوى الخطورة": issue.severityLevel || "",
        "اسم المبلغ": issue.reporterName || "",
        "رقم الهاتف": issue.phone || "",
        الحالة: translateStatus(issue.status) || "",
        "تاريخ الإنشاء": formatDate(issue.createdAt) || "",
      }));

      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "البلاغات");

      // حفظ الملف
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const fileData = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });
      saveAs(fileData, `بلاغات-${format(new Date(), "yyyy-MM-dd")}.xlsx`);

      toast.success("تم تصدير البيانات بنجاح");
    } catch (error) {
      toast.error("فشل في تصدير البيانات");
      console.error("Error exporting data:", error);
    }
  };

  const exportToPDF = (filteredIssues) => {
    try {
      const doc = new jsPDF({ orientation: "landscape" });

      // استخدام الخط العربي المخصص
      doc.setFont("Cairo-Regular");
      doc.setFontSize(12);
      doc.setR2L(true);
      doc.text("مرحبا بالعالم", 20, 20);

      // عنوان التقرير
      doc.setFontSize(18);
      doc.text("تقرير البلاغات", doc.internal.pageSize.getWidth() / 2, 15, {
        align: "center",
      });

      // التاريخ
      doc.setFontSize(12);
      doc.text(
        `تاريخ التقرير: ${formatDate(new Date())}`,
        doc.internal.pageSize.getWidth() - 20,
        25,
        {
          align: "right",
        }
      );

      // إعداد البيانات
      const tableData = filteredIssues.map((issue) => [
        formatDate(issue.createdAt),
        translateStatus(issue.status),
        issue.phone,
        issue.reporterName,
        translateSeverity(issue.severityLevel),
        issue.location,
        issue.problemType,
      ]);

      const headers = [
        [
          "تاريخ الإنشاء",
          "الحالة",
          "رقم الهاتف",
          "اسم المبلغ",
          "درجة الخطورة",
          "الموقع",
          "نوع المشكلة",
        ],
      ];

      // إنشاء الجدول
      autoTable(doc, {
        head: headers,
        body: tableData,
        startY: 35,
        theme: "grid",
        styles: {
          font: "Cairo",
          fontSize: 10,
          halign: "right",
        },
        headStyles: {
          fillColor: [49, 18, 75],
          textColor: [255, 255, 255],
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        columnStyles: {
          0: { cellWidth: 35 },
        },
      });

      doc.save(`بلاغات-${new Date().toLocaleDateString("ar-EG")}.pdf`);
    } catch (error) {
      console.error("فشل في تصدير PDF:", error);
    }
  };

  // مساعد لترجمة درجة الخطورة (إن لم يكن موجود مسبقًا)
  const translateSeverity = (level) => {
    const map = {
      low: "منخفضة",
      medium: "متوسطة",
      high: "عالية",
    };
    return map[level] || level;
  };

  // ترجمة حالة البلاغ للغة العربية
  const translateStatus = (status) => {
    const statusMap = {
      pending: "معلقة",
      approved: "مقبولة",
      rejected: "مرفوضة",
    };
    return statusMap[status] || status;
  };

  // تطبيق فلترة التاريخ
  const isWithinDateRange = (date) => {
    if (!date) return true;
    if (!dateRange.start && !dateRange.end) return true;

    const itemDate = new Date(date);
    const startDate = dateRange.start ? new Date(dateRange.start) : null;
    const endDate = dateRange.end ? new Date(dateRange.end) : null;

    if (startDate && endDate) {
      // ضبط نهاية اليوم للتاريخ النهائي
      endDate.setHours(23, 59, 59, 999);
      return itemDate >= startDate && itemDate <= endDate;
    } else if (startDate) {
      return itemDate >= startDate;
    } else if (endDate) {
      // ضبط نهاية اليوم للتاريخ النهائي
      endDate.setHours(23, 59, 59, 999);
      return itemDate <= endDate;
    }

    return true;
  };

  // تصفية البلاغات حسب الحالة والبحث والتاريخ
  const filteredIssues = issues
    .filter(
      (issue) => filter === "all" || issue.status?.toLowerCase() === filter
    )
    .filter((issue) => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        issue.problemType?.toLowerCase().includes(searchLower) ||
        issue.description?.toLowerCase().includes(searchLower) ||
        issue.location?.toLowerCase().includes(searchLower) ||
        issue.reporterName?.toLowerCase().includes(searchLower)
      );
    })
    .filter(
      (issue) => severityFilter === "" || issue.severityLevel === severityFilter
    )

    .filter((issue) => isWithinDateRange(issue.createdAt));

  // تنفيذ تقسيم الصفحات
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredIssues.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredIssues.length / itemsPerPage);

  // تنقل بين صفحات النتائج
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // عدد البلاغات حسب الحالة للإحصائيات
  const issueStats = {
    all: issues.length,
    pending: issues.filter((issue) => issue.status === "pending").length,
    approved: issues.filter((issue) => issue.status === "approved").length,
    rejected: issues.filter((issue) => issue.status === "rejected").length,
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
      dir="rtl"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#31124b] to-[#3c1c54] rounded-lg shadow-lg mb-6 p-6">
        <h1 className="text-3xl font-bold text-white"> لوحة إدارة البلاغات</h1>
        <p className="text-gray-200 mt-1">إدارة وتنظيم بلاغات المستخدمين </p>
      </div>

      <div className="container mx-auto p-6">
        {/* بطاقات إحصائية */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="جميع البلاغات"
            count={issueStats.all}
            color="#31124b"
          />
          <StatCard
            title="بلاغات معلقة"
            count={issueStats.pending}
            color="#f3a536"
          />
          <StatCard
            title="بلاغات مقبولة"
            count={issueStats.approved}
            color="#10b981"
          />
          <StatCard
            title="بلاغات مرفوضة"
            count={issueStats.rejected}
            color="#ef4444"
          />
        </div>

        {/* أدوات التصفية والبحث */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <div>
                <label className="font-medium text-gray-700 block mb-1">
                  تصفية حسب الحالة
                </label>
                <div className="flex gap-2">
                  <FilterButton
                    active={filter === "all"}
                    onClick={() => setFilter("all")}
                    count={issueStats.all}
                    color="#31124b"
                  >
                    الكل
                  </FilterButton>
                  <FilterButton
                    active={filter === "pending"}
                    onClick={() => setFilter("pending")}
                    count={issueStats.pending}
                    color="#f3a536"
                  >
                    معلقة
                  </FilterButton>
                  <FilterButton
                    active={filter === "approved"}
                    onClick={() => setFilter("approved")}
                    count={issueStats.approved}
                    color="#10b981"
                  >
                    مقبولة
                  </FilterButton>
                  <FilterButton
                    active={filter === "rejected"}
                    onClick={() => setFilter("rejected")}
                    count={issueStats.rejected}
                    color="#ef4444"
                  >
                    مرفوضة
                  </FilterButton>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4  mt-4 ">
                  <div className="flex items-center gap-4">
                    <div>
                      <label className="font-medium text-gray-700 block mb-1">
                        تصفية حسب الخطوره{" "}
                      </label>
                    </div>
                  </div>
                </div>
                <select
                  className="border border-gray-300 rounded-lg px-2 py-1 text-sm"
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                >
                  <option value="">الكل</option>
                  <option value="low">منخفض</option>
                  <option value="medium">متوسط</option>
                  <option value="high">عالي</option>
                </select>
              </div>
            </div>

            <div className="relative">
              <label className="font-medium text-gray-700 block mb-1">
                بحث
              </label>
              <input
                type="text"
                className="w-full md:w-64 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#31124b] focus:border-transparent"
                placeholder="ابحث عن بلاغ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute left-3 top-9">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* فلترة حسب التاريخ */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:w-auto">
              <div>
                <label className="font-medium text-gray-700 block mb-1">
                  من تاريخ
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#31124b] focus:border-transparent"
                  value={dateRange.start}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, start: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="font-medium text-gray-700 block mb-1">
                  إلى تاريخ
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#31124b] focus:border-transparent"
                  value={dateRange.end}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, end: e.target.value })
                  }
                />
              </div>
            </div>

            {/* أزرار التصدير */}
            <div className="flex items-center gap-3 mt-4 lg:mt-0 w-full lg:w-auto justify-end">
              <button
                onClick={() => exportToCSV()}
                className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition shadow-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                تصدير CSV
              </button>

              <button
                onClick={() => exportToPDF(filteredIssues)}
                className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition shadow-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                تصدير PDF
              </button>
            </div>
          </div>
        </div>

        {/* عدد النتائج والإحصائيات */}
        <div className="flex justify-between items-center mb-4">
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
            <span className="text-gray-600">إجمالي النتائج: </span>
            <span className="font-bold text-[#31124b]">
              {filteredIssues.length}
            </span>
            <span className="text-gray-600 mx-2">|</span>
            <span className="text-gray-600">عرض: </span>
            <span className="font-bold text-[#31124b]">
              {currentItems.length}
            </span>
          </div>

          <div className="flex gap-2 items-center">
            <span className="text-gray-600 text-sm">
              عدد العناصر في الصفحة:
            </span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-lg px-2 py-1 text-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* جدول البلاغات */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="inline-block w-12 h-12 border-4 border-[#fa9e1b] border-t-[#31124b] rounded-full animate-spin"></div>
            <p className="mt-4 text-lg text-gray-600">جاري تحميل البلاغات...</p>
          </div>
        ) : filteredIssues.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-gray-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-gray-400"
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
            </div>
            <p className="mt-4 text-lg text-gray-600">لا توجد بلاغات لعرضها</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* جدول للشاشات المتوسطة والكبيرة */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead>
                  <tr className="bg-gradient-to-r from-[#41225b] to-[#3d1a5e] text-white">
                    <th className="px-4 py-3 font-medium">نوع المشكله</th>
                    <th className="px-4 py-3 font-medium">الموقع</th>
                    <th className="px-4 py-3 font-medium">الخطورة</th>
                    <th className="px-4 py-3 font-medium">الصور</th>
                    <th className="px-4 py-3 font-medium">الحالة</th>
                    <th className="px-4 py-3 font-medium">الإجراءات</th>
                  </tr>
                </thead>

                <tbody>
                  {currentItems.map((issue, index) => (
                    <tr
                      key={issue._id}
                      className={`border-b ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-gray-100 transition-colors`}
                    >
                      <td className="px-4 py-3">{issue.problemType}</td>

                      <td className="px-4 py-3">{issue.location}</td>
                      <td className="px-4 py-3">
                        <SeverityBadge level={issue.severityLevel} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {issue.images?.slice(0, 2).map((img, i) => (
                            <div key={i} className="relative group">
                              <div className="w-14 h-14 rounded-md border border-gray-200 bg-gray-50 overflow-hidden">
                                <img
                                  src={img.url}
                                  alt="صورة"
                                  className="w-full h-full object-cover cursor-pointer group-hover:scale-105 transition duration-300"
                                  onClick={() => setSelectedImage(img.url)}
                                />
                              </div>
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 flex items-center justify-center transition rounded-md">
                                <div className="bg-white/70 p-1 rounded-full">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 text-[#41225b]"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        {issue.images?.length > 0 && (
                          <button
                            className="mt-2 flex items-center text-[#41225b] hover:text-[#fa9e1b] text-xs font-medium bg-gray-50 hover:bg-gray-100 px-2 py-1 rounded-md border border-gray-200 transition-colors"
                            onClick={() =>
                              setShowAllImages(
                                issue.images.map((img) => img.url)
                              )
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3.5 w-3.5 ml-1"
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
                            عرض الصور
                          </button>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={issue.status} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          {issue.status === "pending" && (
                            <>
                              <button
                                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-3 py-1 rounded-md text-sm font-medium shadow-sm transition flex items-center gap-1"
                                onClick={() => handleApprove(issue._id)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
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
                                قبول
                              </button>
                              <button
                                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-1 rounded-md text-sm font-medium shadow-sm transition flex items-center gap-1"
                                onClick={() => handleReject(issue._id)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
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
                                رفض
                              </button>
                            </>
                          )}
                          <button
                            className="bg-gradient-to-r from-[#41225b] to-[#3d1a5e] hover:from-[#3d1a5e] hover:to-[#41225b] text-white px-3 py-1 rounded-md text-sm font-medium shadow-sm transition flex items-center gap-1"
                            onClick={() =>
                              router.push(`/dashboard/issues/${issue._id}`)
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                            عرض التفاصيل
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* بطاقات للشاشات الصغيرة */}
            <div className="md:hidden grid grid-cols-1 gap-4 p-4">
              {currentItems.map((issue) => (
                <div
                  key={issue._id}
                  className="bg-white rounded-lg shadow overflow-hidden"
                >
                  {/* رأس البطاقة */}
                  <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100">
                    <div className="flex items-center">
                      <div>
                        <h3 className="font-bold text-gray-800">
                          {issue.problemType}
                        </h3>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatDate(issue.createdAt)}
                        </div>
                      </div>
                    </div>
                    <StatusBadge status={issue.status} />
                  </div>

                  {/* محتوى البطاقة */}
                  <div className="p-4">
                    {/* الموقع والخطورة */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {/* الموقع */}
                      <div>
                        <div className="flex items-center mb-2">
                          <h4 className="text-sm font-semibold text-gray-700">
                            الموقع
                          </h4>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 pr-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 ml-1 text-[#41225b]"
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
                          {issue.location}
                        </div>
                      </div>

                      {/* الخطورة */}
                      <div>
                        <div className="flex items-center mb-2">
                          <h4 className="text-sm font-semibold text-gray-700">
                            الخطورة
                          </h4>
                        </div>
                        <div className="pr-3">
                          <SeverityBadge level={issue.severityLevel} />
                        </div>
                      </div>
                    </div>

                    {/* الصور */}
                    {issue.images?.length > 0 && (
                      <div className="mb-3">
                        <div className="flex items-center mb-2">
                          <h4 className="text-sm font-semibold text-gray-700">
                            الصور
                          </h4>
                        </div>
                        <div className="pr-3">
                          <div className="flex flex-wrap gap-2">
                            {issue.images.slice(0, 3).map((img, i) => (
                              <div key={i} className="relative group">
                                <div className="w-20 h-20 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden shadow-sm">
                                  <img
                                    src={img.url}
                                    alt="صورة"
                                    className="w-full h-full object-cover cursor-pointer group-hover:scale-105 transition duration-300"
                                    onClick={() => setSelectedImage(img.url)}
                                  />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 flex items-center justify-center transition rounded-lg">
                                  <div className="bg-white/70 p-1.5 rounded-full shadow-sm">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-4 w-4 text-[#41225b]"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                      />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            ))}
                            {issue.images.length > 3 && (
                              <div
                                className="w-20 h-20 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center cursor-pointer shadow-sm"
                                onClick={() =>
                                  setShowAllImages(
                                    issue.images.map((img) => img.url)
                                  )
                                }
                              >
                                <span className="text-[#41225b] font-semibold">
                                  +{issue.images.length - 3}
                                </span>
                              </div>
                            )}
                          </div>
                          {issue.images.length > 0 && (
                            <button
                              className="mt-3 flex items-center text-[#41225b] hover:text-[#fa9e1b] text-xs font-medium bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200 transition-colors shadow-sm"
                              onClick={() =>
                                setShowAllImages(
                                  issue.images.map((img) => img.url)
                                )
                              }
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 ml-1"
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
                              عرض كل الصور
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* أزرار الإجراءات */}
                  <div className="px-4 py-3 bg-gray-50 flex flex-wrap gap-2 border-t border-gray-100">
                    {issue.status === "pending" ? (
                      <div className="grid grid-cols-2 gap-2 w-full">
                        <button
                          className="bg-gradient-to-b from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2 rounded-lg text-sm font-medium shadow-sm transition flex items-center justify-center gap-1"
                          onClick={() => handleApprove(issue._id)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
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
                          قبول
                        </button>
                        <button
                          className="bg-gradient-to-b from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2 rounded-lg text-sm font-medium shadow-sm transition flex items-center justify-center gap-1"
                          onClick={() => handleReject(issue._id)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
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
                          رفض
                        </button>
                      </div>
                    ) : (
                      <button
                        className="bg-gradient-to-b from-[#41225b] to-[#3d1a5e] hover:opacity-90 text-white py-2 rounded-lg text-sm font-medium shadow-sm transition flex items-center justify-center gap-1 w-full"
                        onClick={() =>
                          router.push(`/dashboard/issues/${issue._id}`)
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        عرض التفاصيل
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* تقسيم الصفحات */}
        {!loading && filteredIssues.length > 0 && (
          <div className="flex items-center justify-between bg-white mt-4 p-4 rounded-lg shadow-md">
            <div className="text-sm text-gray-600">
              عرض {indexOfFirstItem + 1} -{" "}
              {Math.min(indexOfLastItem, filteredIssues.length)} من{" "}
              {filteredIssues.length} بلاغ
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md border ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-[#31124b] hover:bg-gray-50"
                }`}
              >
                السابق
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`w-8 h-8 rounded-md ${
                      currentPage === number
                        ? "bg-[#31124b] text-white"
                        : "bg-white text-[#31124b] hover:bg-gray-50"
                    }`}
                  >
                    {number}
                  </button>
                )
              )}

              <button
                onClick={() =>
                  paginate(
                    currentPage < totalPages ? currentPage + 1 : totalPages
                  )
                }
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md border ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-[#31124b] hover:bg-gray-50"
                }`}
              >
                التالي
              </button>
            </div>
          </div>
        )}
        {/* عرض الصورة المحددة */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute -top-10 left-0 text-white hover:text-[#fa9e1b] transition"
                onClick={() => setSelectedImage(null)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
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
              <img
                src={selectedImage}
                alt="صورة البلاغ"
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}

        {/* عرض جميع الصور */}
        {showAllImages.length > 0 && (
          <div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAllImages([])}
          >
            <div className="relative max-w-6xl w-full bg-white rounded-lg p-4 max-h-[90vh] overflow-y-auto">
              <button
                className="absolute top-4 left-4 text-[#31124b] hover:text-[#fa9e1b] transition"
                onClick={() => setShowAllImages([])}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
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

              <h3 className="text-xl font-bold text-[#31124b] mb-4 text-center">
                معرض الصور
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {showAllImages.map((img, index) => (
                  <div key={index} className="relative group">
                    <a
                      href={img}
                      download={`bader-image-${index + 1}`}
                      className="absolute top-2 right-2 bg-white text-[#31124b] px-2 py-1 rounded-md text-xs shadow hover:bg-[#fa9e1b] transition z-10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      تحميل
                    </a>
                    <img
                      src={img}
                      alt={`صورة ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg border border-gray-200 cursor-pointer hover:shadow-lg transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage(img);
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 flex items-end justify-center p-2 transition rounded-lg">
                      <span className="text-white text-sm font-medium">
                        صورة {index + 1}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// مكونات مساعدة
function StatCard({ title, count, color }) {
  return (
    <div
      className="bg-white rounded-lg shadow-md p-4 border-l-4"
      style={{ borderColor: color }}
    >
      <h3 className="text-gray-600 font-medium">{title}</h3>
      <p className="text-2xl font-bold mt-2" style={{ color }}>
        {count}
      </p>
    </div>
  );
}

function FilterButton({ children, active, onClick, count, color }) {
  return (
    <button
      className={`px-3 py-1 rounded-md text-sm font-medium transition ${
        active ? "text-white" : "text-gray-700 hover:bg-gray-100"
      }`}
      style={{ backgroundColor: active ? color : "transparent" }}
      onClick={onClick}
    >
      {children} ({count})
    </button>
  );
}

function StatusBadge({ status }) {
  const statusStyles = {
    pending: "bg-amber-100 text-amber-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  const statusText = {
    pending: "معلقة",
    approved: "مقبولة",
    rejected: "مرفوضة",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        statusStyles[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {statusText[status] || status}
    </span>
  );
}

function SeverityBadge({ level }) {
  const severityStyles = {
    low: "bg-green-100 text-green-800",
    medium: "bg-amber-100 text-amber-800",
    high: "bg-red-100 text-red-800",
  };

  const severityText = {
    low: "منخفض",
    medium: "متوسط",
    high: "عالي",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        severityStyles[level] || "bg-gray-100 text-gray-800"
      }`}
    >
      {severityText[level] || level}
    </span>
  );
}
