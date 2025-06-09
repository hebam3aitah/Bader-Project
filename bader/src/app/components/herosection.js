"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const router = useRouter();

  return (
    <>
      <div className="w-full h-2 bg-[#31124b]"></div>

      <div
        className="relative w-full h-130 flex items-center text-white"
        style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}
      >
        {/* Background Video */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/images/herosection.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Overlay with Gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to left,rgba(102, 36, 128, 0.7) 0%, transparent 100%)",
          }}
        ></div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl ml-auto px-10 lg:px-20 text-right">
          <p className="text-3xl md:text-4xl max-w-[500px] mb-[40px] font-bold">
            بادر  مبادرة مجتمعية تهدف إلى تحسين أحياءنا وجعلها مكانًا أفضل
            للجميع
            شاركنا التغيير وصنع القرار.
          </p>
         
          {/* CTA Button */}
          <Link
            href="/projects"
            className="inline-block mt-[0px] relative group"
          >
            <button className="overflow-hidden relative w-52 p-2 h-10 bg-[#31124b] text-white border-none rounded-md text-md font-bold cursor-pointer z-10">
              الفرص التطوعية
              <span className="absolute w-36 h-32 -top-8 -left-2 bg-white rotate-8 transform scale-x-0 group-hover:scale-x-200 transition-transform group-hover:duration-500 duration-1000 origin-left"></span>
              <span className="absolute w-36 h-32 -top-8 -left-2 bg-[#31124b] rotate-8 transform scale-x-0 group-hover:scale-x-200 transition-transform group-hover:duration-700 duration-700 origin-left"></span>
              <span className="absolute w-36 h-32 -top-8 -left-2 bg-[#662480] rotate-8 transform scale-x-0 group-hover:scale-x-200 transition-transform group-hover:duration-1000 duration-500 origin-left"></span>
              <span className="group-hover:opacity-100 group-hover:duration-1000 duration-100 opacity-0 absolute top-2.5 left-18 z-10">
                المشاريع
              </span>
            </button>
          </Link>
        </div>

        <style>{`
          .clip-diagonal {
            clip-path: polygon(0 0, 50% 0, 35% 100%, 0% 100%);
          }
        `}</style>
      </div>

      <div className="w-full h-2 bg-[#31124b]"></div>
    </>
  );
}
