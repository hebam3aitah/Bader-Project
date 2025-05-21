import { useState, useEffect } from "react";
import {
  FiUsers,
  FiSun,
  FiTrash2,
  FiDroplet,
  FiSlash,
  FiGlobe,
  FiAlertTriangle,
} from "react-icons/fi";

// Add custom animations to Tailwind
const style = `
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}
@keyframes float-slow {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
}
@keyframes gradient-x {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.animate-float {
  animation: float 6s ease-in-out infinite;
}
.animate-float-slow {
  animation: float-slow 8s ease-in-out infinite;
}
.animate-gradient-x {
  animation: gradient-x 15s ease infinite;
  background-size: 200% 200%;
}
`;

// This component receives the project data as a prop
export default function ProjectHeader({ project }) {
  const [isGlowing, setIsGlowing] = useState(false);

  // Extract the category from the project data
  const category = project?.category?.name || "إنارة الشوارع";
  const status = project?.status || "in-progress";

  // Animation effect for pulsing glow
  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlowing((prev) => !prev);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Get the appropriate icon based on category
  const getCategoryIcon = (category) => {
    switch (category) {
      case "إنارة الشوارع":
        return (
          <FiSun
            size={48}
            className={`text-[#fa9e1b] transition-all duration-1000 ${
              isGlowing ? "drop-shadow-[0_0_8px_#fa9e1b]" : ""
            }`}
          />
        );
      case "تراكم النفايات":
        return (
          <FiTrash2
            size={48}
            className={`text-[#fa9e1b] transition-all duration-1000 ${
              isGlowing ? "drop-shadow-[0_0_8px_#fa9e1b]" : ""
            }`}
          />
        );
      case "مشاكل الصرف الصحي":
        return (
          <FiDroplet
            size={48}
            className={`text-[#fa9e1b] transition-all duration-1000 ${
              isGlowing ? "drop-shadow-[0_0_8px_#fa9e1b]" : ""
            }`}
          />
        );
      case "مشاكل الطرق والرصيف":
        return (
          <FiSlash
            size={48}
            className={`text-[#fa9e1b] transition-all duration-1000 ${
              isGlowing ? "drop-shadow-[0_0_8px_#fa9e1b]" : ""
            }`}
          />
        );
      case "حدائق ومساحات عامة":
        return (
          <FiGlobe
            size={48}
            className={`text-[#fa9e1b] transition-all duration-1000 ${
              isGlowing ? "drop-shadow-[0_0_8px_#fa9e1b]" : ""
            }`}
          />
        );
      case "تلوث بيئي":
        return (
          <FiGlobe
            size={48}
            className={`text-[#fa9e1b] transition-all duration-1000 ${
              isGlowing ? "drop-shadow-[0_0_8px_#fa9e1b]" : ""
            }`}
          />
        );
      default:
        return (
          <FiAlertTriangle
            size={48}
            className={`text-[#fa9e1b] transition-all duration-1000 ${
              isGlowing ? "drop-shadow-[0_0_8px_#fa9e1b]" : ""
            }`}
          />
        );
    }
  };

  // Format status text in Arabic
  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return "مكتمل";
      case "in-progress":
        return "قيد التنفيذ";
      case "planning":
        return "في مرحلة التخطيط";
      case "on-hold":
        return "معلق";
      default:
        return "قيد التنفيذ";
    }
  };

  return (
    <div className="w-full py-8 flex flex-col items-center justify-center   rounded-lg relative overflow-hidden group hover:shadow-lg transition-all duration-300">
      {/* Animated border effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-[#31124b] via-yellow-500 to-[#31124b] opacity-20 group-hover:opacity-30 blur-md transition-all duration-700 animate-gradient-x"></div>

      {/* Decorative circles */}
      <div className="absolute w-16 h-16 rounded-full border border-[#fa9e1b]/30 top-4 right-8 animate-float-slow"></div>
      <div className="absolute w-12 h-12 rounded-full border border-[#fa9e1b]/20 bottom-4 left-8 animate-float"></div>

      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center p-4">
        <div className="mb-4">{getCategoryIcon(category)}</div>

        <h1 className="text-4xl font-bold text-[#31124b] mb-2">
          {project?.title || "الإبلاغ عن مشكلة"}
        </h1>

        <div className="text-lg text-gray-600 mb-6">
          ساعدنا في تحسين الحي من خلال الإبلاغ عن المشاكل التي تواجهك
        </div>

        {/* Status badge - centered */}
        <div className="bg-[#fa9e1b] text-[#31124b] px-4 py-1 rounded-full font-bold text-sm">
          {getStatusText(status)}
        </div>
      </div>

      {/* Optional: Project stats (can be hidden if not needed) */}
      {project && (
        <div className="flex items-center gap-4 mt-6 text-gray-700 relative z-10">
          <div className="flex items-center">
            <FiUsers className="ml-1" />
            <span>{project.volunteerCount || 0} متطوع</span>
          </div>

          {/* Only show donation if there's a target */}
          {project.donationTarget &&
          project.donationTarget > 0 &&
          project.donationTarget - (project?.donations || 0) > 0 ? (
            <div className="flex items-center">
              <span>
                {project.donationTarget - (project?.donations || 0)} دينار أردني
              </span>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
