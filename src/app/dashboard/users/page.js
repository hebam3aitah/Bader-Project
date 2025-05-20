"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { unparse } from "papaparse";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `/api/Admin/users?role=${roleFilter}&search=${search}&page=${page}&limit=${limit}`
      );
      setUsers(res.data.users);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      toast.error("حدث خطأ أثناء جلب المستخدمين");
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, search, page]);

  const changeRole = async (userId, newRole) => {
    const result = await Swal.fire({
      title: "تأكيد التغيير",
      text: `هل أنت متأكد من تغيير الدور إلى "${newRole}"؟`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "نعم، غيّر الدور",
      cancelButtonText: "إلغاء",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.patch(`/api/Admin/users/${userId}/role`, { role: newRole });
      toast.success("تم تحديث الدور بنجاح", {
        position: "top-center", // أو "top-right", "bottom-left", إلخ
      });

      fetchUsers();
    } catch (error) {
      toast.error("حدث خطأ أثناء تحديث الدور", {
        position: "top-center", // أو "top-right", "bottom-left", إلخ
      });
      console.error("Error changing role:", error);
    }
  };

  const deleteUser = async (userId) => {
    const result = await Swal.fire({
      title: "تأكيد الحذف",
      text: "هل أنت متأكد من حذف هذا المستخدم؟",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "نعم، احذف",
      cancelButtonText: "إلغاء",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`/api/Admin/users/${userId}`);
      toast.success("تم حذف المستخدم بنجاح");
      fetchUsers();
    } catch (error) {
      toast.error("حدث خطأ أثناء حذف المستخدم");
      console.error("Error deleting user:", error);
    }
  };

  const exportToCSV = () => {
    const csv = unparse(
      users.map((u) => ({
        الاسم: u.name,
        "البريد الإلكتروني": u.email,
        الهاتف: u.phone,
        الدور: u.role,
        "عدد المشاريع المبلغ عنها": u.reportedProjectsCount,
        "عدد المشاريع التي تطوع فيها": u.volunteeredProjectsCount,
        "مجموع التبرعات": u.totalDonations,
      }))
    );
    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "users.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    const doc = new jsPDF({ orientation: "portrait", format: "a4" });
    doc.setFont("helvetica");
    autoTable(doc, {
      head: [
        [
          "الاسم",
          "البريد الإلكتروني",
          "الهاتف",
          "الدور",
          "عدد المشاريع المبلغ عنها",
          "عدد المشاريع التي تطوع فيها",
          "مجموع التبرعات",
        ],
      ],
      body: users.map((u) => [
        u.name,
        u.email,
        u.phone,
        u.role,
        u.reportedProjectsCount,
        u.volunteeredProjectsCount,
        u.totalDonations,
      ]),
      styles: { font: "helvetica", halign: "right" },
      headStyles: { fillColor: [22, 160, 133], textColor: 255 },
      margin: { top: 20 },
    });
    doc.save("users.pdf");
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="bg-gradient-to-r from-[#31124b] to-[#3c1c54] rounded-lg shadow-lg mb-6 p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {/* Title Section */}
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              لوحة إدارة المستخدمين
            </h1>
            <p className="text-gray-200 mt-1 text-sm md:text-base">
              إدارة وتنظيم بيانات المستخدمين
            </p>
          </div>

          {/* Export Buttons */}
          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={exportToCSV}
              className="flex-1 md:flex-none px-4 py-2 rounded-lg text-white font-medium 
                  bg-[#31124b] hover:bg-[#3c1c54] transition-colors duration-200
                  shadow-md shadow-[#19141d]/50"
            >
              تصدير CSV
            </button>
            <button
              onClick={exportToPDF}
              className="flex-1 md:flex-none px-4 py-2 rounded-lg text-white font-medium 
                  bg-[#fa9e1b] hover:bg-[#e68e17] transition-colors duration-200
                  shadow-md shadow-[#fa9e1b]/50"
            >
              تصدير PDF
            </button>
          </div>
        </div>
      </div>

      {/* شريط التصفية والبحث - تصميم مبسط */}
      <div className="mb-6 p-4 rounded-lg shadow bg-white">
        <div className="flex flex-col gap-4">
          {/* الصف العلوي: البحث والتصفية */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* حقل البحث */}
            <input
              type="text"
              placeholder="ابحث بالاسم أو البريد..."
              className="flex-1 border px-4 py-2 rounded-lg focus:outline-none focus:ring-1"
              style={{ borderColor: "#31124b", focusRing: "#fa9e1b" }}
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
            />

            {/* تصفية حسب الدور */}
            <select
              value={roleFilter}
              onChange={(e) => {
                setPage(1);
                setRoleFilter(e.target.value);
              }}
              className="flex-1 sm:flex-none sm:w-48 border px-4 py-2 rounded-lg focus:outline-none focus:ring-1"
              style={{ borderColor: "#31124b", focusRing: "#fa9e1b" }}
            >
              <option value="all">الكل</option>
              <option value="user">مستخدم</option>
              <option value="volunteer">متطوع</option>
              <option value="admin">أدمن</option>
              <option value="donor">متبرع</option>
              <option value="supporter">داعم</option>
            </select>
          </div>
        </div>
      </div>

      {/* بطاقات المستخدمين */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <div
            key={user._id}
            className="p-4 rounded-lg shadow bg-white border-r-4 hover:shadow-lg transition-shadow"
            style={{ borderRightColor: "#fa9e1b" }}
          >
            <h3 className="font-bold text-lg mb-2" style={{ color: "#31124b" }}>
              {user.name}
            </h3>
            <div className="space-y-2 text-gray-700">
              <p className="flex items-center">
                <span>{user.email}</span>
              </p>
              <p className="flex items-center">
                <span>{user.phone}</span>
              </p>
              <p className="flex items-center">
                <span>الدور: </span>
                <select
                  value={user.role}
                  onChange={(e) => changeRole(user._id, e.target.value)}
                  className="mr-2 border rounded-lg px-2 py-1 focus:outline-none"
                  style={{ borderColor: "#31124b" }}
                >
                  {["user", "volunteer", "admin", "donor", "supporter"].map(
                    (r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    )
                  )}
                </select>
              </p>
              <p className="flex items-center">
                <span>
                  عدد المشاريع المبلغ عنها: {user.reportedProjectsCount}
                </span>
              </p>
              <p className="flex items-center">
                <span>
                  عدد المشاريع التي تطوع فيها: {user.volunteeredProjectsCount}
                </span>
              </p>
              <p className="flex items-center">
                <span>
                  مجموع التبرعات: {user.totalDonations.toLocaleString()} دينار
                  أردني
                </span>
              </p>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => deleteUser(user._id)}
                className="px-3 py-1 rounded-lg text-white"
                style={{ backgroundColor: "#31124b" }}
              >
                حذف
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ترقيم الصفحات */}
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
  );
}
