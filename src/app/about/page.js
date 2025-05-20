"use client";

import Head from "next/head";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FaSpinner,
  FaUser,
  FaFacebookF,
  FaWhatsapp,
  FaTwitter,
  FaLinkedinIn,
  FaUsers,
} from "react-icons/fa";
import Link from "next/link";

// Animation variants
const animations = {
  fadeInUp: {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  },
  staggerChildren: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  },
  floatingAnimation: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: "reverse",
    },
  },
};

// Counter component
const Counter = ({ end, suffix = "", className }) => {
  const [count, setCount] = useState(0);
  const counterRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let startTime;
          const duration = 1500;

          const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const currentCount = Math.floor(progress * end);
            setCount(currentCount);

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );

    if (counterRef.current) observer.observe(counterRef.current);

    return () => {
      if (counterRef.current) observer.unobserve(counterRef.current);
    };
  }, [end]);

  return (
    <div ref={counterRef} className={className}>
      {count}
      {suffix}
    </div>
  );
};

export default function About() {
  const [activeTab, setActiveTab] = useState("vision");
  const [isScrolled, setIsScrolled] = useState(false);

  // Refs for sections
  const teamRef = useRef(null);
  const achievementsRef = useRef(null);
  const partnersRef = useRef(null);

  // Team data from API
  const [team, setTeam] = useState([]);
  const [loadingTeam, setLoadingTeam] = useState(true);

  // Stats data from API
  const [stats, setStats] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);

  // Partners data from API
  const [partners, setPartners] = useState([]);
  const [loadingPartners, setLoadingPartners] = useState(true);

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch team data
        const teamRes = await axios.get("/api/about/team");
        setTeam(teamRes.data);
        setLoadingTeam(false);

        // Fetch stats data
        const statsRes = await axios.get("/api/about/stats");
        setStats(statsRes.data);
        setLoadingStats(false);

        // Fetch partners data
        const partnersRes = await axios.get("/api/about/support");
        setPartners(partnersRes.data);
        setLoadingPartners(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoadingTeam(false);
        setLoadingStats(false);
        setLoadingPartners(false);
      }
    };

    fetchData();
  }, []);

  // Scroll animations
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const observerOptions = {
      threshold: 0.2,
      rootMargin: "0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in");
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll(".observe-section");
    sections.forEach((section) => {
      observer.observe(section);
    });

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white overflow-hidden"
      dir="rtl"
    >
      <Head>
        <title>من نحن | بادر - مبادرة إصلاح الحي</title>
        <meta
          name="description"
          content="تعرف على مبادرة بادر التطوعية لإصلاح مشاكل الحي وتحسين المجتمع"
        />
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
          rel="stylesheet"
        />
      </Head>

      <main className="container mx-auto px-4 pt-18 pb-16">
        {/* Hero Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={animations.fadeInUp}
          className="text-center mb-28 relative"
        >
          <div className="text-center">
            <div className="inline-block p-4 rounded-full bg-[#fa9e1b] bg-opacity-10 mb-5">
              <FaUsers size={36} className="text-[#fff7eb]" />
            </div>
          </div>

          <h1 className="text-5xl font-bold text-[#31124b] mb-6 relative inline-block">
            من نحن
          </h1>

          <p className="mt-8 text-xl text-[#31124b] font-medium max-w-3xl mx-auto">
            مبادرة بادر هي مشروع تطوعي يهدف إلى إصلاح مشاكل الحي وتحسين جودة
            الحياة للجميع
          </p>

          {/* Decorative elements */}
          <motion.div
            animate={animations.floatingAnimation}
            className="absolute -z-10 top-10 left-20 w-72 h-72 rounded-full bg-[#fa9e1b] opacity-5 blur-3xl"
          />
          <motion.div
            animate={animations.floatingAnimation}
            className="absolute -z-10 bottom-0 right-40 w-96 h-96 rounded-full bg-[#31124b] opacity-5 blur-3xl"
          />
        </motion.div>

        {/* Vision, Mission, Values Section */}
        <div className="mb-28 observe-section">
          <div className="bg-white rounded-3xl shadow-xl p-8 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-[#fa9e1b] opacity-10 rounded-full -translate-x-20 -translate-y-20" />
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-[#31124b] opacity-10 rounded-full translate-x-20 translate-y-20" />

            {/* Tabs */}
            <div className="flex flex-wrap justify-center gap-5 mb-12">
              {[
                { id: "vision", icon: "eye", label: "رؤيتنا" },
                { id: "mission", icon: "rocket", label: "رسالتنا" },
                { id: "values", icon: "star", label: "قيمنا" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-8 py-3.5 text-lg font-semibold rounded-full transition-all duration-300 flex items-center ${
                    activeTab === tab.id
                      ? "bg-[#31124b] text-white shadow-lg transform scale-105"
                      : "bg-gray-100 text-gray-600 hover:bg-[#fa9e1b] hover:text-white"
                  }`}
                >
                  <i className={`fas fa-${tab.icon} ml-2.5`}></i>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="min-h-64 p-8">
              {activeTab === "vision" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-xl"
                >
                  <h2 className="text-2xl font-bold text-[#31124b] mb-8 flex items-center">
                    <span className="w-12 h-12 bg-[#fa9e1b] rounded-full flex items-center justify-center text-white ml-4">
                      <i className="fas fa-eye text-lg"></i>
                    </span>
                    رؤيتنا
                  </h2>
                  <p className="text-xl text-gray-700 mb-5 mr-14 border-r-3 border-[#fa9e1b] pr-6 leading-relaxed">
                    نتطلع إلى أحياء نموذجية تنعم بالجودة والاستدامة، حيث يشارك
                    السكان بفعالية في تحديد وحل تحديات مجتمعهم.
                  </p>
                  <p className="text-xl text-gray-700 mr-14 border-r-3 border-[#fa9e1b] pr-6 leading-relaxed">
                    نسعى لبناء نموذج مجتمعي يُحتذى به في المشاركة المدنية
                    والتطوعية، يمكن تطبيقه في مختلف المناطق.
                  </p>
                </motion.div>
              )}

              {activeTab === "mission" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-xl"
                >
                  <h2 className="text-2xl font-bold text-[#31124b] mb-8 flex items-center">
                    <span className="w-12 h-12 bg-[#fa9e1b] rounded-full flex items-center justify-center text-white ml-4">
                      <i className="fas fa-rocket text-lg"></i>
                    </span>
                    رسالتنا
                  </h2>
                  <p className="text-xl text-gray-700 mb-5 mr-14 border-r-3 border-[#fa9e1b] pr-6 leading-relaxed">
                    تمكين سكان الأحياء من تحديد وحل المشكلات المحلية من خلال
                    العمل التطوعي المنظم والمستدام.
                  </p>
                  <p className="text-xl text-gray-700 mr-14 border-r-3 border-[#fa9e1b] pr-6 leading-relaxed">
                    بناء جسور التواصل بين الأهالي والجهات المختصة لتسهيل وتسريع
                    عمليات الإصلاح والتطوير.
                  </p>
                </motion.div>
              )}

              {activeTab === "values" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-xl"
                >
                  <h2 className="text-2xl font-bold text-[#31124b] mb-8 flex items-center">
                    <span className="w-12 h-12 bg-[#fa9e1b] rounded-full flex items-center justify-center text-white ml-4">
                      <i className="fas fa-star text-lg"></i>
                    </span>
                    قيمنا
                  </h2>
                  <motion.ul
                    initial="hidden"
                    animate="visible"
                    variants={animations.staggerChildren}
                    className="text-xl text-gray-700 space-y-5 mr-14"
                  >
                    {[
                      "المبادرة والإيجابية في حل المشكلات",
                      "الشفافية والمساءلة في جميع الأعمال",
                      "التعاون والعمل الجماعي",
                      "الاستدامة في الحلول المقترحة",
                      "احترام التنوع وتقدير مختلف وجهات النظر",
                    ].map((value, index) => (
                      <motion.li
                        key={index}
                        variants={animations.fadeInUp}
                        className="flex items-center"
                      >
                        <span className="w-10 h-10 rounded-full bg-[#fa9e1b] opacity-20 flex items-center justify-center ml-4">
                          <span className="w-5 h-5 rounded-full bg-[#fa9e1b]"></span>
                        </span>
                        <span>{value}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Team Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={animations.fadeInUp}
          className="mb-28 observe-section"
          ref={teamRef}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#31124b] inline-block relative">
              فريقنا
              <div className="h-1.5 w-full bg-[#fa9e1b] absolute -bottom-2 left-0 transform origin-left"></div>
            </h2>
          </div>

          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loadingTeam ? (
              <div className="col-span-3 text-center py-12">
                <div className="inline-block p-3 rounded-full bg-[#fa9e1b] bg-opacity-10 animate-pulse">
                  <FaSpinner className="text-3xl text-[#fff3e2] animate-spin" />
                </div>
                <p className="mt-4 text-xl text-gray-600">
                  جارٍ تحميل الفريق...
                </p>
              </div>
            ) : (
              team.map((member) => (
                <motion.div
                  key={member._id}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 border border-gray-100"
                >
                  {/* Header with image */}
                  <div className="h-60 bg-gradient-to-br from-[#31124b] to-[#7d3cb1] relative overflow-hidden flex items-center justify-center">
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#31124b]/90 via-transparent to-transparent"></div>

                    {/* Circle image with shine effect */}
                    <div className="relative z-10 w-36 h-36 rounded-full border-4 border-[#fa9e1b] overflow-hidden transition-all duration-300 group-hover:border-white group-hover:scale-105 group-hover:shadow-lg">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:brightness-110 transition-all duration-300"
                      />
                      <div className="absolute inset-0 bg-white/10 group-hover:bg-transparent transition-all duration-300"></div>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-[#fa9e1b]/20 blur-lg"></div>
                    <div className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full bg-[#fa9e1b]/10 blur-lg"></div>
                  </div>

                  {/* Content */}
                  <div className="p-6 text-center relative">
                    {/* Icon badge */}
                    <div className="w-12 h-12 bg-gradient-to-br from-[#fa9e1b] to-[#f55d1e] rounded-full flex items-center justify-center text-white absolute -top-6 left-1/2 transform -translate-x-1/2 shadow-lg border-2 border-white">
                      <FaUser className="text-lg" />
                    </div>

                    <h3 className="text-2xl font-bold text-[#31124b] mt-6 mb-2">
                      {member.name}
                    </h3>
                    <p className="text-[#fa9e1b] font-medium mb-4 bg-gradient-to-r from-[#fa9e1b] to-[#f55d1e] bg-clip-text ">
                      {member.role}
                    </p>
                    <p className="text-gray-600 line-clamp-3 mb-6 leading-relaxed">
                      {member.bio}
                    </p>

                    {/* Social links */}
                    <div className="mt-4 flex gap-3 justify-center space-x-4 space-x-reverse">
                      {member.links?.Facebook && (
                        <a
                          href={member.links.Facebook}
                          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[#31124b] hover:bg-[#3b5998] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <FaFacebookF className="text-lg" />
                        </a>
                      )}
                      {member.links?.Whatsapp && (
                        <a
                          href={member.links.Whatsapp}
                          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[#31124b] hover:bg-[#25D366] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <FaWhatsapp className="text-lg" />
                        </a>
                      )}
                      {member.links?.Twitter && (
                        <a
                          href={member.links.Twitter}
                          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[#31124b] hover:bg-[#1DA1F2] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <FaTwitter className="text-sm" />
                        </a>
                      )}
                      {member.links?.LinkedIn && (
                        <a
                          href={member.links.LinkedIn}
                          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[#31124b] hover:bg-[#0077B5] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <FaLinkedinIn className="text-sm" />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </motion.div>

        {/* Achievements Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={animations.fadeInUp}
          className="mb-28 observe-section"
          ref={achievementsRef}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#31124b] inline-block relative">
              إنجازاتنا
              <div className="h-1.5 w-full bg-[#fa9e1b] absolute -bottom-2 left-0 transform origin-left"></div>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {loadingStats ? (
              <div className="col-span-3 text-center py-12">
                <div className="inline-block p-3 rounded-full bg-[#fa9e1b] bg-opacity-10 animate-pulse">
                  <i className="fas fa-spinner fa-spin text-3xl text-[#fa9e1b]"></i>
                </div>
                <p className="mt-4 text-xl text-gray-600">
                  جارٍ تحميل الإنجازات...
                </p>
              </div>
            ) : (
              stats.map(({ icon, title, count, description }, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white p-10 rounded-2xl shadow-lg relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#fa9e1b] opacity-10 rounded-full transform translate-x-12 -translate-y-12"></div>
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#31124b] opacity-10 rounded-full transform -translate-x-16 translate-y-16"></div>

                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-[#31124b] flex items-center justify-center mb-8 transform -rotate-6 shadow-lg">
                      <i
                        className={`fas fa-${icon} text-[#fa9e1b] text-3xl`}
                      ></i>
                    </div>
                    <Counter
                      end={count}
                      suffix="+"
                      className="text-7xl font-bold text-[#31124b]"
                    />
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4 mt-3">
                      {title}
                    </h3>
                    <div className="h-1.5 w-20 bg-[#fa9e1b] mb-5"></div>
                    <p className="text-lg text-gray-600">{description}</p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Partners Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={animations.fadeInUp}
          className="mb-28 observe-section"
          ref={partnersRef}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#31124b] inline-block relative">
              شركاؤنا
              <div className="h-1.5 w-full bg-[#fa9e1b] absolute -bottom-2 left-0 transform origin-left"></div>
            </h2>
          </div>

          <div className="bg-white p-10 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#fa9e1b] opacity-5 rounded-full transform translate-x-32 -translate-y-32"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#31124b] opacity-5 rounded-full transform -translate-x-32 translate-y-32"></div>

            {loadingPartners ? (
              <div className="text-center py-12">
                <div className="inline-block p-3 rounded-full bg-[#fa9e1b] bg-opacity-10 animate-pulse">
                  <i className="fas fa-spinner fa-spin text-3xl text-[#fa9e1b]"></i>
                </div>
                <p className="mt-4 text-xl text-gray-600">
                  جارٍ تحميل الشركاء...
                </p>
              </div>
            ) : (
              <motion.div
                variants={animations.staggerChildren}
                className="flex flex-wrap justify-center items-center gap-10"
              >
                {partners.map(({ _id, name, image }) => (
                  <motion.div
                    key={_id}
                    variants={animations.fadeInUp}
                    whileHover={{
                      y: -10,
                      rotate: -5,
                      transition: { duration: 0.3 },
                    }}
                    className="w-48 h-48 bg-white rounded-xl flex items-center justify-center shadow-lg border-2 border-gray-100 group hover:border-[#fa9e1b] transition-all duration-300"
                  >
                    <div className="w-32 h-32 rounded-lg flex items-center justify-center relative overflow-hidden">
                      {image ? (
                        <img
                          src={image}
                          alt={name}
                          className="object-contain w-full h-full"
                        />
                      ) : (
                        <span className="text-xl font-bold text-gray-600 group-hover:text-[#31124b] transition-colors">
                          {name}
                        </span>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-[#fa9e1b] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Join Us Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={animations.fadeInUp}
          className="observe-section"
        >
          <div className="bg-gradient-to-r from-[#31124b] to-[#411a68] rounded-3xl shadow-2xl p-16 text-center text-white relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#fa9e1b] opacity-10 rounded-full transform translate-x-32 -translate-y-32"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#fa9e1b] opacity-10 rounded-full transform -translate-x-32 translate-y-32"></div>
            <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-[#fa9e1b] opacity-15 rounded-full"></div>
            <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-[#fa9e1b] opacity-15 rounded-full"></div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <h2 className="text-5xl font-bold mb-8">انضم إلى فريقنا</h2>
              <p className="text-2xl max-w-3xl mx-auto mb-12 leading-relaxed">
                كن جزءًا من التغيير الإيجابي في مجتمعك. انضم إلى مبادرة بادر
                اليوم ودع بصمتك في خدمة الحي والمجتمع!
              </p>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block"
              >
                <Link href="/volunteer" passHref>
                  <div className="bg-[#fa9e1b] hover:bg-yellow-500 text-white font-bold py-5 px-12 rounded-full transition-all duration-300 shadow-lg flex items-center text-xl">
                    <span className="ml-3">سجل كمتطوع</span>
                    <i className="fas fa-arrow-left"></i>
                  </div>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
