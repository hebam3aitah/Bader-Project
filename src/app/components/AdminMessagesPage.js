"use client";

import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FiMail,
  FiSearch,
  FiX,
  FiUser,
  FiPhone,
  FiMessageSquare,
  FiCalendar,
  FiChevronUp,
  FiChevronDown,
  FiTrash2,
  FiSend,
  FiCheckCircle,
  FiInbox,
  FiArrowLeft,
  FiArrowRight,
} from "react-icons/fi";

// Custom toast notifications
const notifySuccess = (message) => {
  toast.success(message, {
    style: { background: "#31124b", color: "#fff" },
    progressStyle: { background: "#fa9e1b" },
    icon: <FiCheckCircle size={24} color="#fa9e1b" />,
  });
};

const notifyError = (message) => {
  toast.error(message, {
    style: { background: "#31124b", color: "#fff" },
    progressStyle: { background: "#fa9e1b" },
  });
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("new"); // 'new' or 'replied'

  useEffect(() => {
    fetchMessages();
  }, [page, activeTab]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/Admin/contact-messages?page=${page}&limit=5&status=${activeTab}`
      );
      const data = await res.json();
      setMessages(data.messages);
      setTotalPages(data.pages);
    } catch (error) {
      notifyError("فشل في تحميل الرسائل");
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (id) => {
    setLoading(true);
    try {
      await fetch(`/api/Admin/contact-messages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          replied: true,
          replyText: replyText[id],
        }),
      });
      await fetchMessages();
      setReplyText((prev) => ({ ...prev, [id]: "" }));
      notifySuccess("تم الرد على الرسالة بنجاح!");
    } catch (error) {
      console.error("فشل في الرد:", error);
      notifyError("حدث خطأ أثناء الرد!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("هل أنت متأكد أنك تريد حذف هذه الرسالة؟")) return;

    setLoading(true);
    try {
      await fetch(`/api/Admin/contact-messages/${id}`, { method: "DELETE" });
      await fetchMessages();
      notifySuccess("تم حذف الرسالة بنجاح!");
    } catch (error) {
      console.error("فشل في الحذف:", error);
      notifyError("حدث خطأ أثناء الحذف!");
    } finally {
      setLoading(false);
    }
  };

  const filteredMessages = messages.filter(
    (m) =>
      (activeTab === "new" ? !m.replied : m.replied) &&
      (search
        ? m.name.toLowerCase().includes(search.toLowerCase()) ||
          m.email.toLowerCase().includes(search.toLowerCase()) ||
          m.message.toLowerCase().includes(search.toLowerCase())
        : true)
  );

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <ToastContainer
        position="top-right"
        rtl
        closeButton={false}
        autoClose={3000}
      />

      {/* Header */}
      <div className="bg-gradient-to-r from-[#31124b] to-[#3c1c54] rounded-lg shadow-lg mb-6 p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex items-center mb-3 md:mb-0">
            <FiMail className="ml-2" size={28} color="#fa9e1b" />
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              لوحة إدارة رسائل التواصل
            </h1>
          </div>
          <p className="text-gray-200 text-sm md:text-base">
            إدارة وتنظيم رسائل الصفحه
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="ابحث في الرسائل..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fa9e1b] focus:outline-none focus:border-transparent transition-all"
            />
            <FiSearch
              className="absolute right-3 top-2.5 text-gray-400"
              size={18}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute left-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <FiX size={18} />
              </button>
            )}
          </div>
        </div>

        <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
          <div className="flex space-x-1 min-w-max">
            <button
              className={`py-2 px-3 md:px-4 font-medium text-base md:text-lg transition-all flex items-center ${
                activeTab === "new"
                  ? "border-b-2 border-[#fa9e1b] text-[#31124b]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("new")}
            >
              <FiInbox
                className="ml-1 md:ml-2"
                size={16}
                color={activeTab === "new" ? "#fa9e1b" : "currentColor"}
              />
              <span className="whitespace-nowrap">الرسائل الجديدة</span>
              {messages.filter((m) => !m.replied).length > 0 && (
                <span
                  className="mr-1 md:mr-2 text-white text-xs font-bold px-1.5 py-0.5 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: "#fa9e1b",
                    minWidth: "18px",
                    height: "18px",
                  }}
                >
                  {messages.filter((m) => !m.replied).length}
                </span>
              )}
            </button>
            <button
              className={`py-2 px-3 md:px-4 font-medium text-base md:text-lg transition-all flex items-center ${
                activeTab === "replied"
                  ? "border-b-2 border-[#fa9e1b] text-[#31124b]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("replied")}
            >
              <FiCheckCircle
                className="ml-1 md:ml-2"
                size={16}
                color={activeTab === "replied" ? "#fa9e1b" : "currentColor"}
              />
              <span className="whitespace-nowrap">الرسائل المجاب عليها</span>
            </button>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-l-2 border-[#fa9e1b]"></div>
          </div>
        )}

        {!loading && filteredMessages.length === 0 && (
          <div className="py-10 md:py-16 text-center">
            <div className="mb-4">
              {activeTab === "new" ? (
                <FiInbox size={48} className="mx-auto text-[#fa9e1b]" />
              ) : (
                <FiCheckCircle size={48} className="mx-auto text-[#fa9e1b]" />
              )}
            </div>
            <p className="text-lg md:text-xl text-[#31124b]">
              {activeTab === "new"
                ? "لا توجد رسائل جديدة حالياً"
                : "لا توجد رسائل مجاب عليها"}
            </p>
          </div>
        )}

        <div className="space-y-4">
          {filteredMessages.map((msg) => (
            <MessageCard
              key={msg._id}
              msg={msg}
              replyText={replyText}
              setReplyText={setReplyText}
              handleReply={handleReply}
              handleDelete={handleDelete}
              loading={loading}
              isReplied={msg.replied}
            />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mt-6 md:mt-8">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className={`px-3 py-1.5 md:px-4 md:py-2 rounded-md flex items-center text-sm md:text-base ${
                page === 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-[#31124b] text-white hover:opacity-90"
              }`}
            >
              <FiArrowRight className="ml-1" size={16} />
              <span>السابق</span>
            </button>
            <div className="flex items-center px-3 md:px-4">
              <span className="rounded-md px-2 py-1 md:px-3 md:py-2 font-medium text-sm md:text-base bg-[rgba(250,158,27,0.1)] text-[#31124b]">
                {page} من {totalPages}
              </span>
            </div>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className={`px-3 py-1.5 md:px-4 md:py-2 rounded-md flex items-center text-sm md:text-base ${
                page === totalPages
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-[#31124b] text-white hover:opacity-90"
              }`}
            >
              <span>التالي</span>
              <FiArrowLeft className="mr-1" size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function MessageCard({
  msg,
  replyText,
  setReplyText,
  handleReply,
  handleDelete,
  loading,
  isReplied,
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`border rounded-lg shadow-sm transition-all mb-4 overflow-hidden ${
        isReplied
          ? "border-[rgba(250,158,27,0.3)] bg-[rgba(250,158,27,0.05)]"
          : "border-[#31124b] hover:shadow-md"
      }`}
    >
      <div className="p-3 md:p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
          <div className="flex items-start w-full">
            <div className="h-10 w-10 min-w-[2.5rem] rounded-full flex items-center justify-center text-lg font-bold text-white bg-[#31124b]">
              <FiUser size={20} />
            </div>
            <div className="mr-2 md:mr-3 w-full">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h3 className="font-bold text-base md:text-lg text-[#31124b]">
                  {msg.name}
                </h3>
                <span className="text-xs md:text-sm text-gray-600 flex items-center mt-1 sm:mt-0">
                  <FiCalendar size={12} className="ml-1" />
                  {new Date(msg.createdAt).toLocaleString("ar-EG", {
                    day: "numeric",
                    month: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="text-gray-600 text-sm flex items-center mt-1">
                <FiMail size={12} className="ml-1" />
                {msg.email}
              </p>
            </div>
          </div>
          <div className="flex items-center self-end sm:self-auto">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-all"
            >
              {expanded ? (
                <FiChevronUp size={16} />
              ) : (
                <FiChevronDown size={16} />
              )}
            </button>
          </div>
        </div>

        {expanded && (
          <div className="mt-3 md:mt-4">
            <div className="p-3 rounded-lg mb-3 bg-[rgba(49,18,75,0.03)]">
              <div className="flex flex-col gap-2">
                {msg.phone && (
                  <div className="flex items-center">
                    <FiPhone size={14} className="ml-1 text-gray-600" />
                    <span className="font-medium text-gray-700">الهاتف:</span>
                    <span className="mr-2">{msg.phone}</span>
                  </div>
                )}
                <div className="flex items-start">
                  <FiMessageSquare
                    size={14}
                    className="ml-1 mt-1 text-gray-600"
                  />
                  <div className="flex-1">
                    <span className="font-medium text-gray-700">الرسالة:</span>
                    <p className="mt-1 whitespace-pre-wrap text-gray-700">
                      {msg.message}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {!isReplied && (
              <div className="mt-3 md:mt-4">
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#fa9e1b] focus:outline-none focus:border-transparent transition-all"
                  placeholder="اكتب ردك هنا..."
                  rows="3"
                  value={replyText[msg._id] || ""}
                  onChange={(e) =>
                    setReplyText((prev) => ({
                      ...prev,
                      [msg._id]: e.target.value,
                    }))
                  }
                />
                <div className="flex flex-col sm:flex-row gap-2 mt-3">
                  <button
                    onClick={() => handleReply(msg._id)}
                    disabled={loading || !replyText[msg._id]}
                    className={`flex items-center justify-center py-2 px-4 rounded-md text-sm md:text-base ${
                      loading || !replyText[msg._id]
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-[#31124b] text-white hover:opacity-90"
                    }`}
                  >
                    <FiSend className="ml-1" size={16} />
                    <span>إرسال الرد</span>
                  </button>
                  <button
                    onClick={() => handleDelete(msg._id)}
                    disabled={loading}
                    className={`flex items-center justify-center py-2 px-4 rounded-md text-sm md:text-base ${
                      loading
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-red-50 text-red-600 hover:bg-red-100"
                    }`}
                  >
                    <FiTrash2 className="ml-1" size={16} />
                    <span>حذف</span>
                  </button>
                </div>
              </div>
            )}

            {isReplied && msg.replyText && (
              <div className="mt-3 md:mt-4 bg-white p-3 rounded-lg border border-[rgba(250,158,27,0.3)]">
                <div className="flex items-center mb-2">
                  <FiCheckCircle size={14} className="ml-1 text-[#fa9e1b]" />
                  <span className="font-medium text-[#31124b]">الرد:</span>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {msg.replyText}
                </p>
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => handleDelete(msg._id)}
                    disabled={loading}
                    className={`flex items-center py-1 px-3 rounded-md text-sm ${
                      loading
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-red-50 text-red-600 hover:bg-red-100"
                    }`}
                  >
                    <FiTrash2 className="ml-1" size={14} />
                    <span>حذف</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
