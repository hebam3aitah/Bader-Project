"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiAlertTriangle,
  FiPackage,
  FiFileText,
  FiMail,
  FiUsers,
  FiHeart,
  FiMenu,
  FiX,
  FiLogOut,
} from "react-icons/fi";
import Link from "next/link";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "GET" });
      document.cookie = "token=; Max-Age=0; path=/";
      window.location.href = "/";
    } catch (err) {
      console.error("فشل تسجيل الخروج:", err);
    }
  };

  // Check if current route is active
  const isActive = (path) => {
    return pathname === path;
  };

  // Handle window resize to detect mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    handleResize(); // Set initial state
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Navigation items with icons
  const navItems = [
    {
      path: "/dashboard",
      label: "الإحصائيات",
      icon: <FiHome className="ml-2" />,
    },
    {
      path: "/dashboard/issues",
      label: "إدارة البلاغات",
      icon: <FiAlertTriangle className="ml-2" />,
    },
    {
      path: "/dashboard/projects",
      label: "إدارة المشاريع",
      icon: <FiPackage className="ml-2" />,
    },
    {
      path: "/dashboard/VolunteerRequestsPage",
      label: "إدارة طلبات التطوع",
      icon: <FiHeart className="ml-2" />,
    },
    {
      path: "/dashboard/users",
      label: "إدارة المستخدمين",
      icon: <FiUsers className="ml-2" />,
    },
    {
      path: "/dashboard/SupportRequestsPage",
      label: "إدارة الداعمين",
      icon: <FiFileText className="ml-2" />,
    },
    {
      path: "/dashboard/AdminMessagesPage",
      label: "إدارة المسجات",
      icon: <FiMail className="ml-2" />,
    },
    {
      path: "/dashboard/AdminDonation",
      label: "إدارة التبرعات",
      icon: <FiHeart className="ml-2" />,
    },
  ];

  return (
    <div dir="rtl" className="flex flex-col md:flex-row min-h-screen">
      {/* Mobile Menu Button */}
      <div className="md:hidden bg-[#31124b] p-4 flex justify-between items-center fixed top-0 right-0 left-0 z-20">
        <h2 className="text-xl font-bold text-white">لوحة التحكم</h2>
        <button
          onClick={toggleMobileMenu}
          className="text-white focus:outline-none"
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Sidebar - Desktop (always visible) and Mobile (conditionally visible) */}
      <aside
        className={`
          ${mobileMenuOpen ? "block" : "hidden"} 
          md:block w-full md:w-64 bg-[#31124b] text-white p-6
          fixed top-0 md:top-0 right-0 left-auto md:left-auto bottom-0 z-10
          overflow-y-auto md:overflow-y-hidden
        `}
      >
        {/* Logo Area */}
        <div className="flex justify-center items-center mb-8 h-20">
          <div className="w-32 h-16 rounded flex items-center justify-center">
            <Link href="/" className="flex items-center ml-2 gap-1">
              <img src="/images/logo3.png" alt="بادر" className="h-15 w-auto" />
            </Link>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-6 text-center">لوحة التحكم</h2>

        <div className="flex flex-col h-[calc(100vh-200px)]">
          {/* Navigation Menu */}
          <div className="flex-1">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`flex items-center p-2 rounded-lg transition-colors duration-200 hover:bg-[#3c1a5b] ${
                      isActive(item.path)
                        ? "bg-[#3c1a5b] text-[#fa9e1b]"
                        : "text-white hover:text-[#fa9e1b]"
                    }`}
                    onClick={() => isMobile && setMobileMenuOpen(false)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Logout Button */}
          <div className="mt-auto pt-4 border-t border-gray-700">
            <button
              onClick={() => {
                handleLogout();
              }}
              className="flex items-center w-full p-2 rounded-lg text-white hover:bg-[#3c1a5b] hover:text-[#fa9e1b] transition-colors duration-200"
            >
              <FiLogOut className="ml-2" />
              <span>تسجيل خروج</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Page content */}
      <main className="flex-1 p-4 md:p-6 bg-gray-50 md:mr-64">
        <div className="container mt-20 md:mt-5  mx-auto">{children}</div>
      </main>
    </div>
  );
}
