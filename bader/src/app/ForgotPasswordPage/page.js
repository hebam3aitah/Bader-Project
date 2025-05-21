'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1); // 1: إدخال البريد الإلكتروني، 2: إدخال رمز OTP، 3: كلمة المرور الجديدة
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [timer, setTimer] = useState(120); // مؤقت زمني لإعادة إرسال الرمز (بالثواني)
  const [timerActive, setTimerActive] = useState(false);
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];
  
  // التعامل مع إدخال OTP
  const handleOtpChange = (index, e) => {
    const value = e.target.value;
    if (isNaN(value)) return; // التأكد من أن القيمة رقمية فقط
    
    // تحديث قيمة OTP
    const newOtp = [...otp];
    newOtp[index] = value.substring(0, 1);
    setOtp(newOtp);
    
    // الانتقال إلى الحقل التالي إذا تم إدخال رقم
    if (value && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };
  
  // التعامل مع مفتاح المسح
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };
  
  // إرسال البريد الإلكتروني لإعادة تعيين كلمة المرور
  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/forgot-password', { email });
      toast.success(res.data.message);
      setStep(2);
      setTimerActive(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'حدث خطأ!');
    }
  };
  
  
  
  // التحقق من رمز OTP
  const verifyOtp = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length !== 4) {
      toast.warn('أدخل رمز مكون من 4 أرقام');
      return;
    }
  
    try {
      const res = await axios.post('/api/auth/verify-reset-otp', { email, otp: otpValue });
      toast.success(res.data.message);
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || 'فشل التحقق من الرمز');
    }
  };
  
  
  // إعادة إرسال رمز OTP
  const resendOtp = () => {
    if (timer === 0) {
      // إعادة تعيين المؤقت
      setTimer(120);
      setTimerActive(true);
      
      // هنا يمكن إضافة منطق إعادة إرسال الرمز
      alert('تم إعادة إرسال رمز التحقق');
    }
  };
 const handleResetPassword = async (e) => {
  e.preventDefault();

  if (!password || password !== confirmPassword || passwordStrength < 75) {
    toast.warn('تحقق من قوة وتطابق كلمة المرور');
    return;
  }

  try {
    const res = await axios.post('/api/auth/reset-password', { email, password });
    toast.success(res.data.message);
    setTimeout(() => {
      window.location.href = '/login';
    }, 2000);
  } catch (err) {
    toast.error(err.response?.data?.message || 'حدث خطأ');
  }
};

  
  
  // تأثير المؤقت
  useEffect(() => {
    let interval;
    if (timerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setTimerActive(false);
    }
    
    return () => clearInterval(interval);
  }, [timerActive, timer]);
  
  // تحقق من قوة كلمة المرور
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }
    
    let strength = 0;
    // التحقق من طول كلمة المرور
    if (password.length >= 8) strength += 25;
    // التحقق من وجود أرقام
    if (/\d/.test(password)) strength += 25;
    // التحقق من وجود أحرف صغيرة
    if (/[a-z]/.test(password)) strength += 25;
    // التحقق من وجود أحرف كبيرة أو رموز خاصة
    if (/[A-Z]/.test(password) || /[^a-zA-Z0-9]/.test(password)) strength += 25;
    
    setPasswordStrength(strength);
  }, [password]);
  
  // تغيير كلمة المرور
  
  
  // تنسيق الوقت للعرض
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' + mins : mins}:${secs < 10 ? '0' + secs : secs}`;
  };
  
  // تحديد لون قوة كلمة المرور
  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-gray-200';
    if (passwordStrength <= 25) return 'bg-red-500';
    if (passwordStrength <= 50) return 'bg-orange-500';
    if (passwordStrength <= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  // تأثيرات الخلفية المتحركة
  const floatingElements = Array(6).fill(0).map((_, i) => (
    <motion.div
      key={i}
      className="absolute rounded-full opacity-5"
      style={{
        background: i % 2 === 0 ? '#31124b' : '#fa9e1b',
        width: `${Math.random() * 200 + 50}px`,
        height: `${Math.random() * 200 + 50}px`,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        filter: 'blur(40px)',
      }}
      animate={{
        x: [0, Math.random() * 50 - 25],
        y: [0, Math.random() * 50 - 25],
      }}
      transition={{
        repeat: Infinity,
        repeatType: 'reverse',
        duration: Math.random() * 5 + 5,
      }}
    />
  ));

  return (
    <>
      <Head>
        <title>استعادة كلمة المرور</title>
        <meta name="description" content="صفحة استعادة كلمة المرور" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ToastContainer position="top-center" autoClose={3000} />

      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
        {/* تأثيرات الخلفية المتحركة */}
        {floatingElements}
        
        {/* البطاقة الرئيسية */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl relative z-10 overflow-hidden"
        >
          {/* زخرفة خلفية البطاقة */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#31124b] to-[#fa9e1b]"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent to-[#fa9e1b]/5 pointer-events-none"></div>
          
          {/* الرأس */}
          <div className="text-center">
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20 
              }}
              className="mx-auto h-16 w-16 bg-[#31124b] rounded-full flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </motion.div>
            <h2 className="mt-4 text-2xl font-extrabold text-[#31124b]">استعادة كلمة المرور</h2>
            <p className="mt-2 text-sm text-gray-600">
              {step === 1 ? 'أدخل بريدك الإلكتروني لاستلام رمز التحقق' : 
               step === 2 ? 'أدخل رمز التحقق المرسل إلى بريدك الإلكتروني' : 
               'أدخل كلمة المرور الجديدة'}
            </p>
          </div>
          
          {/* شريط التقدم */}
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-[#31124b] bg-[#fa9e1b]/20">
                {`الخطوة ${step} من 3`}
              </div>
            </div>
            <div className="overflow-hidden h-2 text-xs flex rounded bg-[#31124b]/10">
              <motion.div
                initial={{ width: `${(step - 1) * 33.33}%` }}
                animate={{ width: `${step * 33.33}%` }}
                transition={{ duration: 0.5 }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-[#31124b] to-[#fa9e1b]"
              ></motion.div>
            </div>
          </div>
          
          {/* النماذج */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.form 
                key="email-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmitEmail}
                className="mt-8 space-y-6"
              >
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 text-right">
                    البريد الإلكتروني
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fa9e1b] focus:border-[#fa9e1b] focus:z-10 sm:text-sm"
                      placeholder="أدخل بريدك الإلكتروني"
                      dir="rtl"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#31124b] hover:bg-[#31124b]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#fa9e1b]"
                  >
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#fa9e1b] group-hover:text-[#fa9e1b]/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                    إرسال رمز التحقق
                  </motion.button>
                </div>
                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={() => setStep(1)}
                    className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#fa9e1b]"
                  >
                    <span className="absolute right-0 inset-y-0 flex items-center pr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </span>
                    العودة
                  </motion.button>
              </motion.form>
            )}
            
            {step === 2 && (
              <motion.form 
                key="otp-form"
                initial={{ opacity: 0, x: step === 3 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: step === 1 ? 20 : -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={verifyOtp}
                className="mt-8 space-y-6"
              >
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600">
                    تم إرسال رمز التحقق إلى
                  </p>
                  <p className="font-medium text-[#31124b]">{email}</p>
                </div>
                
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-4 text-center">
                    أدخل رمز التحقق المكون من 4 أرقام
                  </label>
                  <div className="flex justify-center gap-3 mb-6">
                    {[0, 1, 2, 3].map((index) => (
                      <motion.input
                        key={index}
                        ref={inputRefs[index]}
                        type="text"
                        maxLength={1}
                        value={otp[index]}
                        onChange={(e) => handleOtpChange(index, e)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-14 h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fa9e1b] focus:border-[#fa9e1b]"
                        whileFocus={{ scale: 1.05 }}
                        initial={{ scale: 1 }}
                        animate={{ 
                          scale: otp[index] ? [1, 1.1, 1] : 1,
                          borderColor: otp[index] ? ['#d1d5db', '#fa9e1b', '#d1d5db'] : '#d1d5db'
                        }}
                        transition={{ duration: 0.3 }}
                      />
                    ))}
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-500">
                      لم تستلم الرمز؟{' '}
                      <button
                        type="button"
                        onClick={resendOtp}
                        className={`font-medium ${timer === 0 ? 'text-[#fa9e1b] hover:text-[#fa9e1b]/80' : 'text-gray-400 cursor-not-allowed'}`}
                        disabled={timer > 0}
                      >
                        إعادة الإرسال
                      </button>
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {timer > 0 ? `يمكنك إعادة الإرسال بعد ${formatTime(timer)}` : 'يمكنك إعادة إرسال الرمز الآن'}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#31124b] hover:bg-[#31124b]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#fa9e1b]"
                  >
                    تحقق من الرمز
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={() => setStep(1)}
                    className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#fa9e1b]"
                  >
                    <span className="absolute right-0 inset-y-0 flex items-center pr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </span>
                    العودة
                  </motion.button>
                </div>
              </motion.form>
            )}
            
            {step === 3 && (
              <motion.form 
                key="new-password-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleResetPassword}
                className="mt-8 space-y-6"
              >
                <div>
                  <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1 text-right">
                    كلمة المرور الجديدة
                  </label>
                  <div className="relative">
                    <input
                      id="new-password"
                      name="new-password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fa9e1b] focus:border-[#fa9e1b] focus:z-10 sm:text-sm"
                      placeholder="أدخل كلمة المرور الجديدة"
                      dir="rtl"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* مؤشر قوة كلمة المرور */}
                  {password && (
                    <div className="mt-2">
                      <div className="flex justify-between mb-1">
                        <div className="text-xs text-gray-500">
                          {passwordStrength <= 25 && 'ضعيفة جداً'}
                          {passwordStrength > 25 && passwordStrength <= 50 && 'ضعيفة'}
                          {passwordStrength > 50 && passwordStrength <= 75 && 'متوسطة'}
                          {passwordStrength > 75 && 'قوية'}
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <motion.div 
                          className={`h-1.5 rounded-full ${getPasswordStrengthColor()}`}
                          initial={{ width: '0%' }}
                          animate={{ width: `${passwordStrength}%` }}
                          transition={{ duration: 0.3 }}
                        ></motion.div>
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل وتتضمن أرقام وأحرف صغيرة وكبيرة
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1 text-right">
                    تأكيد كلمة المرور
                  </label>
                  <div className="relative">
                    <input
                      id="confirm-password"
                      name="confirm-password"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fa9e1b] focus:border-[#fa9e1b] focus:z-10 sm:text-sm"
                      placeholder="أعد إدخال كلمة المرور الجديدة"
                      dir="rtl"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* رسالة عدم تطابق كلمتي المرور */}
                  {confirmPassword && password !== confirmPassword && (
                    <div className="mt-1 text-xs text-red-500">
                      كلمتا المرور غير متطابقتين
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#31124b] hover:bg-[#31124b]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#fa9e1b]"
                  >
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#fa9e1b] group-hover:text-[#fa9e1b]/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    تغيير كلمة المرور
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={() => setStep(2)}
                    className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#fa9e1b]"
                  >
                    <span className="absolute right-0 inset-y-0 flex items-center pr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </span>
                    العودة
                  </motion.button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
          
          {/* زخرفة أسفل البطاقة */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at bottom center, #fa9e1b 0%, transparent 70%)',
            }}
          />
         </motion.div>
        
        {/* رابط العودة لصفحة تسجيل الدخول */}
        {/* <div className="mt-8 text-center text-sm">
          <a href="/login" className="font-medium text-[#31124b] hover:text-[#fa9e1b] transition-colors duration-300">
            العودة إلى صفحة تسجيل الدخول
          </a>
        </div> */}
      </div>
    </>
  );
}