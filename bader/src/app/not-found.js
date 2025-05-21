// src/app/not-found.js
"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen  flex items-center justify-center">
      <div className="text-center px-4 py-10 max-w-md mx-auto bg-white rounded-xl shadow-xl">
        <div className="mb-8">
          <div className="text-6xl font-bold mb-2" style={{ color: "#31124b" }}>
            404
          </div>
          <div
            className="h-2 w-24 mx-auto mb-4"
            style={{ backgroundColor: "#fa9e1b" }}
          ></div>
          <h1 className="text-2xl font-bold mb-2">صفحة غير موجودة</h1>
          <p className="text-gray-600 mb-6">
            عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
          </p>
        </div>

        <div className="mb-8">
          <svg
            className="mx-auto h-24 w-24"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="100" cy="100" r="80" fill="#f3f4f6" />
            <path
              d="M65 80C65 80 80 95 100 95C120 95 135 80 135 80"
              stroke="#31124b"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <circle cx="70" cy="60" r="8" fill="#31124b" />
            <circle cx="130" cy="60" r="8" fill="#31124b" />
            <path
              d="M100 140C111.046 140 120 131.046 120 120C120 108.954 111.046 100 100 100C88.9543 100 80 108.954 80 120C80 131.046 88.9543 140 100 140Z"
              fill="#fa9e1b"
            />
          </svg>
        </div>

        <div className="flex flex-col space-y-4">
          <button
            onClick={() => router.push("/")}
            className="flex items-center justify-center space-x-2 px-6 py-3 rounded-lg text-white font-medium transition-all duration-200"
            style={{ backgroundColor: "#fa9e1b" }}
          >
            <ArrowLeft size={18} />
            <span>العودة إلى الصفحة الرئيسية</span>
          </button>

          <button
            onClick={() => router.back()}
            className="px-6 py-3 rounded-lg font-medium transition-all duration-200 border"
            style={{ color: "#31124b", borderColor: "#31124b" }}
          >
            العودة للصفحة السابقة
          </button>
        </div>
      </div>
    </div>
  );
}
