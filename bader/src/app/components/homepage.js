import React from 'react';
import HeroSection from './herosection';
import StatsSection from './StatsSection';
// import Navbar from './Navbar';
// import Footer from './Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <HeroSection />
        <StatsSection />
        {/* يمكن إضافة المزيد من الأقسام هنا */}
      </main>
    </div>
  );
}