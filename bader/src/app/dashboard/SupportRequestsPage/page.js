"use client";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { unparse } from "papaparse";
import { toast } from "react-toastify";
import {
  Search,
  FileText,
  Download,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  X,
} from "lucide-react";

export default function SupportRequestsPage() {
  const [allSupporters, setAllSupporters] = useState([]); // جميع البيانات
  const [filteredSupporters, setFilteredSupporters] = useState([]); // البيانات المصفاة للعرض
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedSupporter, setSelectedSupporter] = useState(null);
  const limit = 5;

  const fetchSupporters = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/Admin/supporters");
      setAllSupporters(res.data.supporters);
      setFilteredSupporters(res.data.supporters);
      setTotalPages(Math.ceil(res.data.supporters.length / limit));
    } catch (err) {
      toast.error("فشل في جلب بيانات الداعمين");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSupporters();
  }, [fetchSupporters]);

  // تصفية البيانات عند تغيير البحث
  useEffect(() => {
    if (search.trim() === "") {
      setFilteredSupporters(allSupporters);
      setPage(1);
      setTotalPages(Math.ceil(allSupporters.length / limit));
      return;
    }

    const filtered = allSupporters.filter((supporter) =>
      supporter.name.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredSupporters(filtered);
    setPage(1);
    setTotalPages(Math.ceil(filtered.length / limit));
  }, [search, allSupporters]);

  // الحصول على البيانات للصفحة الحالية
  const getPaginatedData = () => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return filteredSupporters.slice(startIndex, endIndex);
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    setSearch(e.target.value);
  };

  const handleChangeStatus = async (id, newStatus) => {
    try {
      await axios.put(`/api/Admin/supporters/${id}`, { approved: newStatus });

      let successMessage;
      if (newStatus === "approved") successMessage = "تم قبول الجهة بنجاح";
      else if (newStatus === "rejected") successMessage = "تم رفض الجهة بنجاح";
      else successMessage = "تم تحديث الحالة بنجاح";

      toast.success(successMessage);

      // تحديث الحالة في جميع البيانات
      setAllSupporters((prev) =>
        prev.map((s) => (s._id === id ? { ...s, approved: newStatus } : s))
      );

      // تحديث الحالة في البيانات المصفاة
      setFilteredSupporters((prev) =>
        prev.map((s) => (s._id === id ? { ...s, approved: newStatus } : s))
      );

      setSelectedSupporter((prev) =>
        prev ? { ...prev, approved: newStatus } : null
      );
    } catch {
      toast.error("فشل في تحديث الحالة");
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [
        [
          "#",
          "الاسم",
          "النوع",
          "المسؤول",
          "الهاتف",
          "البريد",
          "تاريخ التسجيل",
          "الحالة",
        ],
      ],
      body: filteredSupporters.map((s, i) => [
        i + 1,
        s.name,
        s.category,
        s.contactPerson || "-",
        s.phone || "-",
        s.email,
        s.supportType,
        new Date(s.registeredAt).toLocaleDateString("ar-EG"),
        getStatusLabel(s.approved),
      ]),
    });
    doc.save("supporters.pdf");
  };

  const exportCSV = () => {
    const csv = unparse(
      filteredSupporters.map((s, i) => ({
        "#": i + 1,
        الاسم: s.name,
        النوع: s.category,
        "نوع الدعم ": s.supportType,
        المسؤول: s.contactPerson || "-",
        الهاتف: s.phone || "-",
        "البريد الإلكتروني": s.email,
        "تاريخ التسجيل": new Date(s.registeredAt).toLocaleDateString("ar-EG"),
        الحالة: getStatusLabel(s.approved),
      }))
    );

    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "supporters.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "approved":
        return "مقبولة";
      case "rejected":
        return "مرفوضة";
      default:
        return "قيد الانتظار";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "text-green-600";
      case "rejected":
        return "text-red-600";
      default:
        return "text-orange-500";
    }
  };

  const getCategoryLabel = (category) => {
    switch (category) {
      case "companies":
        return "شركات";
      case "governmental":
        return "جهات حكومية";
      case "ngos":
        return "منظمات غير ربحية";
      default:
        return category;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8 p-4 md:p-6 rounded-lg shadow-md flex flex-col md:flex-row justify-between items-center gap-4 bg-[#41225f]">
          <h1 className="text-xl md:text-2xl font-bold text-white">
            إدارة الجهات الداعمة
          </h1>
          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={fetchSupporters}
              className="flex items-center gap-1 px-3 py-2 rounded-md text-white bg-[#fa9e1b] hover:bg-[#e08e17] transition-colors w-full md:w-auto justify-center"
            >
              <RefreshCw size={16} />
              <span>تحديث</span>
            </button>
          </div>
        </div>

        {/* Filters & Controls */}
        <div className="mb-6 p-4 rounded-lg shadow-md bg-white">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-3 items-center w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute top-2.5 right-2.5 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="ابحث بالاسم..."
                  className="pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 w-full border-[#41225f] focus:ring-[#fa9e1b]"
                  value={searchInput}
                  onChange={handleSearchChange}
                />
              </div>
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <button
                onClick={exportPDF}
                className="flex items-center gap-1 px-3 py-2 rounded-md text-white bg-[#41225f] hover:bg-[#341b4d] transition-colors w-full md:w-auto justify-center"
              >
                <FileText size={16} />
                <span>تصدير PDF</span>
              </button>

              <button
                onClick={exportCSV}
                className="flex items-center gap-1 px-3 py-2 rounded-md text-white bg-[#fa9e1b] hover:bg-[#e08e17] transition-colors w-full md:w-auto justify-center"
              >
                <Download size={16} />
                <span>تصدير CSV</span>
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto rounded-lg shadow-md mb-6 bg-white">
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#fa9e1b]"></div>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#41225f]">
                  <th className="py-3 px-4 text-white">#</th>
                  <th className="py-3 px-4 text-white">الصورة</th>
                  <th className="py-3 px-4 text-white">الاسم</th>
                  <th className="py-3 px-4 text-white">نوع الدعم</th>
                  <th className="py-3 px-4 text-white">رقم الهاتف</th>
                  <th className="py-3 px-4 text-white">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {getPaginatedData().length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                      لا توجد بيانات للعرض
                    </td>
                  </tr>
                ) : (
                  getPaginatedData().map((s, i) => (
                    <tr
                      key={s._id}
                      className="border-t hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => setSelectedSupporter(s)}
                    >
                      <td className="py-3 px-4 text-center">
                        {(page - 1) * limit + i + 1}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="w-12 h-12 mx-auto rounded-full overflow-hidden border-2 border-[#fa9e1b]">
                          <img
                            src={s.images?.[0]?.url || "/placeholder/50"}
                            className="w-full h-full object-cover"
                            alt="صورة"
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium">{s.name}</td>
                      <td className="py-3 px-4">
                        <span
                          className="px-2 py-1 rounded-full text-xs"
                          style={{
                            backgroundColor: "#41225f20",
                            color: "#41225f",
                          }}
                        >
                          {getCategoryLabel(s.supportType)}
                        </span>
                      </td>
                      <td className="py-3 px-4">{s.phone || "-"}</td>
                      <td className="py-3 px-4">
                        <select
                          value={s.approved}
                          onChange={(e) =>
                            handleChangeStatus(s._id, e.target.value)
                          }
                          className={`border px-2 py-1 rounded-md focus:outline-none ${getStatusColor(
                            s.approved
                          )}`}
                          style={{ borderColor: "#41225f" }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <option value="pending">قيد الانتظار</option>
                          <option value="approved">مقبولة</option>
                          <option value="rejected">مرفوضة</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden grid gap-4 mb-6">
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#fa9e1b]"></div>
            </div>
          ) : getPaginatedData().length === 0 ? (
            <div className="p-8 text-center text-gray-500 bg-white rounded-lg shadow-md">
              لا توجد بيانات للعرض
            </div>
          ) : (
            getPaginatedData().map((s, i) => (
              <div
                key={s._id}
                className="bg-white p-4 rounded-lg shadow-md border-l-4 border-[#41225f] cursor-pointer"
                onClick={() => setSelectedSupporter(s)}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#fa9e1b]">
                    <img
                      src={s.images?.[0]?.url || "/placeholder/50"}
                      className="w-full h-full object-cover"
                      alt="صورة"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg text-[#41225f]">
                        {s.name}
                      </h3>
                      <span className="text-sm text-gray-500">
                        #{(page - 1) * limit + i + 1}
                      </span>
                    </div>

                    <div className="mt-2">
                      <span className="px-2 py-1 rounded-full text-xs bg-[#41225f20] text-[#41225f]">
                        {getCategoryLabel(s.supportType)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                  <div>
                    <p className="text-gray-500">الهاتف</p>
                    <p>{s.phone || "-"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">الحالة</p>
                    <select
                      value={s.approved}
                      onChange={(e) =>
                        handleChangeStatus(s._id, e.target.value)
                      }
                      className={`border px-2 py-1 rounded-md focus:outline-none w-full ${getStatusColor(
                        s.approved
                      )}`}
                      style={{ borderColor: "#41225f" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="pending">قيد الانتظار</option>
                      <option value="approved">مقبولة</option>
                      <option value="rejected">مرفوضة</option>
                    </select>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 0 && (
          <div className="flex justify-center items-center gap-4 p-3 rounded-lg shadow-md bg-white">
            <div className="flex justify-center mt-8 gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
                className="px-4 py-2 rounded-lg disabled:opacity-50 text-white"
                style={{ backgroundColor: page === 1 ? "#a0a0a0" : "#31124b" }}
              >
                السابق
              </button>
              <span
                className="px-3 py-2 rounded-lg"
                style={{ backgroundColor: "#f5f5f5", color: "#31124b" }}
              >
                {`الصفحة ${page} من ${totalPages}`}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                className="px-4 py-2 rounded-lg disabled:opacity-50 text-white"
                style={{
                  backgroundColor: page === totalPages ? "#a0a0a0" : "#fa9e1b",
                }}
              >
                التالي
              </button>
            </div>

          </div>
        )}

        {/* Popup Modal */}
        {selectedSupporter && (
          <div className="fixed inset-0 bg-[#000000b7] bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-bold text-[#41225f]">
                  تفاصيل الجهة الداعمة
                </h3>
                <button
                  onClick={() => setSelectedSupporter(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6">
                <div className="flex flex-col items-center mb-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#fa9e1b] mb-3">
                    <img
                      src={
                        selectedSupporter.images?.[0]?.url || "/placeholder/50"
                      }
                      className="w-full h-full object-cover"
                      alt="صورة"
                    />
                  </div>
                  <h2 className="text-xl font-bold text-[#41225f]">
                    {selectedSupporter.name}
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-gray-500">نوع الجهة</p>
                    <p className="font-medium">
                      {getCategoryLabel(selectedSupporter.category)}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">نوع الدعم</p>
                    <p className="font-medium">
                      {getCategoryLabel(selectedSupporter.supportType)}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">المسؤول</p>
                    <p className="font-medium">
                      {selectedSupporter.contactPerson || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">رقم الهاتف</p>
                    <p className="font-medium">
                      {selectedSupporter.phone || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">البريد الإلكتروني</p>
                    <p className="font-medium">{selectedSupporter.email}</p>
                  </div>

                  <div>
                    <p className="text-gray-500">تاريخ التسجيل</p>
                    <p className="font-medium">
                      {new Date(
                        selectedSupporter.registeredAt
                      ).toLocaleDateString("ar-EG")}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">الحالة</p>
                    <select
                      value={selectedSupporter.approved}
                      onChange={(e) =>
                        handleChangeStatus(
                          selectedSupporter._id,
                          e.target.value
                        )
                      }
                      className={`border px-3 py-2 rounded-md focus:outline-none w-full ${getStatusColor(
                        selectedSupporter.approved
                      )}`}
                      style={{ borderColor: "#41225f" }}
                    >
                      <option value="pending">قيد الانتظار</option>
                      <option value="approved">مقبولة</option>
                      <option value="rejected">مرفوضة</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
