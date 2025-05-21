'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function UnauthorizedPage() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push('/');
    }, 5000); // ⏱️ تحويل تلقائي بعد 3 ثواني

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-red-600 text-2xl font-bold mb-4">🚫 لا تملك صلاحية الوصول لهذه الصفحة</h1>
      <p className="text-gray-600 text-sm mb-6">سيتم تحويلك إلى الصفحة الرئيسية خلال لحظات...</p>

      <button
        onClick={() => router.push('/')}
        className="bg-[#31124b] hover:bg-[#fa9e1b] text-white font-semibold py-2 px-6 rounded transition duration-300"
      >
        العودة للرئيسية الآن
      </button>
    </div>
  );
}
