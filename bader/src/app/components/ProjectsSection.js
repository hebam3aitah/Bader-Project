import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiClock, FiMapPin, FiShare2 } from "react-icons/fi";
import Link from "next/link";
import axios from "axios";

const PLACEHOLDER = "/placeholder.png";

export default function ProjectsSection() {
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  const truncateText = (text, maxLength = 60) => {
    if (text && text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  const calculateProgress = (project) => {
    if (!project.donationTarget || project.donationTarget === 0) return 0;
    const progress = (project.donations / project.donationTarget) * 100;
    return Math.min(progress, 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return "bg-green-500";
    if (percentage >= 75) return "bg-yellow-500";
    if (percentage >= 50) return "bg-yellow-500";
    if (percentage >= 25) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getBadgeColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "planning":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getProjectStatus = (status) => {
    switch (status) {
      case "completed":
        return "مكتمل";
      case "in-progress":
        return "قيد التنفيذ";
      case "planning":
        return "قيد التخطيط";
      default:
        return "غير محدد";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectsRes = await axios.get("/api/projects/Home");
        if (projectsRes.data) {
          if (Array.isArray(projectsRes.data)) {
            setProjects(projectsRes.data);
          } else if (
            projectsRes.data.data &&
            Array.isArray(projectsRes.data.data)
          ) {
            setProjects(projectsRes.data.data);
          } else if (
            projectsRes.data.projects &&
            Array.isArray(projectsRes.data.projects)
          ) {
            setProjects(projectsRes.data.projects);
          } else {
            console.error("Unexpected data format:", projectsRes.data);
            setProjects([]);
          }
        } else {
          setProjects([]);
        }
        setLoadingProjects(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoadingProjects(false);
        setProjects([]);
      }
    };
    fetchData();
  }, []);

  if (loadingProjects) {
    return <div className="text-center py-10">جاري تحميل المشاريع...</div>;
  }

  const projectsArray = Array.isArray(projects) ? projects : [];

  return (
    <section className="py-12 bg-white">
      <div className="text-center mb-16">
        <h1 className="text-4xl mb-18 font-bold text-[#31124b] inline-block relative">
          أحدث مشاريعنا
        </h1>
        {projectsArray.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 mx-20 lg:grid-cols-4 gap-6">
            {projectsArray.map((project) => {
              const progressPercentage = Math.round(calculateProgress(project));
              const status = getProjectStatus(project.status);
              return (
                <div
                  key={project._id}
                  className={`bg-white rounded-2xl overflow-hidden shadow-[#31124b] shadow-2xl hover:shadow-xl transition-shadow duration-300 flex flex-col ${
                    progressPercentage === 100 ? "ring-2 ring-green-500" : ""
                  }`}
                >
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={
                        project.images[0] || "/images/project-placeholder.jpg"
                      }
                      alt={project.title}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-0 right-0 m-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getBadgeColor(
                          project.status
                        )}`}
                      >
                        {status}
                      </span>
                    </div>
                    {progressPercentage === 100 && (
                      <div className="absolute top-0 left-0 m-3 bg-green-600 text-white text-xs px-3 py-1 rounded-full shadow-md">
                        تم تمويل المشروع
                      </div>
                    )}
                    <div className="absolute bg-[#ffffff85] bottom-0 right-0 m-3 px-1 py-1 rounded-lg flex items-center">
                      <button
                        onClick={() =>
                          navigator.share?.({
                            title: project.title,
                            url: window.location.href,
                          })
                        }
                        className="text-sm text-[#31124b] underline hover:text-[#fa9e1b] mt-2 flex items-center gap-1 mx-auto"
                      >
                        <FiShare2 /> شارك المشروع
                      </button>
                    </div>
                  </div>

                  <div className="p-5 flex-grow justify-between flex flex-col">
                    <div>
                      <h3 className="text-xl font-bold text-[#31124b] mb-2 line-clamp-1/2">
                        {project.title}
                      </h3>

                      <p className="text-gray-600 mb-2 flex-grow line-clamp-1/2">
                        {truncateText(project.description)}
                      </p>
                    </div>

                    <div>
                      {/* Progress Bar */}
                      {project.donationTarget > 0 ? (
                        <div className="mt-2 mb-4">
                          <div className="flex justify-between items-center text-sm mb-1">
                            <span className="font-medium">نسبة التمويل</span>
                            <span className="font-bold py-0.5 px-2 bg-gray-100 rounded-full text-gray-800">
                              {progressPercentage}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${progressPercentage}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className={`h-full ${getProgressColor(
                                progressPercentage
                              )}`}
                            ></motion.div>
                          </div>
                          <div className="flex justify-between text-xs mt-2"></div>
                        </div>
                      ) : null}
                      <div className="mt-auto">
                        <Link
                          href={`/projects/${project._id}`}
                          className="bg-white border border-[#31124b] text-[#31124b] py-2 px-4 rounded-lg flex justify-center items-center gap-2 hover:bg-[#31124b] hover:text-white transition-colors duration-300 w-full mb-2"
                        >
                          تفاصيل المشروع
                        </Link>

                        {project.status === "in-progress" ? (
                          <div className="flex gap-2 w-full">
                            {project.donations < project.donationTarget && (
                              <Link
                                href={`/DonatePage?projectId=${project._id}`}
                                className="bg-[#fa9e1b] hover:bg-[#e08c0e] text-white py-2 px-4 rounded-lg flex justify-center items-center gap-2 transition-colors duration-300 flex-1"
                              >
                                تبرع الآن
                              </Link>
                            )}

                            {project.volunteers &&
                              project.volunteerCount &&
                              project.volunteers.length <
                                project.volunteerCount && (
                                <Link
                                  href={`/volunteer?project_id=${project._id}`}
                                  className="bg-[#31124b] hover:bg-[#2a0f40] text-white py-2 px-4 rounded-lg flex justify-center items-center gap-2 transition-colors duration-300 flex-1"
                                >
                                  تطوع معنا
                                </Link>
                              )}
                          </div>
                        ) : (
                          <p className="text-[#31124b] py-2 px-4 rounded-lg flex justify-center items-center gap-2 transition-colors duration-300 flex-1">
                            تم جمع التبرعات والمتطوعين
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10">لا توجد مشاريع حالياً</div>
        )}
      </div>
    </section>
  );
}
