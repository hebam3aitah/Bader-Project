'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function NotificationsMenu() {
  const [notifications, setNotifications] = useState([]);
  const [unseenCount, setUnseenCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const previousCountRef = useRef(0);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // كل 10 ثواني يحدث
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/api/notifications');
      setNotifications(res.data);
      const unseen = res.data.filter((n) => !n.seen).length;
      setUnseenCount(unseen);

      // ✅ إذا كان عدد الإشعارات الجديدة أكبر من العدد السابق ➔ اعمل Toast
      if (previousCountRef.current && unseen > previousCountRef.current) {
        toast.success('📢 لديك إشعار جديد!');
      }
      previousCountRef.current = unseen;
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  const markAsSeen = async (id) => {
    try {
      await axios.patch(`/api/notifications/${id}`);
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark as seen', err);
    }
  };

  const handleToggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleCloseDropdown = () => {
    setDropdownOpen(false);
  };

  return (
    <div className="relative" onBlur={handleCloseDropdown}>
      {/* زر الإشعارات مع عداد */}
      <button 
        className="relative" 
        onClick={handleToggleDropdown}
      >
        🔔
        {unseenCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unseenCount}
          </span>
        )}
      </button>

      {/* قائمة الإشعارات */}
      {dropdownOpen && (
        <div className="absolute mt-2 right-0 bg-white rounded-lg shadow-lg w-80 p-4 z-50">
          <h3 className="text-lg font-bold mb-2">الإشعارات</h3>
          {notifications.length === 0 ? (
            <p className="text-gray-500">لا يوجد إشعارات بعد.</p>
          ) : (
            <ul className="max-h-80 overflow-y-auto">
              {notifications.map((notification) => (
                <li key={notification._id} className="mb-4">
                  <Link 
                    href={notification.link || '#'}
                    onClick={() => markAsSeen(notification._id)}
                    className="text-sm text-[#31124b] font-semibold hover:underline"
                  >
                    {notification.title}
                  </Link>
                  <p className="text-xs text-gray-600">{notification.message}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
