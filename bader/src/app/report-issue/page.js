"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/navigation";
import "leaflet/dist/leaflet.css";

import {
  Camera,
  AlertTriangle,
  MapPin,
  FileText,
  Phone,
  User,
} from "lucide-react";
import TermsPopup from "../termsCategories/page";
import dynamic from "next/dynamic";
const LocationPickerMap = dynamic(
  () => import("../components/LocationPickerMap"),
  { ssr: false }
);

const uploadImageToCloudinary = async (file) => {
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

  if (!res.ok) throw new Error("فشل رفع الصورة");
  const data = await res.json();
  return data.secure_url;
};

export default function ReportProblemPage() {
  const [showTerms, setShowTerms] = useState(false);
  const formRef = useRef(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    problemType: "",
    location: "",
    severityLevel: "medium",
    description: "",
    images: [],
    reporterName: "",
    phone: "",
    reportedBy: "",
    locationLat: null, // 👈 جديد
    locationLng: null, // 👈 جديد
    locationName: "", // 👈 جديد
  });
  const [userData, setUserData] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [floating, setFloating] = useState({});

  useEffect(() => {
    let mapInstance = null;
    let markerInstance = null;

    const loadMap = async () => {
      const L = (await import("leaflet")).default;

      const mapContainer = document.getElementById("map");
      if (!mapContainer || mapContainer.dataset.initialized) return;

      mapContainer.dataset.initialized = true;

      mapInstance = L.map("map", {
        center: [31.9632, 35.9304],
        zoom: 9,
        minZoom: 6,
        maxZoom: 16,
        maxBounds: [
          [29.0, 34.0], // جنوب غرب الأردن
          [33.5, 39.0], // شمال شرق الأردن
        ],
        maxBoundsViscosity: 1.0,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(mapInstance);

      mapInstance.on("click", function (e) {
        const { lat, lng } = e.latlng;

        if (!markerInstance) {
          markerInstance = L.marker([lat, lng], { draggable: true }).addTo(
            mapInstance
          );
          markerInstance.on("dragend", (event) => {
            const { lat, lng } = event.target.getLatLng();
            updateCoordinates(lat, lng);
          });
        } else {
          markerInstance.setLatLng([lat, lng]);
        }

        updateCoordinates(lat, lng);
      });
    };

    const updateCoordinates = (lat, lng) => {
      setFormData((prev) => ({
        ...prev,
        locationLat: lat,
        locationLng: lng,
      }));
      console.log("✅ إحداثيات تم اختيارها:", lat, lng);
    };

    setTimeout(loadMap, 300);
  }, []);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get("/api/current-user");
        const user = res.data;
        setUserData(user);
        setFormData((prev) => ({
          ...prev,
          reporterName: user.name || "",
          phone: user.phone || "",
          reportedBy: user._id || "",
        }));
      } catch (err) {
        console.warn("⚠️ لم يتم تسجيل الدخول");
      }
    };
    getUser();
  }, []);

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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setIsUploading(true);
      try {
        const uploadedImages = [];
        for (const file of files) {
          const imageUrl = await uploadImageToCloudinary(file);
          uploadedImages.push(imageUrl);
        }
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...uploadedImages],
        }));
      } catch (error) {
        console.error("❌ رفع الصور فشل:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const problemTypes = [
    "مشاكل الطرق والرصيف",
    "إنارة الشوارع",
    "تراكم النفايات",
    "مشاكل الصرف الصحي",
    "حدائق ومساحات عامة",
    "تلوث بيئي",
    "أخرى",
  ];

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/report", formData);
      if (response.status === 201) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error("❌ فشل في إرسال البلاغ:", error);
    }
  };
  const successRef = useRef(null);

  useEffect(() => {
    if (submitted && successRef.current) {
      successRef.current.scrollIntoView({ behavior: "auto", block: "start" });
    }
  }, [submitted]);

  if (!formData.reporterName?.trim()) {
    return (
      <main className="min-sm min-h-screen flex flex-col items-center justify-center text-center py-24 px-4 bg-white ">
        <div className="bg-white shadow-xl rounded-xl p-8 border border-red-300 max-w-md w-full">
          <p className="text-red-600 text-lg mb-6 flex items-center justify-center gap-2">
            <span className="text-xl">🚫</span> يجب تسجيل الدخول للإبلاغ عن
            مشكلة.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="px-6 py-2 bg-[#fa9e1b] text-white rounded-md hover:bg-[#e38f10] transition"
          >
            الانتقال إلى صفحة تسجيل الدخول
          </button>
        </div>
      </main>
    );
  }
  return (
    <>
      <Head>
        <title>الإبلاغ عن مشكلة</title>
        <meta
          name="description"
          content="قم بالإبلاغ عن المشاكل في حيك ليتم إصلاحها"
        />
      </Head>
      <main dir="rtl" className="min-h-screen py-12 relative">
        {/* الخلفية */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0"></div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-block p-3 rounded-full bg-[#fa9e1b] bg-opacity-10 mb-4">
                <AlertTriangle size={32} className="text-amber-50" />
              </div>
              <h1 className="text-5xl font-bold mb-4 text-[#31124b]">
                الإبلاغ عن مشكلة
              </h1>
              <p className="mt-6 text-xl text-[#31124b] font-medium">
                ساعدنا في تحسين الحي من خلال الإبلاغ عن المشاكل التي تواجهك
              </p>
            </div>

            {submitted ? (
              <div
                ref={successRef}
                className="bg-green-50 border border-green-200 rounded-lg p-6 text-center"
              >
                <div className="inline-block p-3 rounded-full bg-green-100 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-green-500"
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
                <h2 className="text-2xl font-bold text-green-700 mb-2">
                  تم استلام بلاغك بنجاح!
                </h2>
                <p className="text-green-600 mb-4">
                  شكراً لك على المساهمة في تحسين الحي. سيتم مراجعة البلاغ والعمل
                  على حل المشكلة في أقرب وقت ممكن.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      problemType: "",
                      location: "",
                      severityLevel: "medium",
                      description: "",
                      images: [],
                      reporterName: userData?.name || "",
                      phone: userData?.phone || "",
                      locationLat: null,
                    });
                    setTimeout(() => {
                      formRef.current?.scrollIntoView({
                        behavior: "auto",
                        block: "start",
                      });
                    }, 100);
                  }}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
                >
                  إرسال بلاغ آخر
                </button>
              </div>
            ) : (
              <div ref={formRef}>
                <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden ">
                  {/* رأس النموذج */}
                  <div className="bg-white shadow-lg overflow-hidden" dir="rtl">
                    <div className="bg-gradient-to-r from-[#31124b] to-[#411866] py-6 px-8 rounded-xl shadow-xl overflow-hidden">
                      <h2 className="text-2xl font-bold text-white">
                        نموذج الإبلاغ عن مشكلة{" "}
                      </h2>
                      <p className="text-[#fa9e1b] text-opacity-90 mt-5  ">
                        الحقول المطلوبة مميزة بعلامة (*)
                      </p>
                    </div>
                  </div>
                </div>
                <form
                  onSubmit={handleSubmit}
                  className="p-8 space-y-6  bg-gray-50  rounded-xl shadow-xl overflow-hidden"
                >
                  {/* نوع المشكلة */}
                  <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2 text-right">
                      نوع المشكلة <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="problemType"
                        value={formData.problemType}
                        onChange={handleChange}
                        required
                        className="block w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-[#fa9e1b] focus:border-[#fa9e1b] appearance-none text-right pr-10"
                        dir="rtl"
                      >
                        <option value="" disabled>
                          اختر نوع المشكلة
                        </option>
                        {problemTypes.map((type, index) => (
                          <option key={index} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FileText size={20} className="text-gray-500" />
                      </div>
                    </div>
                  </div>

                  {/* مكان المشكلة */}
                  <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2 text-right">
                      مكان المشكلة <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        placeholder="أدخل العنوان التفصيلي للمشكلة"
                        className="block w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-[#fa9e1b] focus:border-[#fa9e1b] text-right pr-10"
                        dir="rtl"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin size={20} className="text-gray-500" />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-gray-700 font-semibold mb-2 text-right">
                        تحديد الموقع على الخريطة <span className="text-red-500">*</span>
                    </label>
                    
                      <LocationPickerMap
                        onLocationSelect={async ({ lat, lng }) => {
                          try {
                            const res = await fetch(
                              `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
                            );
                            const data = await res.json();
                            const address = data.display_name;

                            setFormData((prev) => ({
                              ...prev,
                              locationLat: lat,
                              locationLng: lng,
                              locationName: address,
                            }));
                          } catch (error) {
                            console.error("❌ خطأ في جلب العنوان:", error);
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* درجة الخطورة */}
                  <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2 text-right">
                      درجة الخطورة <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        {
                          label: "منخفضة",
                          value: "low",
                          color: "green-500",
                          textColor: "text-green-600",
                        },
                        {
                          label: "متوسطة",
                          value: "medium",
                          color: "[#fa9e1b]",
                          textColor: "text-[#fa9e1b]",
                        },
                        {
                          label: "عالية",
                          value: "high",
                          color: "red-500",
                          textColor: "text-red-600",
                        },
                      ].map((option) => (
                        <div key={option.value} className="relative">
                          <input
                            type="radio"
                            id={option.value}
                            name="severityLevel"
                            value={option.value}
                            checked={formData.severityLevel === option.value}
                            onChange={handleChange}
                            className="hidden peer"
                            required
                          />
                          <label
                            htmlFor={option.value}
                            className={`flex flex-col items-center bg-white border border-gray-300 rounded-md p-3 cursor-pointer hover:bg-gray-50 transition duration-200 ease-in-out peer-checked:border-${option.color}`}
                          >
                            <div
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mb-2 ${
                                formData.severityLevel === option.value
                                  ? `border-${option.color} bg-${option.color}`
                                  : "border-gray-300"
                              }`}
                            >
                              {formData.severityLevel === option.value && (
                                <svg
                                  className="w-4 h-4 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </div>
                            <span className={`${option.textColor} font-medium`}>
                              {option.label}
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* وصف المشكلة */}
                  <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2 text-right">
                      وصف المشكلة <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      onChange={handleChange}
                      required
                      rows="4"
                      placeholder="قم بوصف المشكلة بالتفصيل..."
                      className="block w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-[#fa9e1b] focus:border-[#fa9e1b] text-right"
                      dir="rtl"
                    ></textarea>
                  </div>

                  {/* صور المشكلة */}
                  <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2 text-right">
                      صور المشكلة
                    </label>
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 transition-all duration-300 hover:border-[#fa9e1b]">
                      <Camera size={40} className="text-gray-400 mb-3" />
                      <p className="text-gray-600 mb-2">
                        اسحب وأفلت الصور هنا أو
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="px-4 py-2 bg-[#fa9e1b] text-white rounded-md cursor-pointer hover:bg-[#7b3edd] transition duration-300"
                      >
                        اختر الصور
                      </label>
                      <p className="text-xs text-gray-500 mt-2">
                        يمكنك رفع حتى 5 صور بحجم أقصى 5 ميجابايت لكل صورة
                      </p>
                    </div>

                    {isUploading && (
                      <div className="mt-3 bg-blue-50 text-blue-700 p-3 rounded flex items-center justify-center">
                        <svg
                          className="animate-spin h-5 w-5 mr-2"
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
                        جاري رفع الصور...
                      </div>
                    )}

                    {formData.images.length > 0 && (
                      <div className="mt-4">
                        <p className="text-gray-700 font-medium mb-2 text-right">
                          الصور المرفقة:
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {formData.images.map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={image}
                                alt={`صورة ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg border border-gray-200"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition duration-200"
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
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-gray-200 my-8"></div>

                  {/* بيانات مقدم البلاغ */}
                  <h3 className="text-xl font-bold text-[#31124b] mb-6 text-right">
                    بيانات مقدم البلاغ
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* الاسم */}
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2 text-right">
                        الاسم <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="reporterName"
                          value={formData.reporterName}
                          onChange={handleChange}
                          required
                          placeholder="أدخل اسمك الكامل"
                          className="block w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-[#fa9e1b] focus:border-[#fa9e1b] text-right pr-10"
                          dir="rtl"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User size={20} className="text-gray-500" />
                        </div>
                      </div>
                    </div>

                    {/* رقم الهاتف */}
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2 text-right">
                        رقم الهاتف <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          placeholder="أدخل رقم هاتفك"
                          className="block w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-[#fa9e1b] focus:border-[#fa9e1b] text-right pr-10"
                          dir="rtl"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone size={20} className="text-gray-500" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* التعهد وإرسال النموذج */}
                  <div className="mt-8">
                    <div className="flex items-start mb-6">
                      <div className="flex items-center h-5">
                        <input
                          id="terms"
                          type="checkbox"
                          required
                          className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-[#fa9e1b]"
                        />
                      </div>
                      <label
                        htmlFor="terms"
                        className="mr-2 text-sm font-medium text-gray-700 text-right flex items-center"
                      >
                        أتعهد بأن جميع المعلومات المقدمة صحيحة وأوافق على{" "}
                        <button
                          type="button"
                          onClick={() => setShowTerms(true)}
                          className="text-[#fa9e1b] hover:cursor-pointer hover:text-[#fa8a1b] transition-colors mr-1"
                        >
                          شروط الخدمة
                        </button>
                      </label>
                    </div>

                    <div className="flex justify-center mt-8">
                      <button
                        type="submit"
                        className="px-8 py-4 bg-gradient-to-r from-[#31124b] to-[#fa9e1b] text-white font-bold rounded-full transition-transform transform hover:scale-105 hover:shadow-lg"
                      >
                        إرسال البلاغ
                      </button>
                    </div>
                    {showTerms && (
                      <TermsPopup onClose={() => setShowTerms(false)} />
                    )}
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
