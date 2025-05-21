
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DollarSign, Users } from 'lucide-react';

export default function DonationSection({ projectId }) {
  const [donations, setDonations] = useState(0);
  const [volunteers, setVolunteers] = useState(0);

  useEffect(() => {
    if (!projectId) return;

    const fetchSupport = async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}/support`);
        const data = await res.json();
        setDonations(data.donations || 0);
        setVolunteers(data.volunteers || 0);
      } catch (err) {
        console.error('فشل في تحميل بيانات الدعم:', err);
      }
    };

    fetchSupport();
  }, [projectId]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h3 className="text-xl font-bold mb-4 text-[#31124b]">دعم المشروع</h3>

      <div className="border-b border-gray-200 pb-4 mb-4">
        <div className="flex justify-between text-gray-600 mb-2">
          <span>تبرعات تم جمعها</span>
          <span className="font-bold">{donations.toLocaleString()} $</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div
            className="bg-[#e08c18] h-2.5 rounded-full"
            style={{ width: `${Math.min(100, (donations / 20000) * 100)}%` }}
          ></div>
        </div>
      </div>

      <Link href={`/project/${projectId}/donate`}>
        <div className="block w-full bg-[#e08c18] text-white text-center py-3 rounded-lg font-bold mb-4 hover:bg-opacity-90 transition-colors cursor-pointer">
          
          <DollarSign className="inline-block w-5 h-5 ml-2" />

          تبرع الآن


        </div>
      </Link>

      <Link href={`/project/${projectId}/volunteer`}>
        <div className="block w-full border-2 border-[#31124b] text-[#31124b] text-center py-3 rounded-lg font-bold hover:bg-[#31124b] hover:text-white transition-colors cursor-pointer">
          <Users className="inline-block w-5 h-5 ml-2" />
          تطوع معنا ({volunteers})
        </div>
      </Link>
    </div>
  );
}
