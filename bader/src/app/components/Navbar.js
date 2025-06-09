"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut, Bell, User, ChevronDown } from "lucide-react";

const navItems = [
  { title: "الرئيسية", href: "/" },
  { title: "الإبلاغ عن مشكلة", href: "/report-issue" },
  { title: "المشاريع", href: "/projects" },
  { title: "التسجيل كمتطوع", href: "/volunteer" },
  { title: "كن داعماً", href: "/supportFile" },
  { title: "تبرع الآن", href: "/DonatePage" },
  { title: "من نحن", href: "/about" },
  { title: "اتصل بنا", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const isHiddenPage = pathname === "/login" || pathname === "/register";

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "GET" });
      document.cookie = "token=; Max-Age=0; path=/";
      setCurrentUser(null);
    } catch (err) {
      console.error("فشل تسجيل الخروج:", err);
    }
  };

  useEffect(() => {
    setMounted(true);

    const getUserData = async () => {
      try {
        const res = await fetch("/api/current-user");
        if (!res.ok) {
          setCurrentUser(null);
          return;
        }
        const data = await res.json();
        setCurrentUser(data);
      } catch (error) {
        console.error("خطأ في جلب بيانات المستخدم:", error);
        setCurrentUser(null);
      }
    };

    getUserData();

    // إغلاق قائمة الملف الشخصي عند النقر خارجها
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!mounted || isHiddenPage) return null;

  return (
    <header className="sticky top-0 z-50 w-full bg-[#31124b] shadow-md">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" dir="rtl">
        <div className="flex h-18 items-center justify-between">
          {/* الشعار والاسم */}
          <Link href="/" className="flex items-center ml-2 gap-1">
            <img src="/images/logo3.png" alt="بادر" className="h-15 w-auto" />
          </Link>

          {/* القائمة الرئيسية للشاشات المتوسطة والكبيرة */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2 space-x-reverse">
            {navItems.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md font-medium text-sm lg:text-base transition-colors ${
                  pathname === link.href
                    ? "bg-[#fa9e1b] text-[#31124b] font-bold"
                    : "text-white hover:text-[#fa9e1b] hover:bg-[#41225b]"
                }`}
              >
                {link.title}
              </Link>
            ))}
          </div>

          {/* قسم الإشعارات وبيانات المستخدم */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <>
                {/* قائمة الملف الشخصي */}
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center gap-2 text-white hover:bg-[#41225b] px-3 py-2 rounded-md transition-colors"
                  >
                    <div className="h-9 w-9 rounded-full bg-[#fa9e1b] text-[#31124b] flex items-center justify-center font-bold text-lg shadow-sm">
                      {currentUser?.name?.charAt(0) || "م"}
                    </div>
                    <span className="text-sm font-medium hidden lg:block">
                      {currentUser.name}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        profileMenuOpen ? "transform rotate-180" : ""
                      }`}
                    />
                  </button>

                  {profileMenuOpen && (
                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <div className="flex items-center gap-2">
                          <User size={16} />
                          <span>الملف الشخصي</span>
                        </div>
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setProfileMenuOpen(false);
                        }}
                        className="block w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        <div className="flex items-center gap-2">
                          <LogOut size={16} />
                          <span>تسجيل خروج</span>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                href="/login"
                className="text-[#31124b] bg-[#fa9e1b] hover:bg-[#ffb848] font-medium px-4 py-2 rounded-md transition-colors shadow-sm"
              >
                تسجيل الدخول
              </Link>
            )}
          </div>

          {/* زر القائمة للشاشات الصغيرة */}
          <div className="md:hidden flex items-center gap-3">
          
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white p-2 rounded-md hover:bg-[#41225b]"
              aria-label="فتح القائمة"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* القائمة المنسدلة للشاشات الصغيرة */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg max-h-[80vh] overflow-y-auto">
          <div className="flex flex-col p-4 space-y-2">
            {navItems.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-3 rounded-md text-base font-medium ${
                  pathname === link.href
                    ? "bg-[#fa9e1b] text-[#31124b]"
                    : "text-[#31124b] hover:bg-[#f5f5f5]"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.title}
              </Link>
            ))}

       

            <div className="border-t border-gray-200 my-2 pt-2">
              {currentUser ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 p-2">
                    <div className="h-10 w-10 rounded-full bg-[#fa9e1b] text-[#31124b] flex items-center justify-center font-bold text-lg">
                      {currentUser?.name?.charAt(0) || "م"}
                    </div>
                    <div className="text-base font-medium text-[#31124b]">
                      {currentUser.name}
                    </div>
                  </div>
                  <Link
                    href="/profile"
                    className="px-4 py-3 bg-gray-100 text-[#31124b] rounded-md text-base font-medium flex items-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User size={18} /> الملف الشخصي
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-3 bg-red-50 text-red-600 rounded-md text-base font-medium flex items-center justify-center gap-2"
                  >
                    <LogOut size={18} /> تسجيل خروج
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="px-4 py-3 bg-[#fa9e1b] text-[#31124b] rounded-md text-base font-bold text-center block"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  تسجيل الدخول
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
