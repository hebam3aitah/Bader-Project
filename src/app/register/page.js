"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signIn } from "next-auth/react"; // ✅ تأكد من هذا السطر
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{10}$/;
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "fullName":
        if (!value.trim()) {
          error = "الاسم مطلوب";
        } else if (value.trim().split(" ").length < 2) {
          error = "الاسم يجب أن يتكون من مقطعين على الأقل";
        }
        break;
      case "email":
        if (!value.includes("@")) {
          error = "البريد يجب أن يحتوي على @";
        } else if (!value.endsWith("@gmail.com")) {
          error = "يجب استخدام بريد Gmail فقط";
        } else if (!emailRegex.test(value)) {
          error = "صيغة البريد غير صحيحة";
        }
        break;
      case "password":
        if (!passwordRegex.test(value))
          error =
            "كلمة المرور يجب أن تكون 8 أحرف على الأقل وتحتوي على حرف، رقم، ورمز";
        break;
      case "phone":
        if (!value) {
          error = "رقم الهاتف مطلوب";
        } else if (!/^\d+$/.test(value)) {
          error = "رقم الهاتف يجب أن يحتوي على أرقام فقط";
        } else if (!value.startsWith("07")) {
          error = "رقم الهاتف يجب أن يبدأ بـ 07";
        } else if (value.length < 10) {
          error = `أدخلت ${value.length} أرقام، يجب أن يكون الرقم 10 أرقام`;
        }
        break;
      case "address":
        if (!value.trim()) error = "العنوان مطلوب";
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };
  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = "الاسم مطلوب";
    } else if (formData.fullName.trim().split(" ").length < 2) {
      newErrors.fullName = "الاسم يجب أن يتكون من مقطعين على الأقل";
    }

    if (!formData.email.includes("@")) {
      newErrors.email = "البريد يجب أن يحتوي على @";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "صيغة البريد غير صحيحة";
    }
    if (!passwordRegex.test(formData.password))
      newErrors.password =
        "كلمة المرور يجب أن تكون 8 أحرف على الأقل وتحتوي على حرف، رقم، ورمز";
    if (!formData.phone) {
      newErrors.phone = "رقم الهاتف مطلوب";
    } else if (!/^\d+$/.test(formData.phone)) {
      newErrors.phone = "رقم الهاتف يجب أن يحتوي على أرقام فقط";
    } else if (!formData.phone.startsWith("07")) {
      newErrors.phone = "رقم الهاتف يجب أن يبدأ بـ 07";
    } else if (formData.phone.length !== 10) {
      newErrors.phone = `أدخلت ${formData.phone.length} أرقام، يجب أن يكون الرقم 10 أرقام`;
    }
    

    if (!formData.address.trim()) newErrors.address = "العنوان مطلوب";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [passwordCriteria, setPasswordCriteria] = useState({
    hasLetter: false,
    hasNumber: false,
    hasSymbol: false,
    isLongEnough: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (!validate()) {
    //   setLoading(false);
    //   return;
    // }
    // setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          address: formData.address,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "فشل في إنشاء الحساب");
      } else {
        toast.warn(" تحقق من بريدك الإلكتروني لإدخال رمز التحقق");
        sessionStorage.setItem("verificationEmail", formData.email);
        setTimeout(() => {
          window.location.href = "/EmailVerificationPage";
        }, 2000);
      }
    } catch (error) {
      console.error("❌ Register Error:", error);
      toast.error("حدث خطأ أثناء إنشاء الحساب");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
    if (name === "password") {
      setPasswordCriteria({
        hasLetter: /[A-Za-z]/.test(value),
        hasNumber: /\d/.test(value),
        hasSymbol: /[!@#$%^&*]/.test(value),
        isLongEnough: value.length >= 8,
      });
    }
  }, []);

  return (
    <div
      dir="rtl"
      className="flex items-center justify-center min-h-screen bg-gray-200 p-5"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl mx-4"
      >
        <div className="text-center p-6 bg-gradient-to-r ">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto h-16 w-16 bg-gradient-to-r from-[#fa9e1b] to-[#31124b] rounded-full flex items-center justify-center mb-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </motion.div>
          <h1 className="text-2xl font-bold text-[#31124b] mb-1">
            إنشاء حساب جديد
          </h1>
          <p className="text-[#31124b] text-sm mt-7">
            سجل الآن لكي تتمكن من استخدام منصتنا
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-5">
            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="group relative"
            >
              <div className="flex items-center mb-1 gap-2">
                <svg
                  className="w-4 h-4 text-[#662480] mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-[#31124b]"
                >
                  الاسم الكامل
                </label>
              </div>

              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="أدخل اسمك الكامل"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-[#31124b] transition-all"
                required
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
              )}
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"></div>
            </motion.div>
          </div>

          <div>
            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="group relative"
            >
              <div className="flex items-center mb-1 gap-2">
                <svg
                  className="w-4 h-4 text-[#662480] mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  ></path>
                </svg>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  البريد الإلكتروني
                </label>
              </div>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="أدخل بريدك الإلكتروني"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-[#31124b] transition-all"
                required
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"></div>
            </motion.div>
          </div>

          <div>
  <motion.div
    initial={{ x: -10, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ delay: 0.3, duration: 0.3 }}
    className="group"
  >
    <div className="flex items-center mb-1 gap-2">
      <svg
        className="w-4 h-4 text-[#662480] mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
      <label htmlFor="password" className="block text-sm font-medium text-gray-700">
        كلمة المرور
      </label>
    </div>

    {/* حقل كلمة المرور مع زر العين */}
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="أدخل كلمة المرور"
        className="w-full px-4 pr-10 py-2 border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-[#31124b] transition-all"
        required
      />

      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute top-1/2 -translate-y-1/2 right-3 z-10"
      >
        {showPassword ? (
          <EyeOffIcon className="h-5 w-5 text-gray-500" />
        ) : (
          <EyeIcon className="h-5 w-5 text-gray-500" />
        )}
      </button>
    </div>

    {/* الرسالة التحذيرية */}
    {errors.password &&
      !(
        passwordCriteria.hasLetter &&
        passwordCriteria.hasNumber &&
        passwordCriteria.hasSymbol &&
        passwordCriteria.isLongEnough
      ) && (
        <p className="text-red-500 text-xs mt-1">{errors.password}</p>
      )}

    {/* تحقق الشروط */}
    {formData.password && (
      <ul className="text-xs text-right mt-2 space-y-1">
        <li className={passwordCriteria.hasLetter ? "text-green-600" : "text-gray-500"}>
          {passwordCriteria.hasLetter ? "✅" : "⬜"} يحتوي على حرف
        </li>
        <li className={passwordCriteria.hasNumber ? "text-green-600" : "text-gray-500"}>
          {passwordCriteria.hasNumber ? "✅" : "⬜"} يحتوي على رقم
        </li>
        <li className={passwordCriteria.hasSymbol ? "text-green-600" : "text-gray-500"}>
          {passwordCriteria.hasSymbol ? "✅" : "⬜"} يحتوي على رمز (!@#$%)
        </li>
        <li className={passwordCriteria.isLongEnough ? "text-green-600" : "text-gray-500"}>
          {passwordCriteria.isLongEnough ? "✅" : "⬜"} على الأقل 8 أحرف
        </li>
      </ul>
    )}
  </motion.div>
</div>

          <div>
            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="group relative"
            >
              <div className="flex items-center mb-1 gap-2">
                <svg
                  className="w-4 h-4 text-[#662480] mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  ></path>
                </svg>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  رقم الهاتف
                </label>
              </div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="أدخل رقم هاتفك"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-[#31124b] transition-all"
                required
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"></div>
            </motion.div>
          </div>

          <div>
            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="group relative"
            >
              <div className="flex items-center mb-1 gap-2">
                <svg
                  className="w-4 h-4 text-[#662480] mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  العنوان
                </label>
              </div>

              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="أدخل عنوانك بالتفصيل"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-[#31124b] transition-all"
                rows="3"
                required
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">{errors.address}</p>
              )}
            </motion.div>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-4 bg-gradient-to-r from-[#31124b] to-[#fa9e1b] text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                جاري إنشاء حساب
              </span>
            ) : (
              <span> إنشاء حساب</span>
            )}
            {/* {!loading && (
              <motion.span
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="absolute top-0 bottom-0 left-0 w-20 h-full bg-white opacity-20 transform rotate-12"
              />
            )} */}
          </motion.button>
        </form>

        <div className="p-6 pt-0 text-center">
          <p className="text-s text-gray-600 mb-10">
            لديك حساب بالفعل؟{" "}
            <Link
              href="/login"
              className="text-[#31124b] font-medium hover:text-[#fa9e1b] transition-colors"
            >
              تسجيل الدخول
              
            </Link>
          </p>

          <div className="relative flex items-center justify-center">
            <hr className="w-full border-gray-300" />
            <span className="absolute bg-white px-5 text-sm mb-4 text-gray-500">
              أو سجل دخول باستخدام
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="mt-4 flex items-center justify-center w-full border border-gray-300 rounded-lg py-2 px-4 transition-colors hover:bg-gray-50"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google logo"
              className="w-5 h-5 mr-2"
            />
            <span>Google تسجيل الدخول باستخدام</span>
          </motion.button>
        </div>
      </motion.div>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}
