import React from 'react';

import Link from 'next/link';
export default function StatsSection() {
  // بيانات الإحصائيات
  const stats = [
    {
      number: 45,
      title: 'مشروع منجز',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#fa9e1b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      number: 2500,
      title: 'متطوع مشارك',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#fa9e1b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      number: 18,
      title: 'حي مستفيد',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#fa9e1b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      number: 150000,
      title: 'ساعة تطوعية',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#fa9e1b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#31124b] mb-4">
            إنجازاتنا <span className="text-[#8d4fff]">بالأرقام</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            خلال مسيرتنا، حققنا العديد من الإنجازات بفضل جهود متطوعينا المخلصين ودعم المجتمع المحلي
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg shadow-lg p-8 text-center transform transition duration-500 hover:scale-105"
            >
              <div className="flex justify-center mb-4">
                {stat.icon}
              </div>
              <h3 className="text-4xl font-bold text-[#31124b] mb-2">
                {stat.number.toLocaleString('ar-EG')}
              </h3>
              <p className="text-xl text-gray-600">{stat.title}</p>
            </div>
          ))}
        </div>
        
        {/* قسم الدعوة للعمل */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-semibold text-[#31124b] mb-4">
            هل تريد المساهمة في تطوير مجتمعك؟
          </h3>
          <Link 
            href="/register" 
            className="inline-block px-8 py-3 bg-[#fa9e1b] hover:bg-[#e08c18] text-white font-medium rounded-md shadow-lg transition duration-300 text-lg mt-2"
          >
            انضم إلى فريقنا
          </Link>
        </div>
      </div>
    </section>
  );
}
