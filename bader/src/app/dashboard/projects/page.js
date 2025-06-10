"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FiLoader,
  FiPlus,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { unparse } from "papaparse";
import Sortable from "sortablejs";
import Swal from "sweetalert2";

export default function AdminProjectsPage() {
  const [allProjects, setAllProjects] = useState([]); // جميع المشاريع
  const [projects, setProjects] = useState([]); // المشاريع المعروضة حاليًا
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingProject, setEditingProject] = useState(null);
  const [categories, setCategories] = useState([]);
  const [editForm, setEditForm] = useState({
    description: "",
    status: "pending",
    donationTarget: 0,
    volunteerCount: 0,
    volunteerHours: 0,
    images: [],
    mainImage: null,
    category: "",
    locationName: "",
  });
  const [saving, setSaving] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(6); // عدد المشاريع في كل صفحة

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/Admin/projects", {
        params: statusFilter !== "all" ? { status: statusFilter } : {},
      });
      const fetchedProjects = res.data.projects || res.data;
      setAllProjects(fetchedProjects);
      console.log(fetchedProjects);
    } catch {
      toast.error("فشل في تحميل المشاريع");
    } finally {
      setLoading(false);
    }
  };

  // تطبيق pagination على البيانات المحملة
  const applyPagination = () => {
    const startIndex = (currentPage - 1) * projectsPerPage;
    const endIndex = startIndex + projectsPerPage;
    const paginatedProjects = allProjects.slice(startIndex, endIndex);
    setProjects(paginatedProjects);
  };

  useEffect(() => {
    axios
      .get("/api/categories")
      .then((res) => setCategories(res.data))
      .catch(() => toast.error("فشل في تحميل التصنيفات"));
  }, []);

  useEffect(() => {
    const el = document.getElementById("sortable-images");
    if (el && editForm.images.length > 0) {
      Sortable.create(el, {
        animation: 150,
        onEnd: (evt) => {
          const newOrder = Array.from(el.children).map((child) =>
            child.getAttribute("data-id")
          );
          setEditForm((prev) => ({
            ...prev,
            images: newOrder,
          }));
        },
      });
    }
  }, [editForm.images]);

  useEffect(() => {
    setCurrentPage(1); // إعادة تعيين الصفحة إلى الأولى عند تغيير الفلتر
  }, [statusFilter]);

  useEffect(() => {
    fetchProjects();
  }, [statusFilter]);

  // تطبيق pagination عند تغيير الصفحة أو البيانات
  useEffect(() => {
    applyPagination();
  }, [currentPage, allProjects]);

  // Pagination calculations
  const totalProjects = allProjects.length;
  const totalPages = Math.ceil(totalProjects / projectsPerPage);
  const startIndex = (currentPage - 1) * projectsPerPage + 1;
  const endIndex = Math.min(currentPage * projectsPerPage, totalProjects);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-center mt-8 gap-2">
        {/* Previous button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center px-3 py-2 rounded-md transition-colors ${
            currentPage === 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white text-[#41225b] border border-gray-300 hover:bg-gray-50"
          }`}
        >
          <FiChevronRight className="w-4 h-4" />
          <span className="mr-1">السابق</span>
        </button>

        {/* First page if not visible */}
        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="px-3 py-2 rounded-md bg-white text-[#41225b] border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              1
            </button>
            {startPage > 2 && <span className="px-2 text-gray-500">...</span>}
          </>
        )}

        {/* Page numbers */}
        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-2 rounded-md transition-colors ${
              page === currentPage
                ? "bg-[#41225b] text-white"
                : "bg-white text-[#41225b] border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        ))}

        {/* Last page if not visible */}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="px-2 text-gray-500">...</span>
            )}
            <button
              onClick={() => handlePageChange(totalPages)}
              className="px-3 py-2 rounded-md bg-white text-[#41225b] border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center px-3 py-2 rounded-md transition-colors ${
            currentPage === totalPages
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white text-[#41225b] border border-gray-300 hover:bg-gray-50"
          }`}
        >
          <span className="ml-1">التالي</span>
          <FiChevronLeft className="w-4 h-4" />
        </button>
      </div>
    );
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const uploadedImages = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "bader-preset");
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/daaw7azkn/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      uploadedImages.push(data.secure_url);
    }
    setEditForm((prev) => ({
      ...prev,
      images: [...prev.images, ...uploadedImages],
      mainImage: prev.mainImage || uploadedImages[0],
    }));
    toast.success("تم رفع الصور بنجاح");
  };

  const removeImage = (indexToRemove) => {
    setEditForm((prev) => {
      const updatedImages = prev.images.filter((_, i) => i !== indexToRemove);
      const updatedMain =
        prev.mainImage === prev.images[indexToRemove]
          ? updatedImages[0] || null
          : prev.mainImage;
      return {
        ...prev,
        images: updatedImages,
        mainImage: updatedMain,
      };
    });
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setEditForm({
      description: project.description || "",
      status: project.status || "pending",
      donationTarget: project.donationTarget || 0,
      volunteerCount: project.volunteerCount || 0,
      volunteerHours: project.volunteerHours || 0,
      images: project.images || [],
      mainImage: project.mainImage || project.images?.[0] || null,
      category: project.category?._id || project.category || "",
      locationName: project.locationName || "",
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    const numericFields = [
      "donationTarget",
      "volunteerCount",
      "volunteerHours",
    ];

    setEditForm((prev) => ({
      ...prev,
      [name]: numericFields.includes(name) ? Number(value) : value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...editForm,
        mainImage: editForm.mainImage || editForm.images[0],
      };
      if (editingProject) {
        await axios.put(`/api/Admin/projects/${editingProject._id}`, payload);
        toast.success("تم التحديث");
      } else {
        await axios.post("/api/Admin/projects", payload);
        toast.success("تم إضافة المشروع");
      }
      setEditingProject(null);
      setShowAddForm(false);
      fetchProjects();
    } catch {
      toast.error("فشل في العملية");
    } finally {
      setSaving(false);
    }
  };

  const exportCSV = () => {
    const csv = unparse(allProjects); // تصدير جميع المشاريع وليس المعروضة فقط
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "projects.csv");
    link.click();
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["التصنيف", "الحالة", "التبرع", "المتطوعين", "الساعات"]],
      body: allProjects.map((p) => [
        // تصدير جميع المشاريع
        p.category,
        p.status,
        p.donationTarget,
        p.volunteerCount,
        p.volunteerHours,
      ]),
    });
    doc.save("projects.pdf");
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لا يمكنك التراجع بعد حذف المشروع!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "نعم،تأكيد الحذف ",
      cancelButtonText: "إلغاء",
    });
    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/Admin/projects/${id}`);
        toast.success("تم حذف المشروع بنجاح");
        fetchProjects();
      } catch (err) {
        console.error("Delete error:", err);
        toast.error("فشل في حذف المشروع");
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50" dir="rtl">
      {/* الرأس مع خلفية أرجوانية غامقة */}
      <div className="mb-8 bg-[#41225b] rounded-lg shadow-lg p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-white">إدارة المشاريع</h2>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setEditForm({
                  description: "",
                  status: "pending",
                  donationTarget: 0,
                  volunteerCount: 0,
                  volunteerHours: 0,
                  images: [],
                  mainImage: null,
                  category: "",
                  locationName: "",
                });
                setShowAddForm(true);
                setEditingProject(null);
              }}
              className="px-4 py-2 bg-[#fa9e1b] text-[#41225b] rounded-md hover:bg-opacity-90 transition-all font-bold flex items-center gap-1 shadow-md"
            >
              <FiPlus /> مشروع جديد
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Filter section */}
          <div className="flex flex-wrap items-center w-full sm:w-auto">
            <label className="mr-2 pl-3 font-medium text-[#41225b] whitespace-nowrap">
              فلترة حسب الحالة:
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fa9e1b] focus:border-[#fa9e1b] w-full sm:w-auto"
            >
              <option value="all">كل الحالات</option>
              <option value="in-progress">قيد التنفيذ</option>
              <option value="completed">مكتمل</option>
            </select>
          </div>

          {/* Export buttons */}
          <div className="flex gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={exportCSV}
              className="px-4 py-2 bg-white text-[#41225b] rounded-md shadow hover:bg-gray-50 flex items-center gap-2 transition-colors border border-gray-200"
            >
              <span>تصدير CSV</span>
              <span>📄</span>
            </button>
            <button
              onClick={exportPDF}
              className="px-4 py-2 bg-white text-[#41225b] rounded-md shadow hover:bg-gray-50 flex items-center gap-2 transition-colors border border-gray-200"
            >
              <span>تصدير PDF</span>
              <span>📄</span>
            </button>
          </div>
        </div>

        {/* Projects count display */}
        {!loading && (
          <div className="mt-4 text-sm text-gray-600 text-center">
            عرض {startIndex} - {endIndex} من {totalProjects} مشروع
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <FiLoader className="animate-spin text-3xl text-[#fa9e1b]" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p) => (
              <div
                key={p._id}
                className="border rounded-lg p-0 bg-white shadow-md hover:shadow-lg transition overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={p.mainImage || p.images?.[0] || "/placeholder.png"}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#41225b] to-transparent p-3">
                    <h3 className="font-bold text-lg text-white">
                      {p.category.name}
                    </h3>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        p.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : p.status === "in-progress"
                          ? "bg-[#fa9e1b] bg-opacity-20 text-[#ffffff]"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {p.status === "completed" && "مكتمل"}
                      {p.status === "in-progress" && "قيد التنفيذ"}
                      {p.status === "pending" && "قيد الانتظار"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-gray-50 p-2 rounded text-center">
                      <p className="text-xs text-gray-500">التبرع المطلوب</p>
                      <p className="font-bold text-[#41225b]">
                        {p.donationTarget} دينار
                      </p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded text-center">
                      <p className="text-xs text-gray-500">التبرعات حاليا </p>
                      <p className="font-bold text-[#41225b]">
                        {p.donations} دينار
                      </p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded text-center">
                      <p className="text-xs text-gray-500">
                        عدد المتطوعين المطلوب
                      </p>
                      <p className="font-bold text-[#41225b]">
                        {p.volunteerCount}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded text-center">
                      <p className="text-xs text-gray-500">
                        عدد المتطوعين حاليا
                      </p>
                      <p className="font-bold text-[#41225b]">
                        {p.volunteers.length}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-center border-t pt-3">
                    <button
                      onClick={() => handleEdit(p)}
                      className="flex-1 py-2 text-[#41225b] font-medium hover:bg-gray-100 rounded transition-all flex items-center justify-center gap-1"
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
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                      تعديل
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="flex-1 py-2 text-red-600 font-medium hover:bg-red-50 rounded transition-all flex items-center justify-center gap-1"
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      حذف
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Component */}
          {renderPagination()}
        </>
      )}

      {(editingProject || showAddForm) && (
        <div className="fixed inset-0 bg-[#000000ba] bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-lg relative max-h-[90vh] overflow-y-auto shadow-xl">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 bg-[#41225b] p-5 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white tracking-wide">
                  {editingProject ? "تعديل المشروع" : "إضافة مشروع"}
                </h3>
                <button
                  className="text-white hover:text-[#fa9e1b] text-3xl font-bold"
                  onClick={() => {
                    setEditingProject(null);
                    setShowAddForm(false);
                  }}
                >
                  ×
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="mt-20 space-y-5">
              {/* Category */}
              <div>
                <label className="block mb-1 font-semibold text-[#41225b]">
                  التصنيف
                </label>
                <select
                  name="category"
                  value={editForm.category}
                  onChange={handleFormChange}
                  className="border border-gray-300 rounded-md w-full px-3 py-2 focus:ring-2 focus:ring-[#fa9e1b] focus:outline-none"
                >
                  <option value="">اختر تصنيفًا</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Inputs */}
              {[
                { name: "description", label: "الوصف", type: "textarea" },
                { name: "donationTarget", label: "قيمة التبرع المطلوبة" },
                { name: "volunteerCount", label: "عدد المتطوعين" },
                { name: "volunteerHours", label: "عدد ساعات التطوع" },
              ].map(({ name, label, type }) => (
                <div key={name}>
                  <label className="block mb-1 font-semibold text-[#41225b]">
                    {label}
                  </label>
                  {type === "textarea" ? (
                    <textarea
                      name={name}
                      value={editForm[name]}
                      onChange={handleFormChange}
                      className="border border-gray-300 rounded-md w-full px-3 py-2 resize-none focus:ring-2 focus:ring-[#fa9e1b] focus:outline-none"
                      rows={3}
                    />
                  ) : (
                    <input
                      type="number"
                      name={name}
                      value={editForm[name]}
                      onChange={handleFormChange}
                      className="border border-gray-300 rounded-md w-full px-3 py-2 focus:ring-2 focus:ring-[#fa9e1b] focus:outline-none"
                    />
                  )}
                </div>
              ))}

              {/* Status */}
              <div>
                <label className="block mb-1 font-semibold text-[#41225b]">
                  الحالة
                </label>
                <select
                  name="status"
                  value={editForm.status}
                  onChange={handleFormChange}
                  className="border border-gray-300 rounded-md w-full px-3 py-2 focus:ring-2 focus:ring-[#fa9e1b] focus:outline-none"
                >
                  <option value="pending">قيد الانتظار</option>
                  <option value="in-progress">قيد التنفيذ</option>
                  <option value="completed">مكتمل</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block mb-1 font-semibold text-[#41225b]">
                  الموقع
                </label>
                <input
                  type="text"
                  name="locationName"
                  value={editForm.locationName}
                  onChange={handleFormChange}
                  placeholder="مثال: الزرقاء، حي الرشيد"
                  className="border border-gray-300 rounded-md w-full px-3 py-2 focus:ring-2 focus:ring-[#fa9e1b] focus:outline-none"
                />
              </div>

              {/* Images */}
              <div>
                <label className="block mb-1 font-semibold text-[#41225b]">
                  إضافة صور
                </label>
                <div className="border border-dashed border-gray-300 p-4 text-center rounded-md bg-gray-50">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full"
                  />
                </div>
                <div id="sortable-images" className="flex gap-2 flex-wrap mt-2">
                  {editForm.images.map((img, i) => (
                    <div key={img} data-id={img} className="relative group">
                      <img
                        src={img}
                        className="w-20 h-20 object-cover rounded-md border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 text-xs hidden group-hover:block"
                      >
                        ×
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setEditForm((prev) => ({ ...prev, mainImage: img }))
                        }
                        className={`absolute bottom-0 left-0 text-xs px-1 py-0.5 rounded-tr rounded-bl ${
                          editForm.mainImage === img
                            ? "bg-[#fa9e1b] text-[#41225b] font-bold"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        رئيسية
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-[#fa9e1b] text-[#41225b] py-3 rounded-lg hover:bg-opacity-90 transition-all font-bold shadow-md tracking-wide"
              >
                {saving ? "جاري الحفظ..." : "حفظ المشروع"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}