"use client";

import { useState } from 'react';
import Image from 'next/image';

export default function ProjectGallery({ images }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };
  
  return (
    <div>
      <h3 className="text-xl font-bold mb-4 text-[#31124b]">معرض الصور</h3>
      <div className="relative mb-8">
        <div className="w-full h-80 relative">
          <Image 
            src={images[currentImageIndex]} 
            alt={`صورة ${currentImageIndex + 1}`}
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-lg"
          />
        </div>
        <button 
          onClick={prevImage}
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#31124b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <button 
          onClick={nextImage}
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#31124b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex justify-center mt-4 space-x-2 space-x-reverse">
          {images.map((_, index) => (
            <button 
              key={index}
              onClick={() => setCurrentImageIndex(index)} 
              className={`w-3 h-3 rounded-full ${currentImageIndex === index ? 'bg-[#e08c18]' : 'bg-gray-300'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
