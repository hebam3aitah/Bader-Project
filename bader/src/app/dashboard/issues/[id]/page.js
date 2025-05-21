// app/dashboard/issues/[id]/page.js
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Trash2,
  Save,
  Plus,
  RefreshCw,
  MapPin,
  AlertTriangle,
  Upload,
  Users,
  DollarSign,
} from "lucide-react";

export default function IssueEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  const [formData, setFormData] = useState({
    problemType: "",
    description: "",
    location: "",
    severityLevel: "",
    donationTarget: 0,
    volunteerCount: 0,
    volunteerHours: 0, // ✅ أضف هذا السطر
    locationLat: 0,
    locationLng: 0,
    locationName: "", // نتيجة reverse geocoding
    category: null,
  });

  const handleConvertToProject = async () => {
    if (!formData.problemType) {
      toast.warning("⚠️ يجب اختيار نوع المشكلة قبل التحويل إلى مشروع");
      return;
    }

    try {
      console.log("محاولة تحديث التصنيف:", {
        category: formData.category,
        problemType: formData.problemType,
      });

      const updateResponse = await axios.put(`/api/issues/${id}`, {
        ...formData,
        category: formData.category,
        images: issue.images,
      });

      console.log("تم تحديث البلاغ:", updateResponse.data);
      toast.info("تم تحديث البلاغ بنجاح، جاري التحويل إلى مشروع...");

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const refreshedIssue = await axios.get(`/api/issues/${id}`);
      console.log("البلاغ بعد التحديث:", refreshedIssue.data);

      const res = await axios.post(
        "/api/Admin/convert-to-project",
        {
          issueId: id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("✅ تم تحويل البلاغ إلى مشروع بنجاح");
      router.push("/dashboard/projects");
    } catch (error) {
      console.error("تحويل فشل:", error);
      console.log("تفاصيل الخطأ:", {
        message: error.message,
        response: error.response?.data,
        status: "in-progress",
        formData: formData,
      });

      toast.error(
        `❌ فشل في تحويل البلاغ: ${
          error.response?.data?.error || error.message
        }`
      );
    }
  };

  useEffect(() => {
    if (id) {
      fetchIssue();
      fetchCategories();
    }
  }, [id]);

  const fetchIssue = async () => {
    try {
      const res = await axios.get(`/api/issues/${id}`);
      const data = res.data;
      setIssue(data);

      const categoryId = data.category
        ? data.category._id || data.category
        : null;

      setFormData({
        problemType: data.problemType || "",
        description: data.description || "",
        location: data.location || "",
        severityLevel: data.severityLevel || "",
        donationTarget: data.donationTarget || 0,
        volunteerCount: data.volunteerCount || 0,
        volunteerHours: data.volunteerHours || 0, // ✅ أضف هذا السطر
        locationLat: data.locationLat,
        locationLng: data.locationLng,
        locationName: data.locationName,
        category: categoryId,
      });
    } catch (err) {
      toast.error("فشل في جلب بيانات البلاغ");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/categories");
      setCategories(res.data);
    } catch (err) {
      toast.error("فشل في تحميل التصنيفات");
    }
  };

  const handleChange = (e) => {
    if (e.target.name === "problemType") {
      const selectedCategory = categories.find(
        (cat) => cat.name === e.target.value
      );
      console.log("Categoría seleccionada:", selectedCategory);

      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
        category: selectedCategory ? selectedCategory._id : null,
      });

      if (selectedCategory && issue) {
        setIssue({
          ...issue,
          problemType: e.target.value,
          category: selectedCategory._id,
        });
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleRemoveImage = (url) => {
    const updatedImages = issue.images.filter((img) => img.url !== url);
    setIssue({ ...issue, images: updatedImages });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingImages(true);
    try {
      const uploaded = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append(
          "upload_preset",
          process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
        );

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await res.json();
        uploaded.push({ url: data.secure_url });
      }

      const newImages = [...(issue.images || []), ...uploaded];
      setIssue({ ...issue, images: newImages });
      toast.success(`تم رفع ${uploaded.length} صورة بنجاح`);
    } catch (error) {
      toast.error("حدث خطأ أثناء رفع الصور");
    } finally {
      setUploadingImages(false);
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(`/api/issues/${id}`, {
        ...formData,
        images: issue.images,
      });
      toast.success("✅ تم حفظ التعديلات بنجاح");
      router.push("/dashboard/issues");
    } catch (err) {
      toast.error("فشل في حفظ التعديلات");
    }
  };

  const getSeverityBadgeColor = (level) => {
    switch (level) {
      case "high":
        return "bg-red-100 text-red-700 border-red-300";
      case "medium":
        return "bg-amber-100 text-amber-700 border-amber-300";
      case "low":
        return "bg-green-100 text-green-700 border-green-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#31124b]"></div>
      </div>
    );

  if (!issue)
    return (
      <div className="p-6 text-red-500 text-center">
        <AlertTriangle className="h-12 w-12 mx-auto mb-2" />
        لم يتم العثور على البلاغ
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <ToastContainer
        position="top-left"
        autoClose={3000}
        rtl={true}
        theme="colored"
      />

      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-bold text-[#31124b] flex items-center">
            <RefreshCw className="h-6 w-6 ml-2" /> تعديل البلاغ
          </h1>
          <div className="flex space-x-2">
            <button
              onClick={() => router.push("/dashboard/issues")}
              className="border border-gray-300 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-all"
            >
              رجوع
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* العمود الأول - المعلومات الرئيسية */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-[#31124b] to-[#3d1a5e] text-white py-3 px-4">
                <h2 className="text-lg font-bold">معلومات البلاغ</h2>
              </div>

              <div className="p-5 space-y-5">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    نوع المشكلة:
                  </label>
                  <select
                    name="problemType"
                    value={formData.problemType}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-[#fa9e1b] focus:border-transparent transition-all outline-none"
                  >
                    <option value="">اختر نوع المشكلة</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    الوصف:
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2 h-28 focus:ring-2 focus:ring-[#fa9e1b] focus:border-transparent transition-all outline-none"
                  />
                </div>

                <div className="flex items-center">
                  <div className="flex-grow">
                    <label className="block font-semibold text-gray-700 mb-1">
                      الموقع:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full border rounded-md pl-3 pr-10 py-2 focus:ring-2 focus:ring-[#fa9e1b] focus:border-transparent transition-all outline-none"
                      />
                      <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex-grow">
                    <label className="block font-semibold text-gray-700 mb-1">
                      الموقع على الخريطة:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="locationName"
                        value={formData.locationName}
                        onChange={handleChange}
                        className="w-full border rounded-md pl-3 pr-10 py-2 focus:ring-2 focus:ring-[#fa9e1b] focus:border-transparent transition-all outline-none"
                      />
                      <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    درجة الخطورة:
                  </label>
                  <div className="flex space-x-1 justify-between rtl:space-x-reverse">
                    {["low", "medium", "high"].map((level) => {
                      const isSelected = formData.severityLevel === level;
                      const levelInArabic = {
                        low: "منخفضة",
                        medium: "متوسطة",
                        high: "عالية",
                      };
                      const colorClasses = {
                        low: isSelected
                          ? "bg-green-500 border-green-500 text-white"
                          : "bg-white text-green-500 border-green-500",
                        medium: isSelected
                          ? "bg-amber-500 border-amber-500 text-white"
                          : "bg-white text-amber-500 border-amber-500",
                        high: isSelected
                          ? "bg-red-500 border-red-500 text-white"
                          : "bg-white text-red-500 border-red-500",
                      };

                      return (
                        <button
                          key={level}
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, severityLevel: level })
                          }
                          className={`flex-1 py-2 border-2 rounded-md font-medium transition-colors ${colorClasses[level]}`}
                        >
                          {levelInArabic[level]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      قيمة التبرع المطلوبة:
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="donationTarget"
                        value={formData.donationTarget}
                        onChange={handleChange}
                        className="w-full border rounded-md pl-3 pr-10 py-2 focus:ring-2 focus:ring-[#fa9e1b] focus:border-transparent transition-all outline-none"
                      />
                      <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      عدد المتطوعين المطلوبين:
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="volunteerCount"
                        value={formData.volunteerCount}
                        onChange={handleChange}
                        className="w-full border rounded-md pl-3 pr-10 py-2 focus:ring-2 focus:ring-[#fa9e1b] focus:border-transparent transition-all outline-none"
                      />
                      <Users className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    عدد ساعات التطوع المطلوبة:
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="volunteerHours"
                      value={formData.volunteerHours}
                      onChange={handleChange}
                      className="w-full border rounded-md pl-3 pr-10 py-2 focus:ring-2 focus:ring-[#fa9e1b] focus:border-transparent transition-all outline-none"
                    />
                    <Users className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-white shadow-md rounded-lg overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-[#31124b] to-[#3d1a5e] text-white py-3 px-4">
                <h2 className="text-lg font-bold">صور البلاغ</h2>
              </div>

              <div className="p-5">
                <div className="mb-4">
                  <label className="block font-semibold text-gray-700 mb-2">
                    إضافة صور جديدة:
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                    />
                    <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg py-4 px-6 bg-gray-50 hover:bg-gray-100 transition-colors">
                      <Upload className="h-6 w-6 text-gray-400 mr-2" />
                      <span className="text-gray-600">
                        اسحب الصور هنا أو اضغط للتحميل
                      </span>
                    </div>
                  </div>
                </div>

                {uploadingImages && (
                  <div className="flex justify-center my-4">
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#31124b] mr-2"></div>
                      <span>جاري رفع الصور...</span>
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <label className="block font-semibold text-gray-700 mb-2">
                    الصور المرفقة ({issue.images?.length || 0}):
                  </label>
                  {issue.images?.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {issue.images?.map((img, i) => (
                        <div
                          key={i}
                          className="relative group overflow-hidden rounded-lg"
                        >
                          <img
                            src={img.url}
                            alt={`صورة ${i + 1}`}
                            className="w-full h-24 object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(img.url)}
                              className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-500">لا توجد صور مرفقة</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* العمود الثاني - معلومات المبلغ والإجراءات */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-[#31124b] to-[#3d1a5e] text-white py-3 px-4">
                <h2 className="text-lg font-bold">معلومات مقدم البلاغ</h2>
              </div>

              <div className="p-5">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-semibold text-gray-600">الاسم:</span>
                    <span>{issue.reporterName}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-semibold text-gray-600">
                      رقم الهاتف:
                    </span>
                    <span dir="ltr">{issue.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-600">
                      تاريخ البلاغ:
                    </span>
                    <span>
                      {new Date(issue.createdAt).toLocaleString("ar-EG")}
                    </span>
                  </div>
                </div>

                <div className="my-6">
                  <div
                    className={`rounded-lg p-3 border ${getSeverityBadgeColor(
                      formData.severityLevel
                    )}`}
                  >
                    <div className="font-bold mb-1">حالة البلاغ:</div>
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-1" />
                      <span className="font-medium">
                        {formData.severityLevel === "high" && "خطورة عالية"}
                        {formData.severityLevel === "medium" && "خطورة متوسطة"}
                        {formData.severityLevel === "low" && "خطورة منخفضة"}
                        {!formData.severityLevel && "غير محدد"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mt-8">
                  <button
                    onClick={handleSave}
                    className="w-full flex items-center justify-center bg-[#31124b] text-white py-3 px-4 rounded-md hover:bg-[#3d1a5e] transition-colors shadow-md"
                  >
                    <Save className="h-5 w-5 ml-2" />
                    حفظ التعديلات
                  </button>

                  <button
                    onClick={handleConvertToProject}
                    className="w-full flex items-center justify-center bg-[#fa9e1b] text-white py-3 px-4 rounded-md hover:bg-amber-500 transition-colors shadow-md"
                  >
                    <Plus className="h-5 w-5 ml-2" />
                    تحويل إلى مشروع
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
