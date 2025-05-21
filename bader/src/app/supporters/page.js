"use client";

import { useState, useEffect } from "react";
import { MdVolunteerActivism } from "react-icons/md";
import Link from "next/link";
import axios from 'axios';

import {
  ChevronUp,
  ChevronDown,
  ExternalLink,
  Heart,
  Award,
  Users,
  X
} from "lucide-react";
import { motion } from "framer-motion";

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [showMore, setShowMore] = useState(false);
  const [selectedSponsor, setSelectedSponsor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: "reverse",
    },
  };
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };
  
  const sponsorCategories = [
    { id: "all", name: "جميع الجهات" },
    { id: "governmental", name: "جهات حكومية" },
    { id: "companies", name: "شركات خاصة" },
    { id: "ngos", name: "مؤسسات غير ربحية" },
  ];

  useEffect(() => {
    const fetchSponsors = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get("/api/organizations");
        setSponsors(res.data);
      } catch (error) {
        console.error("فشل في تحميل الجهات الداعمة", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSponsors();
  }, []);

  const filteredSponsors =
    activeCategory === "all"
      ? sponsors
      : sponsors.filter((sponsor) => sponsor.category === activeCategory);

  const featuredSponsors = sponsors.filter(sponsor => sponsor.featured);
  
  const displayedSponsors = showMore
    ? filteredSponsors
    : filteredSponsors.slice(0, 6);

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-gray-100 to-white overflow-hidden"
      dir="rtl"
    >
      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 text-center pb-12">
        {/* القسم الرئيسي مع تأثيرات حركية */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center mb-24 relative"
        >
          <div className="text-center">
            <div className="inline-block p-3 rounded-full bg-[#fa9e1b] bg-opacity-10 mb-4">
              <MdVolunteerActivism size={32} className="text-white" />
            </div>
          </div>
               <h1 className="text-5xl font-bold mb-4 text-[#31124b]">
            الجهات الداعمة
          </h1>

                    <p className="mt-6 text-xl text-[#31124b] font-medium">
            نفخر بشراكتنا مع مجموعة من المؤسسات والجهات الداعمة لمبادرتنا
          </p>
                   
          <motion.div
            animate={floatingAnimation}
            className="absolute -z-10 top-10 left-20 w-64 h-64 rounded-full bg-[#fa9e1b] opacity-5 blur-3xl"
          ></motion.div>
          <motion.div
            animate={floatingAnimation}
            className="absolute -z-10 bottom-0 right-40 w-80 h-80 rounded-full bg-[#31124b] opacity-5 blur-3xl"
          ></motion.div>
        </motion.div>

     

        {/* Category Filter */}
        <section dir="rtl" className="mb-12 ">
          <div className="flex flex-wrap ml justify-center gap-3">
            {sponsorCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-2 rounded-full text-lg transition-colors duration-300 ${
                  activeCategory === category.id
                    ? "bg-[#31124b] text-white"
                    : "bg-gray-200 text-[#31124b] hover:bg-[#fa9e1b] hover:bg-opacity-20"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </section>

        {/* All Sponsors */}
        <section>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#fa9e1b]"></div>
            </div>
          ) : (
            <>
              <div dir="rtl" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedSponsors.length > 0 ? (
                  displayedSponsors.map((sponsor) => (
                    <div
                      key={sponsor._id}
                      className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-300 overflow-hidden group cursor-pointer"
                      onClick={() => setSelectedSponsor(sponsor)}
                    >
                      <div className="h-2 bg-gradient-to-r from-[#31124b] to-[#31124b]"></div>
                      <div className="p-6">
                        <div className="flex items-center mb-4">
                          <div className="bg-purple-55 p-2 rounded-full">
                            <img
                              src={sponsor.logo || "/api/placeholder/48/48"}
                              alt={sponsor.name}
                              className="w-12 h-12 object-contain"
                            />
                          </div>
                          <h3 className="text-lg font-bold text-[#31124b] mr-4 rtl:mr-0 rtl:ml-4">
                            {sponsor.name}
                          </h3>
                        </div>
                        <p className="text-[#31124b] text-l">
                          {sponsor.message || sponsor.description || "الراعي الرسمي لفعالياتنا ومبادراتنا"}
                        </p>
                        <div className="mt-4 flex justify-between items-center">
                          <span className="text-xs font-medium px-3 py-1 bg-[#fa9e1b] bg-opacity-10 text-[#31124b] rounded-full">
                            {
                              sponsorCategories.find(
                                (cat) => cat.id === sponsor.category
                              )?.name || "جهة داعمة"
                            }
                          </span>
                     
                        </div>
                        
                      </div>
                          <button
                      onClick={() => setSelectedSponsor(sponsor)}
                      className="w-50  mb-4 py-2 bg-gradient-to-r from-[#31124b] to-[#31124b] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                    >
                      عرض التفاصيل
                    </button>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 text-center p-8 bg-white bg-opacity-50 rounded-lg">
                    <p className="text-gray-500">لا يوجد رعاة في هذه الفئة</p>
                  </div>
                )}
              </div>

              {filteredSponsors.length > 6 && (
                <div className="mt-8 text-center">
                  <button
                    onClick={() => setShowMore(!showMore)}
                    className="inline-flex items-center px-6 py-3 bg-[#fa9e1b] hover:bg-opacity-90 text-white rounded-md transition-colors duration-300 shadow"
                  >
                    <span>{showMore ? "عرض أقل" : "عرض المزيد"}</span>
                    {showMore ? (
                      <ChevronUp className="mr-2 w-4 h-4 rtl:mr-0 rtl:ml-2" />
                    ) : (
                      <ChevronDown className="mr-2 w-4 h-4 rtl:mr-0 rtl:ml-2" />
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        {/* Call to Action */}
        <section className="mt-20 text-center">
          <div className="bg-gradient-to-r from-[#31124b] to-[#411866] rounded-2xl p-8 shadow-xl border border-white border-opacity-10">
            <Heart className="text-[#fa9e1b] w-12 h-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">
              هل ترغب في دعم مبادرتنا؟
            </h2>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              نرحب بالشراكات الجديدة مع المؤسسات والشركات والجهات الحكومية
              الراغبة في المساهمة في تطوير الأحياء والمجتمعات المحلية
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/DonatePage"
                className="bg-[#fa9e1b] hover:bg-opacity-90 px-8 py-4 rounded-lg transition-colors font-bold text-lg inline-block text-white"
              >
                <button className="flex items-center">
                  <Users className="ml-2 w-5 h-5" />
                  <span>تبرع الآن</span>
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* نافذة التفاصيل المنبثقة */}
      {selectedSponsor && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 overflow-y-auto"
          onClick={() => setSelectedSponsor(null)}
          dir="rtl"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 25 }}
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-2 bg-gradient-to-r from-[#31124b] to-[#fa9e1b] absolute top-0 left-0 right-0"></div>
            
            <button
              onClick={() => setSelectedSponsor(null)}
              className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col md:flex-row gap-6 items-start mt-6">
              <div className="w-full md:w-1/3 rounded-xl p-4 flex items-center justify-center">
                <img
                  src={selectedSponsor.logo || "/api/placeholder/150/150"}
                  alt={selectedSponsor.name}
                  className="w-32 h-32 object-contain"
                />
              </div>
              
              <div className="w-full md:w-2/3">
                <h3 className="text-2xl font-bold text-[#31124b] mb-4">
                  {selectedSponsor.name}
                </h3>
                
                <div className="mb-4">
                  <span className="inline-block bg-[#fa9e1b] bg-opacity-10 text-[#31124b] text-sm px-3 py-1 rounded-full mr-2">
                    {
                      sponsorCategories.find(
                        (cat) => cat.id === selectedSponsor.category
                      )?.name || "جهة داعمة"
                    }
                  </span>
                  {selectedSponsor.featured && (
                    <span className="inline-block bg-purple-100 text-[#31124b] text-sm px-3 py-1 rounded-full">
                      راعي رئيسي
                    </span>
                  )}
                </div>
                
                <div className="space-y-4 text-[#31124b]">
                  <p className="leading-relaxed">
                    {selectedSponsor.message || selectedSponsor.description || "الراعي الرسمي لفعالياتنا ومبادراتنا"}
                  </p>
                  
                  {selectedSponsor.supportType && (
                    <div className="pt-2">
                      <p className=" text-[#31124b] mb-1">نوع الدعم:</p>
                      <p className="font-medium">{selectedSponsor.supportType}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>


            {/* معلومات التواصل */}
            {(selectedSponsor.website || selectedSponsor.email || selectedSponsor.phone) && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-lg font-semibold mb-4 text-[#31124b] ">معلومات التواصل</h4>
                <div className="flex flex-wrap gap-3">
                 
                  
                  {selectedSponsor.email && (
                    <a 
                      href={`mailto:${selectedSponsor.email}`} 
                      className="flex items-center px-4 py-2 bg-gray-100  text-[#31124b] hover:bg-gray-200 rounded-full"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2  text-[#31124b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      البريد الإلكتروني
                    </a>
                  )}
                  
                  {selectedSponsor.phone && (
                    <a 
                      href={`tel:${selectedSponsor.phone}`} 
                      className=" text-[#31124b] flex items-center px-4 py-2  bg-gray-100 hover:bg-gray-200 rounded-full"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      الاتصال
                    </a>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}