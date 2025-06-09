

"use client";

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
import { useState, useEffect } from "react";
import Head from "next/head";
import { useSearchParams, useRouter } from "next/navigation";
import {
  FaHandHoldingHeart,
  FaMoneyBillWave,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCreditCard,
  FaCalendarAlt,
  FaLock,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { FaPaypal } from "react-icons/fa";
import { useRef } from "react";
import Script from "next/script";
import Swal from "sweetalert2";
import React, { Suspense } from 'react';

export default function DonatePage({ organizationId = null }) {
  
  
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    amount: "",
    paymentMethod: "credit",
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    message: "",
  });
  const [errorUserData, setErrorUserData] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [loading, setLoading] = useState(true);
  const [paypalLoaded, setPaypalLoaded] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (projectId) {
          const res = await fetch(`/api/projects/${projectId}`);
          if (!res.ok) throw new Error("Failed to fetch project");
          const data = await res.json();
          setProjectName(data.project?.title || "");
        } else if (organizationId) {
          const res = await fetch(`/api/organizations/${organizationId}`);
          if (!res.ok) throw new Error("Failed to fetch organization");
          const data = await res.json();
          setOrganizationName(data?.name || "");
        }
      } catch (error) {
        console.error("Error fetching details:", error);
        toast.error("فشل في تحميل تفاصيل المشروع أو المؤسسة");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [projectId, organizationId]);

  const [step, setStep] = useState(1);
  const paypalRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.paymentMethod === "paypal") {
      toast.error("يرجى استخدام زر PayPal لإتمام الدفع");
      return;
    }

    try {
      // التحقق من معلومات البطاقة إذا الدفع ببطاقة
      if (formData.paymentMethod === "credit") {
        const cardName = formData.cardName.trim();
        const cardNumber = formData.cardNumber.replace(/\s+/g, "");
        const expiryDate = formData.expiryDate.trim();
        const cvv = formData.cvv.trim();

        if (!cardName) {
          toast.error("يرجى إدخال اسم حامل البطاقة");
          return;
        }

        if (!/^\d{16}$/.test(cardNumber)) {
          toast.error("يرجى إدخال رقم بطاقة صالح مكون من 16 رقم");
          return;
        }

        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
          toast.error("يرجى إدخال تاريخ انتهاء صالح بصيغة MM/YY");
          return;
        }

        if (!/^\d{3,4}$/.test(cvv)) {
          toast.error("يرجى إدخال رمز أمان صالح (3 إلى 4 أرقام)");
          return;
        }
      }

      // جلب بيانات المستخدم
      const userRes = await fetch("/api/current-user");
      if (!userRes.ok) {
        setErrorUserData(true);
        throw new Error("Failed to fetch user data");
      }

      const userData = await userRes.json();
      const userId = userData._id;
      setErrorUserData(false);

      // تحقق أساسي من المبلغ والمعرف
      if (!formData.amount || !userId) {
        toast.error("يرجى تعبئة جميع الحقول المطلوبة");
        return;
      }

      // إرسال البيانات
      const res = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donorId: userId,
          amount: Number(formData.amount),
          isGeneral: !projectId && !organizationId,
          projectId,
          organizationId,
          method: formData.paymentMethod,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "تم التبرع بنجاح");
        Swal.fire({
          title: "تبرع بنجاح",
          text: "شكراً لتبرعك !",
          icon: "success",
          confirmButtonText: "موافق",
        });

        setFormData({
          name: "",
          email: "",
          phone: "",
          amount: "",
          paymentMethod: "credit",
          cardName: "",
          cardNumber: "",
          expiryDate: "",
          cvv: "",
          message: "",
        });

        setStep(1);
        // إعادة توجيه أو أي إجراء آخر بعد النجاح
      } else {
        throw new Error(data.message || "فشل إرسال التبرع");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "حدث خطأ أثناء إرسال التبرع");
    }
  };

  useEffect(() => {
    if (
      formData.paymentMethod !== "paypal" ||
      !paypalLoaded ||
      !paypalRef.current
    )
      return;

    let paypalButtons;

    try {
      paypalButtons = window.paypal.Buttons({
        style: {
          layout: "vertical",
          label: "paypal",
        },
        fundingSource: window.paypal.FUNDING.PAYPAL,
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: formData.amount || "1.00",
                  currency_code: "USD",
                },
              },
            ],
          });
        },
        onApprove: async (data, actions) => {
          try {
            const details = await actions.order.capture();
            console.log("تم الدفع:", details);
            toast.success("تم الدفع بنجاح عبر PayPal 🎉");
            Swal.fire({
              title: "تبرع بنجاح",
              text: "شكراً لتبرعك !",
              icon: "success",
              confirmButtonText: "موافق",
            });

            const userRes = await fetch("/api/current-user");
            if (!userRes.ok) throw new Error("Failed to fetch user");
            const userData = await userRes.json();
            const userId = userData._id;

            const res = await fetch("/api/donations", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                donorId: userId,
                amount: Number(formData.amount),
                isGeneral: !projectId && !organizationId,
                projectId,
                organizationId,
                method: "paypal",
              }),
            });

            const donationData = await res.json();

            if (res.ok) {
              toast.success("تم حفظ التبرع بنجاح");
              setFormData({
                name: "",
                email: "",
                phone: "",
                amount: "",
                paymentMethod: "credit",
                cardName: "",
                cardNumber: "",
                expiryDate: "",
                cvv: "",
                message: "",
              });
              setStep(1);
            } else {
              throw new Error(
                donationData.message || "فشل حفظ التبرع بعد الدفع"
              );
            }
          } catch (err) {
            console.error(err);
            toast.error(err.message || "خطأ أثناء حفظ التبرع بعد الدفع");
          }
        },
        onError: (err) => {
          console.error("PayPal Error:", err);
          toast.error("حدث خطأ أثناء الدفع عبر PayPal");
        },
      });

      paypalButtons.render(paypalRef.current);
    } catch (err) {
      console.error("Error initializing PayPal:", err);
      toast.error("خطأ في تحميل نظام PayPal");
    }

    return () => {
      if (paypalButtons) {
        try {
          paypalButtons.close();
        } catch (err) {
          console.error("Error cleaning up PayPal buttons:", err);
        }
      }
    };
  }, [formData.paymentMethod, formData.amount, paypalLoaded]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userRes = await fetch("/api/current-user");
        if (!userRes.ok) {
          setErrorUserData(true);
          throw new Error("Failed to fetch user");
        }

        const userData = await userRes.json();
        setErrorUserData(false);

        setFormData((prev) => ({
          ...prev,
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
        }));
      } catch (err) {
        console.error("خطأ في تحميل بيانات المستخدم:", err);
      }
    };

    fetchUser();
  }, []);

  const nextStep = () => {
    const name = formData.name?.trim() || "";
    const email = formData.email?.trim() || "";
    const amount = formData.amount?.trim() || "";
    const phone = formData.phone?.trim() || "";

    if (!name || !email || !amount) {
      toast.error("يرجى تعبئة الاسم، البريد الإلكتروني، ومبلغ التبرع");
      return;
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      toast.error("يرجى إدخال بريد إلكتروني صحيح");
      return;
    }

    if (Number(amount) <= 0) {
      toast.error("يرجى إدخال مبلغ تبرع صالح");
      return;
    }

    if (phone && !/^\d{7,15}$/.test(phone)) {
      toast.error("يرجى إدخال رقم هاتف صالح");
      return;
    }

    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);
  const donationAmounts = [50, 100, 200, 500, 1000];

  if (loading) {
    return (
          <Suspense fallback={<div>Loading donation page...</div>}>

      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner-border text-[#31124b]" role="status">
            <span className="sr-only">جاري التحميل...</span>
          </div>
          <p className="mt-3 text-[#31124b]">جاري تحميل بيانات التبرع...</p>
        </div>
      </div>
          </Suspense>

    );
  }

  if (errorUserData) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center text-center py-24 px-4 bg-white">
        <div className="bg-white shadow-xl rounded-xl p-8 border border-red-300 max-w-md w-full">
          <p className="text-red-600 text-lg mb-6 flex items-center justify-center gap-2">
            <span className="text-xl">🚫</span> يرجى تسجيل الدخول
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
        <Suspense fallback={<div>Loading donation page...</div>}>

    <div dir="rtl" className="min-h-screen">
      <Head>
        <title>التبرع</title>
        <meta name="description" content="صفحة التبرع" />
      </Head>

      <Script
        src={`https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD`}
        strategy="afterInteractive"
        onLoad={() => setPaypalLoaded(true)}
        onError={() => {
          console.error("Failed to load PayPal SDK");
          toast.error("فشل في تحميل نظام الدفع");
        }}
      />

      <main className="container mx-auto px-4 py-12">
        {/* رأس النموذج */}
        <div className="p-8 text-center">
          <div className="inline-flex items-center justify-center p-4 bg-[#fa9e1b] rounded-full mb-4">
            <FaHandHoldingHeart className="text-white text-3xl" />
          </div>
          <h1 className="text-5xl font-bold mb-4 text-[#31124b]">تبرع الآن</h1>
          <p className="mt-6 text-xl text-[#31124b] font-medium">
            ساهم في دعم مبادراتنا وكن شريكاً في التغيير
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* رأس النموذج */}
            <div className="bg-gradient-to-r from-[#31124b] to-[#411866] p-8 ">
              <h1 className="text-3xl font-bold text-white">تبرع الآن</h1>
              <p className="text-[#fa9e1b] mt-5">
                ساهم في دعم مبادراتنا وكن شريكاً في التغيير
              </p>
            </div>

            {/* مؤشر الخطوات */}
            <div className="bg-gray-100 px-8 py-4">
              <div className="flex justify-center items-center">
                <div
                  className={`flex items-center ${
                    step >= 1 ? "text-[#31124b]" : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step >= 1 ? "bg-[#31124b] text-white" : "bg-gray-200"
                    }`}
                  >
                    1
                  </div>
                  <span className="mr-2 font-medium">معلومات التبرع</span>
                </div>
                <div
                  className={`w-12 h-1 mx-2 ${
                    step >= 2 ? "bg-[#31124b]" : "bg-gray-300"
                  }`}
                ></div>
                <div
                  className={`flex items-center ${
                    step >= 2 ? "text-[#31124b]" : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step >= 2 ? "bg-[#31124b] text-white" : "bg-gray-200"
                    }`}
                  >
                    2
                  </div>
                  <span className="mr-2 font-medium">تفاصيل الدفع</span>
                </div>
              </div>
            </div>

            {/* نموذج التبرع */}
            <form
              onSubmit={handleSubmit}
              dir="rtl"
              className="p-8 space-y-6 bg-gray-50 rtl"
            >
              {/* الخطوة الأولى - معلومات التبرع */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* الاسم الكامل */}
                    <div>
                      <label
                        className="block  text-right mb-2 font-semibold text-[#31124b]"
                        htmlFor="name"
                      >
                        <span className="flex items-center gap-2">
                          <FaUser className="text-[#31124b]" /> الاسم الكامل
                        </span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#31124b] text-right"
                        placeholder="أدخل اسمك الكامل"
                      />
                    </div>

                    {/* البريد الإلكتروني */}
                    <div>
                      <label
                        className="block text-right mb-2 font-semibold text-[#31124b]"
                        htmlFor="email"
                      >
                        <span className="flex items-center  gap-2">
                          <FaEnvelope className="text-[#31124b]" /> البريد
                          الإلكتروني
                        </span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#31124b] text-right"
                        placeholder="أدخل بريدك الإلكتروني"
                      />
                    </div>

                    {/* رقم الهاتف */}
                    <div>
                      <label
                        className="block text-right mb-2 font-semibold text-[#31124b]"
                        htmlFor="phone"
                      >
                        <span className="flex items-center gap-2">
                          <FaPhone className="text-[#31124b]" /> رقم الهاتف
                        </span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#31124b] text-right"
                        placeholder="أدخل رقم هاتفك (اختياري)"
                      />
                    </div>

                    {/* مبلغ التبرع */}
                    <div>
                      <label
                        className="block text-right mb-2 font-semibold text-[#31124b]"
                        htmlFor="amount"
                      >
                        <span className="flex items-center  gap-2">
                          <FaMoneyBillWave className="text-[#31124b]" /> مبلغ
                          التبرع
                        </span>
                      </label>
                      <input
                        type="number"
                        id="amount"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                        min="1"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#31124b] text-right"
                        placeholder="أدخل مبلغ التبرع"
                      />
                    </div>
                  </div>

                  {/* قيم مقترحة للتبرع */}
                  <div className="mt-4">
                    <label className="block text-right mb-2 font-semibold text-[#31124b]">
                      قيم مقترحة للتبرع
                    </label>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {donationAmounts.map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              amount: amount.toString(),
                            })
                          }
                          className={`px-4 py-2 rounded-full transition-all ${
                            formData.amount === amount.toString()
                              ? "bg-[#fa9e1b] text-white"
                              : "bg-white border border-[#31124b] text-[#31124b] hover:bg-[#31124b]/10"
                          }`}
                        >
                          {amount} د.أ
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* رسالة مع التبرع */}
                  <div>
                    <label
                      className="block text-right mb-2 font-semibold text-[#31124b]"
                      htmlFor="message"
                    >
                      رسالة مع التبرع (اختياري)
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#31124b] text-right"
                      placeholder="يمكنك إضافة رسالة مع تبرعك"
                    ></textarea>
                  </div>

                  {/* زر التالي */}
                  <div className="flex justify-center mt-8">
                    <button
                      type="button"
                      onClick={nextStep}
                      className="px-8 py-4 bg-gradient-to-r from-[#fa9e1b] to-[#31124b] text-white font-bold rounded-full transition-transform transform hover:scale-105 hover:shadow-lg"
                    >
                      تفاصيل الدفع
                    </button>
                  </div>
                </div>
              )}

              {/* الخطوة الثانية - تفاصيل الدفع */}
              {step === 2 && (
                <div className="space-y-6">
                  {/* طريقة الدفع */}
                  <div>
                    <label className="block text-right mb-2 font-semibold text-[#31124b]">
                      طريقة الدفع
                    </label>
                    <div className="grid grid-cols-1 gap-4">
                      <div
                        className={`p-4 border rounded-lg cursor-pointer flex items-center justify-center gap-3 ${
                          formData.paymentMethod === "bank"
                            ? "border-[#fa9e1b] bg-[#fa9e1b]/10"
                            : "border-gray-300 hover:border-[#31124b]"
                        }`}
                        onClick={() =>
                          setFormData({ ...formData, paymentMethod: "bank" })
                        }
                      >
                        <FaMoneyBillWave className="text-[#31124b] text-xl" />
                        <span>تحويل بنكي</span>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="bank"
                          checked={formData.paymentMethod === "bank"}
                          onChange={handleChange}
                          className="ml-2"
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    className={`p-4 border rounded-lg cursor-pointer flex items-center justify-center gap-3 ${
                      formData.paymentMethod === "paypal"
                        ? "border-[#fa9e1b] bg-[#fa9e1b]/10"
                        : "border-gray-300 hover:border-[#31124b]"
                    }`}
                    onClick={() =>
                      setFormData({ ...formData, paymentMethod: "paypal" })
                    }
                  >
                    <FaPaypal className="text-[#31124b] text-xl" />
                    <span>PayPal</span>
                  </div>

                  {formData.paymentMethod === "paypal" && (
                    <div className="my-6">
                      <div ref={paypalRef} />
                    </div>
                  )}
                  {/* معلومات بطاقة الائتمان */}
                  {formData.paymentMethod === "credit" && (
                    <>
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* اسم حامل البطاقة */}
                        <div>
                          <label
                            className="block text-right mb-2 font-semibold text-[#31124b]"
                            htmlFor="cardName"
                          >
                            <span className="flex items-center gap-2">
                              <FaUser className="text-[#31124b]" /> اسم حامل
                              البطاقة
                            </span>
                          </label>

                          <input
                            type="text"
                            id="cardName"
                            name="cardName"
                            value={formData.cardName}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#31124b] text-right"
                            placeholder="الاسم كما يظهر على البطاقة"
                          />
                        </div>

                        {/* رقم البطاقة */}
                        <div>
                          <label
                            className="block text-right mb-2 font-semibold text-[#31124b]"
                            htmlFor="cardNumber"
                          >
                            <span className="flex items-center  gap-2">
                              <FaCreditCard className="text-[#31124b]" /> رقم
                              البطاقة
                            </span>
                          </label>
                          <input
                            type="text"
                            id="cardNumber"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#31124b] text-right"
                            placeholder="XXXX XXXX XXXX XXXX"
                          />
                        </div>

                        {/* تاريخ الانتهاء */}
                        <div>
                          <label
                            className="block text-right mb-2 font-semibold text-[#31124b]"
                            htmlFor="expiryDate"
                          >
                            <span className="flex items-center j gap-2">
                              <FaCalendarAlt className="text-[#31124b]" /> تاريخ
                              الانتهاء
                            </span>
                          </label>
                          <input
                            type="text"
                            id="expiryDate"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#31124b] text-right"
                            placeholder="MM/YY"
                          />
                        </div>

                        {/* رمز الأمان */}
                        <div>
                          <label
                            className="block text-right mb-2 font-semibold text-[#31124b]"
                            htmlFor="cvv"
                          >
                            <span className="flex items-center gap-2">
                              <FaLock className="text-[#31124b]" /> رمز الأمان
                              (CVV)
                            </span>
                          </label>
                          <input
                            type="text"
                            id="cvv"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#31124b] text-right"
                            placeholder="XXX"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* معلومات التحويل البنكي */}
                  {formData.paymentMethod === "bank" && (
                    <div className="bg-[#31124b]/10 p-6 rounded-lg border border-[#31124b]/30">
                      <h3 className="text-lg font-bold text-[#31124b] mb-3 text-right">
                        معلومات الحساب البنكي
                      </h3>
                      <ul className="space-y-2 text-right">
                        <li className="flex  items-center gap-2">
                          <strong className="text-[#31124b]">
                            {" "}
                            اسم البنك:{" "}
                          </strong>
                          <span>بنك الاتحاد</span>
                        </li>
                        <li className="flex  items-center gap-2">
                          <strong className="text-[#31124b]">
                            {" "}
                            اسم الحساب:
                          </strong>
                          <span>منصه بادر </span>
                        </li>
                        <li className="flex items-center gap-2">
                          <strong className="text-[#31124b]">
                            {" "}
                            رقم الحساب (IBAN):{" "}
                          </strong>
                          <span dir="ltr">BADIR993</span>
                        </li>
                      </ul>
                    </div>
                  )}

                  {/* ملخص التبرع */}
                  <div className="bg-gray-100 p-6 rounded-lg border border-gray-200 mt-6">
                    <h3 className="text-lg font-bold text-[#31124b] mb-3 text-right">
                      ملخص التبرع
                    </h3>
                    <div className="space-y-2">
                      <div
                        dir="ltr"
                        className="flex justify-between items-center border-b border-gray-300 pb-2"
                      >
                        <span className="font-bold">
                          {formData.amount || "0"} د.أ
                        </span>
                        <span className="text-black font-bold">
                          مبلغ التبرع
                        </span>
                      </div>
                      {projectName && (
                        <div
                          dir="ltr"
                          className="flex justify-between items-center border-b border-gray-300 pb-2"
                        >
                          <span className="font-bold">{projectName}</span>
                          <span className="text-black font-bold">
                            مشروع مستفيد
                          </span>
                        </div>
                      )}

                      {organizationName && (
                        <div
                          dir="ltr"
                          className="flex justify-between items-center border-b border-gray-300 pb-2"
                        >
                          <span className="font-bold">{organizationName}</span>
                          <span>الجهة المستفيدة</span>
                        </div>
                      )}

                      {!projectName && !organizationName && (
                        <div
                          dir="ltr"
                          className="flex justify-between items-center border-b border-gray-300 pb-2"
                        >
                          <span className="font-bold">تبرع عام</span>
                          <span>نوع التبرع</span>
                        </div>
                      )}

                      <div
                        dir="ltr"
                        className="flex justify-between items-center pt-2 text-lg font-bold text-[#31124b]"
                      >
                        <span>{formData.amount || "0"} د.أ</span>
                        <span>المبلغ الإجمالي</span>
                      </div>
                    </div>
                  </div>

                  {/* أزرار التنقل */}
                  <div className="flex justify-between mt-8">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-6 py-3 bg-gray-200 text-[#31124b] font-medium rounded-full hover:bg-gray-300 transition-all"
                    >
                      العودة
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-3 bg-gradient-to-r from-[#31124b] to-[#31124b] text-white font-bold rounded-full transition-transform transform hover:scale-105 hover:shadow-lg"
                    >
                      إتمام عملية التبرع
                    </button>
                  </div>
                </div>
              )}
            </form>

            {/* التذييل */}
            <div className="bg-gray-100 p-6 text-center border-t border-gray-200">
              <p className="text-[#31124b]">
                جميع التبرعات آمنة ومشفرة. شكراً لدعمكم الكريم.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
     </Suspense>
  );
}
