import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

// تعريفات الحركات المتحركة
const animations = {
  fadeInUp: {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  },
  staggerChildren: {
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
};

const PartnersPage = () => {
  const [partners, setPartners] = useState([]);
  const [loadingPartners, setLoadingPartners] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const partnersRes = await axios.get("/api/about/support");
        setPartners(partnersRes.data);
        setLoadingPartners(false);
      } catch (err) {
        setError("فشل في تحميل بيانات الشركاء");
        setLoadingPartners(false);
        console.error("Error fetching partners:", err);
      }
    };

    fetchPartners();
  }, []);

  return (
    <div className=" py-1 pt-10 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial="hidden"
        className="max-w-7xl mx-auto"
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          className="mb-28 observe-section"
        >
          <div className="bg-white p-10 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-[#31124b] inline-block relative">
                شركاؤنا
              </h2>
              <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
                نفتخر بشراكتنا مع هذه المؤسسات الرائدة التي تشاركنا رؤيتنا ونسعى
                معًا لتحقيق الأهداف المشتركة.
              </p>
            </div>
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#fa9e1b] opacity-15 rounded-full transform translate-x-32 -translate-y-32"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#31124b] opacity-20 rounded-full transform -translate-x-32 translate-y-32"></div>

            {loadingPartners ? (
              <div className="text-center py-12">
                <div className="inline-block p-3 rounded-full bg-[#fa9e1b] bg-opacity-10 animate-pulse">
                  <i className="fas fa-spinner fa-spin text-3xl text-[#fa9e1b]"></i>
                </div>
                <p className="mt-4 text-xl text-gray-600">
                  جارٍ تحميل الشركاء...
                </p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="inline-block p-3 rounded-full bg-red-100">
                  <i className="fas fa-exclamation-circle text-3xl text-red-500"></i>
                </div>
                <p className="mt-4 text-xl text-gray-600">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-6 py-2 bg-[#fa9e1b] text-white rounded-lg hover:bg-[#e08e17] transition-colors"
                >
                  إعادة المحاولة
                </button>
              </div>
            ) : partners.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-block p-3 rounded-full bg-gray-100">
                  <i className="fas fa-users text-3xl text-gray-500"></i>
                </div>
                <p className="mt-4 text-xl text-gray-600">
                  لا يوجد شركاء متاحين حالياً
                </p>
              </div>
            ) : (
              <motion.div
                variants={animations.staggerChildren}
                className="flex flex-wrap justify-center items-center gap-10"
              >
                {partners.map(({ _id, name, image, description }) => (
                  <motion.div
                    key={_id}
                    variants={animations.fadeInUp}
                    whileHover={{
                      y: -10,
                      rotate: -5,
                      transition: { duration: 0.3 },
                    }}
                    className="w-48 h-48 bg-white rounded-xl flex items-center justify-center shadow-lg border-2 border-gray-100 group hover:border-[#fa9e1b] transition-all duration-300 relative"
                  >
                    <div className="w-32 h-32 rounded-lg flex items-center justify-center relative overflow-hidden">
                      {image ? (
                        <img
                          src={image}
                          alt={name}
                          className="object-contain w-full h-full"
                          loading="lazy"
                        />
                      ) : (
                        <span className="text-xl font-bold text-gray-600 group-hover:text-[#31124b] transition-colors">
                          {name}
                        </span>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-[#fa9e1b] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                    </div>

                    {/* Tooltip for partner description */}
                    {description && (
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 translate-y-full w-64 bg-white p-3 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 border border-gray-200">
                        <h3 className="font-bold text-[#31124b]">{name}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {description}
                        </p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PartnersPage;
