'use client';

import { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  FiBell, 
  FiInfo, 
  FiSend, 
  FiCheckCircle, 
  FiPackage, 
  FiHeart, 
  FiUsers, 
  FiSmile,
  FiAlertTriangle,
  FiAlertCircle,
  FiMessageSquare
} from 'react-icons/fi';

// Custom toast notifications
const notifySuccess = (message) => {
  toast.success(message, {
    style: { background: '#31124b', color: '#fff' },
    progressStyle: { background: '#fa9e1b' },
    icon: <FiCheckCircle size={24} color="#fa9e1b" />
  });
};

const notifyError = (message) => {
  toast.error(message, {
    style: { background: '#31124b', color: '#fff' },
    progressStyle: { background: '#fa9e1b' }
  });
};

export default function AdminNotificationPage() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('general');
  const [severity, setSeverity] = useState('medium');
  const [loading, setLoading] = useState(false);

  const sendNotification = async () => {
    if (!title.trim() || !message.trim()) {
      notifyError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/notifications', { title, message, type, severity });
      notifySuccess('تم إرسال الإشعار بنجاح!');
      setTitle('');
      setMessage('');
    } catch (err) {
      console.error(err);
      notifyError('فشل إرسال الإشعار');
    } finally {
      setLoading(false);
    }
  };

  // Get icon based on notification type
  const getTypeIcon = (type) => {
    switch (type) {
      case 'general':
        return <FiInfo size={18} />;
      case 'project':
        return <FiPackage size={18} />;
      case 'donation':
        return <FiHeart size={18} />;
      case 'volunteer':
        return <FiUsers size={18} />;
      case 'welcome':
        return <FiSmile size={18} />;
      default:
        return <FiInfo size={18} />;
    }
  };

  // Get icon based on severity
  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'low':
        return <FiInfo size={18} />;
      case 'medium':
        return <FiAlertTriangle size={18} />;
      case 'high':
        return <FiAlertCircle size={18} />;
      default:
        return <FiInfo size={18} />;
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
       {/* Header */}
        <div className="bg-gradient-to-r from-[#31124b] to-[#3c1c54] rounded-lg shadow-lg mb-6 p-6">
          <h1 className="text-3xl font-bold text-white"> لوحة إدارة الاشعارات</h1>
          <p className="text-gray-200 mt-1">إدارة وتنظيم الاشعارات    </p>
        </div>
      <ToastContainer 
        position="top-right" 
        rtl 
        closeButton={false}
        autoClose={3000}
      />
      
      

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-6">
          <FiBell className="ml-2" size={28} color="#fa9e1b" />
          <h1 className="text-3xl font-bold" style={{ color: '#31124b' }}>
            إرسال إشعار جديد
          </h1>
        </div>

        <div className="mb-5">
          <label className="block mb-2 font-medium" style={{ color: '#31124b' }}>
            عنوان الإشعار
          </label>
          <input 
            className="w-full p-3 border border-gray-300 rounded-lg transition-all focus:ring-2 focus:outline-none focus:border-none"
            style={{ focusRing: 'rgba(250, 158, 27, 0.5)' }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="أدخل عنوان الإشعار هنا..."
          />
        </div>

        <div className="mb-5">
          <label className="block mb-2 font-medium" style={{ color: '#31124b' }}>
            <FiMessageSquare className="inline ml-1" size={16} />
            نص الإشعار
          </label>
          <textarea 
            className="w-full p-3 border border-gray-300 rounded-lg transition-all focus:ring-2 focus:outline-none focus:border-none"
            style={{ focusRing: 'rgba(250, 158, 27, 0.5)' }}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="أدخل نص الإشعار التفصيلي هنا..."
            rows="5"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block mb-2 font-medium" style={{ color: '#31124b' }}>
              نوع الإشعار
            </label>
            <div className="relative">
              <select 
                className="w-full p-3 pl-10 appearance-none border border-gray-300 rounded-lg transition-all focus:ring-2 focus:outline-none focus:border-none"
                style={{ focusRing: 'rgba(250, 158, 27, 0.5)' }}
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="general">عام</option>
                <option value="project">مشروع جديد</option>
                <option value="donation">تبرع</option>
                <option value="volunteer">تطوع</option>
                <option value="welcome">ترحيب</option>
              </select>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none" style={{ color: '#31124b' }}>
                {getTypeIcon(type)}
              </div>
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium" style={{ color: '#31124b' }}>
              أولوية الإشعار
            </label>
            <div className="relative">
              <select 
                className="w-full p-3 pl-10 appearance-none border border-gray-300 rounded-lg transition-all focus:ring-2 focus:outline-none focus:border-none"
                style={{ focusRing: 'rgba(250, 158, 27, 0.5)' }}
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
              >
                <option value="low">منخفض</option>
                <option value="medium">متوسط</option>
                <option value="high">عالي</option>
              </select>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none" style={{ color: severity === 'high' ? '#ef4444' : severity === 'medium' ? '#f59e0b' : '#3b82f6' }}>
                {getSeverityIcon(severity)}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button 
            onClick={sendNotification}
            disabled={loading || !title.trim() || !message.trim()}
            className={`flex items-center py-3 px-8 rounded-md text-lg ${
              loading || !title.trim() || !message.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'text-white hover:opacity-90 transition-colors'
            }`}
            style={{ 
              backgroundColor: loading || !title.trim() || !message.trim() ? undefined : '#31124b',
              boxShadow: loading || !title.trim() || !message.trim() ? undefined : '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-l-2 border-white mr-2"></div>
            ) : (
              <FiSend className="ml-2" size={18} />
            )}
            <span>إرسال الإشعار</span>
          </button>
        </div>

        {/* Preview Section */}
        {(title || message) && (
          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-medium mb-4" style={{ color: '#31124b' }}>معاينة الإشعار</h3>
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(49, 18, 75, 0.03)' }}>
              <div className="flex items-center mb-3">
                <div className="h-10 w-10 rounded-full flex items-center justify-center text-white mr-3"
                     style={{ backgroundColor: severity === 'high' ? '#ef4444' : severity === 'medium' ? '#f59e0b' : '#3b82f6' }}>
                  {getTypeIcon(type)}
                </div>
                <div>
                  <h4 className="font-bold" style={{ color: '#31124b' }}>{title || 'عنوان الإشعار'}</h4>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>{
                      type === 'general' ? 'عام' :
                      type === 'project' ? 'مشروع جديد' :
                      type === 'donation' ? 'تبرع' :
                      type === 'volunteer' ? 'تطوع' : 'ترحيب'
                    }</span>
                    <span className="mx-2">•</span>
                    <span>{
                      severity === 'high' ? 'أولوية عالية' :
                      severity === 'medium' ? 'أولوية متوسطة' : 'أولوية منخفضة'
                    }</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{message || 'نص الإشعار سيظهر هنا...'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}