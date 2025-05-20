"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { unparse } from "papaparse";
import { toast } from "react-toastify";

export default function AdminVolunteersPage() {
  const [volunteers, setVolunteers] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const limit = 5;

  const translateAvailability = (availability) => {
    switch (availability) {
      case "weekdays_morning":
        return "أيام الأسبوع - صباحًا";
      case "weekdays_evening":
        return "أيام الأسبوع - مساءً";
      case "weekends":
        return "عطلة نهاية الأسبوع";
      case "flexible":
        return "مرن / حسب الحاجة";
      default:
        return availability || "—";
    }
  };

  const fetchVolunteers = async () => {
    try {
      const res = await axios.get("/api/Admin/volunteers", {
        params: { search, status: statusFilter, page, limit },
      });
      setVolunteers(res.data.volunteers);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      toast.error("فشل في جلب بيانات المتطوعين");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/api/Admin/volunteers/${id}`, { status });
      toast.success("تم التحديث بنجاح");
      fetchVolunteers();
    } catch (err) {
      toast.error("فشل في تحديث الحالة");
    }
  };

  const statusTranslate = (status) => {
    if (status === "accepted") return "مقبول";
    if (status === "rejected") return "مرفوض";
    return "قيد المراجعة";
  };

  const getStatusColor = (status) => {
    if (status === "accepted")
      return "bg-green-100 text-green-800 border-green-300";
    if (status === "rejected") return "bg-red-100 text-red-800 border-red-300";
    return "bg-yellow-100 text-yellow-800 border-yellow-300";
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [
        [
          "الاسم",
          "البريد",
          "الهاتف",
          "العمر",
          "الوظيفة",
          "المشروع",
          "الخبرة",
          "الاهتمامات",
          "التوفر",
          "الحالة",
        ],
      ],
      body: volunteers.map((v) => [
        v.name,
        v.email,
        v.phone || "—",
        v.age || "—",
        v.job || "—",
        v.projectAssigned?.title || "—",
        v.experience || "—",
        v.interests || "—",
        v.availability || "—",
        statusTranslate(v.status),
      ]),
    });
    doc.save("volunteers.pdf");
  };

  const exportCSV = () => {
    const csv = unparse(
      volunteers.map((v) => ({
        الاسم: v.name,
        البريد: v.email,
        الهاتف: v.phone || "—",
        العمر: v.age || "—",
        الوظيفة: v.job || "—",
        المشروع: v.projectAssigned?.title || "—",
        الخبرة: v.experience || "—",
        الاهتمامات: v.interests || "—",
        التوفر: v.availability || "—",
        الحالة: statusTranslate(v.status),
      }))
    );
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "volunteers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openDetailsModal = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedVolunteer(null);
  };

  useEffect(() => {
    fetchVolunteers();
  }, [search, statusFilter, page]);

  return (
    <div
      className="p-6 max-full bg-gray-50 min-h-screen overflow-x-hidden"
      dir="rtl"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#31124b] to-[#3c1c54] rounded-lg shadow-lg mb-6 p-6">
          <h1 className="text-3xl font-bold text-white">طلبات التطوع</h1>
          <p className="text-gray-200 mt-1">إدارة وتنظيم طلبات المتطوعين</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-5 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative w-full lg:w-1/3">
              <input
                type="text"
                placeholder="ابحث بالاسم أو البريد..."
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-300 p-3 pl-10 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#31124b] focus:border-transparent"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 absolute right-3 top-3.5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="w-full lg:w-1/4">
              <select
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#31124b] focus:border-transparent appearance-none bg-white"
              >
                <option value="all">كل الحالات</option>
                <option value="pending">قيد المراجعة</option>
                <option value="accepted">مقبول</option>
                <option value="rejected">مرفوض</option>
              </select>
            </div>
            <div className="flex gap-3 w-full lg:w-auto">
              <button
                onClick={exportPDF}
                className="bg-[#31124b] hover:bg-[#3c1c54] text-white px-4 py-3 rounded-lg flex items-center justify-center flex-grow lg:flex-grow-0 transition duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z"
                    clipRule="evenodd"
                  />
                </svg>
                تصدير PDF
              </button>
              <button
                onClick={exportCSV}
                className="bg-[#fa9e1b] hover:bg-[#f8a52e] text-white px-4 py-3 rounded-lg flex items-center justify-center flex-grow lg:flex-grow-0 transition duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                تصدير CSV
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 hidden md:block">
          <div className="overflow-x-auto">
            <table className="  divide-gray-200">
              <thead className="bg-[#31124b] text-white">
                <tr>
                  <th className="px-4 py-3 text-right text-sm font-medium w-1/6">
                    الاسم
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium w-1/6">
                    البريد
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium w-1/6">
                    الهاتف
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium w-1/6">
                    المشروع
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium w-1/6">
                    التوفر
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium w-1/6">
                    الإجراء
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {volunteers.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 text-gray-400 mb-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                        <p className="text-lg font-medium">
                          لا توجد طلبات حالياً
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          ستظهر طلبات التطوع الجديدة هنا
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  volunteers.map((v) => (
                    <tr
                      key={v._id}
                      className="hover:bg-gray-50 transition duration-150"
                    >
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">
                        {v.name}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {v.email}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {v.phone || "—"}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {v.projectAssigned?.title || "—"}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {translateAvailability(v.availability)}
                      </td>
                      <td className="px-4 py-4 gap-10 text-sm flex items-center">
                        <select
                          value={v.status}
                          onChange={(e) => updateStatus(v._id, e.target.value)}
                          className={`border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#31124b] ${getStatusColor(
                            v.status
                          )}`}
                        >
                          <option value="pending">قيد المراجعة</option>
                          <option value="accepted">مقبول</option>
                          <option value="rejected">مرفوض</option>
                        </select>
                        <button
                          onClick={() => openDetailsModal(v)}
                          className="bg-[#31124b] hover:bg-[#3c1c54] text-white px-3 py-1.5 rounded flex items-center text-sm transition duration-200"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 ml-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path
                              fillRule="evenodd"
                              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          عرض التفاصيل
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {volunteers.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-gray-400 mx-auto mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="text-lg font-medium">لا توجد طلبات حالياً</p>
              <p className="text-sm text-gray-500 mt-1">
                ستظهر طلبات التطوع الجديدة هنا
              </p>
            </div>
          ) : (
            volunteers.map((v) => (
              <div
                key={v._id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-4 border-b border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-lg">{v.name}</h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        v.status === "accepted"
                          ? "bg-green-100 text-green-800"
                          : v.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {statusTranslate(v.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium ml-1">البريد:</span> {v.email}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium ml-1">الهاتف:</span>{" "}
                    {v.phone || "—"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium ml-1">التوفر:</span>{" "}
                    {translateAvailability(v.availability)}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 flex justify-between items-center">
                  <select
                    value={v.status}
                    onChange={(e) => updateStatus(v._id, e.target.value)}
                    className={`border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#31124b] ${getStatusColor(
                      v.status
                    )}`}
                  >
                    <option value="pending">قيد المراجعة</option>
                    <option value="accepted">مقبول</option>
                    <option value="rejected">مرفوض</option>
                  </select>
                  <button
                    onClick={() => openDetailsModal(v)}
                    className="bg-[#31124b] hover:bg-[#3c1c54] text-white px-3 py-1 rounded text-sm flex items-center transition duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    عرض التفاصيل
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6">
          <nav className="flex items-center bg-white px-4 py-3 rounded-lg shadow-md space-x-2 rtl:space-x-reverse">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className={`rounded-md px-4 py-2 text-sm font-medium ${
                page === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-[#31124b] text-white hover:bg-[#3c1c54] transition duration-200"
              }`}
            >
              السابق
            </button>
            <div className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-md">
              صفحة {page} من {totalPages}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className={`rounded-md px-4 py-2 text-sm font-medium ${
                page === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-[#31124b] text-white hover:bg-[#3c1c54] transition duration-200"
              }`}
            >
              التالي
            </button>
          </nav>
        </div>

        {/* Details Modal */}
        {showModal && selectedVolunteer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-xl mx-auto overflow-hidden">
              <div className="bg-[#31124b] text-white px-6 py-4 flex justify-between items-center">
                <h3 className="text-xl font-bold">تفاصيل المتطوع</h3>
                <button
                  onClick={closeModal}
                  className="text-white hover:text-gray-200 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="text-sm font-bold text-gray-500 mb-1">
                      الاسم
                    </h4>
                    <p className="text-gray-800">{selectedVolunteer.name}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-500 mb-1">
                      البريد الإلكتروني
                    </h4>
                    <p className="text-gray-800">{selectedVolunteer.email}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-500 mb-1">
                      رقم الهاتف
                    </h4>
                    <p className="text-gray-800">
                      {selectedVolunteer.phone || "—"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-500 mb-1">
                      العمر
                    </h4>
                    <p className="text-gray-800">
                      {selectedVolunteer.age || "—"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-500 mb-1">
                      الوظيفة
                    </h4>
                    <p className="text-gray-800">
                      {selectedVolunteer.job || "—"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-500 mb-1">
                      المشروع
                    </h4>
                    <p className="text-gray-800">
                      {selectedVolunteer.projectAssigned?.title || "—"}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <h4 className="text-sm font-bold text-gray-500 mb-1">
                      الخبرة
                    </h4>
                    <p className="text-gray-800">
                      {selectedVolunteer.experience || "—"}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <h4 className="text-sm font-bold text-gray-500 mb-1">
                      الاهتمامات
                    </h4>
                    <p className="text-gray-800">
                      {selectedVolunteer.interests || "—"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-500 mb-1">
                      التوفر
                    </h4>
                    <p className="text-gray-800">
                      {translateAvailability(selectedVolunteer.availability)}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-500 mb-1">
                      الحالة
                    </h4>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-sm ${getStatusColor(
                        selectedVolunteer.status
                      )}`}
                    >
                      {statusTranslate(selectedVolunteer.status)}
                    </span>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h4 className="font-bold mb-2">تغيير الحالة</h4>
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <button
                      onClick={() => {
                        updateStatus(selectedVolunteer._id, "accepted");
                        closeModal();
                      }}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition"
                    >
                      قبول
                    </button>
                    <button
                      onClick={() => {
                        updateStatus(selectedVolunteer._id, "rejected");
                        closeModal();
                      }}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition"
                    >
                      رفض
                    </button>
                    <button
                      onClick={() => {
                        updateStatus(selectedVolunteer._id, "pending");
                        closeModal();
                      }}
                      className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded transition"
                    >
                      قيد المراجعة
                    </button>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-3 flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded transition"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
