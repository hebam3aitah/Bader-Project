// "use client";
// import { useEffect, useState } from "react";

// export default function AdminDonationsPage() {
//   const [donations, setDonations] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch("/api/Admin/donations")
//       .then((res) => res.json())
//       .then((data) => {
//         setDonations(data);
//         setLoading(false);
//       });
//   }, []);

//   const exportToCSV = () => {
//     const csvRows = [];
//     // Header
//     csvRows.push("الاسم,البريد,المبلغ,الطريقة,النوع,التاريخ");

//     donations.forEach((d) => {
//       const name = d.donor?.name || "غير معروف";
//       const email = d.donor?.email || "-";
//       const amount = d.amount;
//       const method = d.method;
//       const type = d.isGeneral
//         ? "تبرع عام"
//         : d.project
//         ? `مشروع: ${d.project.title}`
//         : d.organization
//         ? `جهة: ${d.organization.name}`
//         : "غير محدد";
//       const date = new Date(d.donatedAt).toLocaleString();

//       csvRows.push(
//         `"${name}","${email}",${amount},"${method}","${type}","${date}"`
//       );
//     });

//     const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement("a");
//     link.setAttribute("href", encodedUri);
//     link.setAttribute("download", "donations.csv");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   if (loading) return <p>جاري تحميل التبرعات...</p>;

//   return (
//     <div className="p-4">
//       <div className="flex items-center justify-between mb-4">
//         <h1 className="text-xl font-bold">قائمة التبرعات</h1>
//         <button
//           onClick={exportToCSV}
//           className="bg-green-600 hover:bg-green-700 text-white py-1 px-4 rounded"
//         >
//           تصدير Excel
//         </button>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="min-w-full border text-sm text-right">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="border px-3 py-2">الاسم</th>
//               <th className="border px-3 py-2">البريد</th>
//               <th className="border px-3 py-2">المبلغ</th>
//               <th className="border px-3 py-2">الطريقة</th>
//               <th className="border px-3 py-2">النوع</th>
//               <th className="border px-3 py-2">التاريخ</th>
//             </tr>
//           </thead>
//           <tbody>
//             {donations.map((donation) => (
//               <tr key={donation._id} className="hover:bg-gray-50">
//                 <td className="border px-3 py-2">
//                   {donation.donor?.name || "غير معروف"}
//                 </td>
//                 <td className="border px-3 py-2">{donation.donor?.email}</td>
//                 <td className="border px-3 py-2">{donation.amount}</td>
//                 <td className="border px-3 py-2">{donation.method}</td>
//                 <td className="border px-3 py-2">
//                   {donation.isGeneral
//                     ? "تبرع عام"
//                     : donation.project
//                     ? `مشروع: ${donation.project.title}`
//                     : donation.organization
//                     ? `جهة: ${donation.organization.name}`
//                     : "غير محدد"}
//                 </td>
//                 <td className="border px-3 py-2">
//                   {new Date(donation.donatedAt).toLocaleString()}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
"use client";
import { useEffect, useState } from "react";

export default function AdminDonationsPage() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "donatedAt",
    direction: "desc",
  });
  const [stats, setStats] = useState({
    total: 0,
    generalCount: 0,
    projectCount: 0,
    organizationCount: 0,
  });

  useEffect(() => {
    fetch("/api/Admin/donations")
      .then((res) => res.json())
      .then((data) => {
        setDonations(data);
        setLoading(false);

        // Calculate statistics
        const totalAmount = data.reduce((sum, d) => sum + d.amount, 0);
        const generalCount = data.filter((d) => d.isGeneral).length;
        const projectCount = data.filter((d) => d.project).length;
        const organizationCount = data.filter((d) => d.organization).length;

        setStats({
          total: totalAmount,
          generalCount,
          projectCount,
          organizationCount,
        });
      });
  }, []);

  const exportToCSV = () => {
    const csvRows = [];
    // Header
    csvRows.push("الاسم,البريد,المبلغ,الطريقة,النوع,التاريخ");

    filteredDonations.forEach((d) => {
      const name = d.donor?.name || "غير معروف";
      const email = d.donor?.email || "-";
      const amount = d.amount;
      const method = d.method;
      const type = d.isGeneral
        ? "تبرع عام"
        : d.project
        ? `مشروع: ${d.project.title}`
        : d.organization
        ? `جهة: ${d.organization.name}`
        : "غير محدد";
      const date = new Date(d.donatedAt).toLocaleString();

      csvRows.push(
        `"${name}","${email}",${amount},"${method}","${type}","${date}"`
      );
    });

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "donations.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortedData = (data) => {
    const sortableData = [...data];
    sortableData.sort((a, b) => {
      if (sortConfig.key === "donatedAt") {
        return sortConfig.direction === "asc"
          ? new Date(a.donatedAt) - new Date(b.donatedAt)
          : new Date(b.donatedAt) - new Date(a.donatedAt);
      }

      if (sortConfig.key === "amount") {
        return sortConfig.direction === "asc"
          ? a.amount - b.amount
          : b.amount - a.amount;
      }

      if (sortConfig.key === "donor") {
        const nameA = a.donor?.name || "غير معروف";
        const nameB = b.donor?.name || "غير معروف";
        return sortConfig.direction === "asc"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      }

      return 0;
    });

    return sortableData;
  };

  const getFilteredData = (data) => {
    return data.filter((donation) => {
      // Apply type filter
      if (filterType !== "all") {
        if (filterType === "general" && !donation.isGeneral) return false;
        if (filterType === "project" && !donation.project) return false;
        if (filterType === "organization" && !donation.organization)
          return false;
      }

      // Apply search filter
      if (searchTerm) {
        const donorName = donation.donor?.name?.toLowerCase() || "";
        const donorEmail = donation.donor?.email?.toLowerCase() || "";
        const projectTitle = donation.project?.title?.toLowerCase() || "";
        const orgName = donation.organization?.name?.toLowerCase() || "";

        return (
          donorName.includes(searchTerm.toLowerCase()) ||
          donorEmail.includes(searchTerm.toLowerCase()) ||
          projectTitle.includes(searchTerm.toLowerCase()) ||
          orgName.includes(searchTerm.toLowerCase())
        );
      }

      return true;
    });
  };

  // Apply filters and sorting
  const filteredDonations = getSortedData(getFilteredData(donations));

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return "↕️";
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("ar-JO", {
      style: "currency",
      currency: "JOD",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-middle text-primary"></div>
          <p className="mt-2 text-lg">جاري تحميل التبرعات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen" dir="rtl">
      
       <div className="bg-gradient-to-r from-[#31124b] to-[#3c1c54] rounded-lg shadow-lg mb-6 p-6">
        <h1 className="text-3xl font-bold text-white"> لوحة إدارة التبرعات
</h1>
        <p className="text-gray-200 mt-1">إدارة وتنظيم التبرعات  </p>
      </div>


      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div
          className="bg-white rounded-lg shadow p-4 border-r-4"
          style={{ borderColor: "#31124b" }}
        >
          <h3 className="text-lg font-medium text-gray-500">إجمالي التبرعات</h3>
          <p className="text-2xl font-bold mt-2" style={{ color: "#31124b" }}>
            {formatCurrency(stats.total)}
          </p>
        </div>
        <div
          className="bg-white rounded-lg shadow p-4 border-r-4"
          style={{ borderColor: "#fa9e1b" }}
        >
          <h3 className="text-lg font-medium text-gray-500">تبرعات عامة</h3>
          <p className="text-2xl font-bold mt-2" style={{ color: "#fa9e1b" }}>
            {stats.generalCount}
          </p>
        </div>
        <div
          className="bg-white rounded-lg shadow p-4 border-r-4"
          style={{ borderColor: "#31124b" }}
        >
          <h3 className="text-lg font-medium text-gray-500">تبرعات المشاريع</h3>
          <p className="text-2xl font-bold mt-2" style={{ color: "#31124b" }}>
            {stats.projectCount}
          </p>
        </div>
        <div
          className="bg-white rounded-lg shadow p-4 border-r-4"
          style={{ borderColor: "#fa9e1b" }}
        >
          <h3 className="text-lg font-medium text-gray-500">تبرعات الجهات</h3>
          <p className="text-2xl font-bold mt-2" style={{ color: "#fa9e1b" }}>
            {stats.organizationCount}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="w-full md:w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              بحث
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث عن اسم المتبرع، البريد، المشروع..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50"
              style={{ focusRing: "#31124b" }}
            />
          </div>
          <div className="w-full md:w-1/4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              تصفية حسب النوع
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50"
              style={{ focusRing: "#31124b" }}
            >
              <option value="all">جميع التبرعات</option>
              <option value="general">تبرعات عامة</option>
              <option value="project">تبرعات المشاريع</option>
              <option value="organization">تبرعات الجهات</option>
            </select>
          </div>
          <div className="w-full md:w-1/4 flex items-end">
            <button
              onClick={exportToCSV}
              className="w-full py-2 px-4 rounded font-medium text-white transition duration-300"
              style={{
                backgroundColor: "#fa9e1b",
                hover: { backgroundColor: "#e08c0f" },
              }}
            >
              <span className="flex items-center justify-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                تصدير  CSV
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr style={{ backgroundColor: "#31124b", color: "white" }}>
                <th
                  className="px-4 py-3 text-right cursor-pointer"
                  onClick={() => handleSort("donor")}
                >
                  <div className="flex items-center justify-between">
                    <span>المتبرع</span>
                    <span className="text-xs">{getSortIcon("donor")}</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-right">البريد الإلكتروني</th>
                <th
                  className="px-4 py-3 text-right cursor-pointer"
                  onClick={() => handleSort("amount")}
                >
                  <div className="flex items-center justify-between">
                    <span>المبلغ</span>
                    <span className="text-xs">{getSortIcon("amount")}</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-right">طريقة الدفع</th>
                <th className="px-4 py-3 text-right">نوع التبرع</th>
                <th
                  className="px-4 py-3 text-right cursor-pointer"
                  onClick={() => handleSort("donatedAt")}
                >
                  <div className="flex items-center justify-between">
                    <span>تاريخ التبرع</span>
                    <span className="text-xs">{getSortIcon("donatedAt")}</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredDonations.length > 0 ? (
                filteredDonations.map((donation, index) => (
                  <tr
                    key={donation._id || index}
                    className={`border-b hover:bg-gray-50 ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium" style={{ color: "#31124b" }}>
                        {donation.donor?.name || "غير معروف"}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {donation.donor?.email || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="font-medium"
                        style={{ color: "#fa9e1b" }}
                      >
                        {formatCurrency(donation.amount)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2 py-1 rounded-full text-xs"
                        style={{
                          backgroundColor:
                            donation.method === "بطاقة ائتمان"
                              ? "#e6f7ff"
                              : donation.method === "تحويل بنكي"
                              ? "#f6ffed"
                              : donation.method === "نقدًا"
                              ? "#fff7e6"
                              : "#f9f0ff",
                          color:
                            donation.method === "بطاقة ائتمان"
                              ? "#1890ff"
                              : donation.method === "تحويل بنكي"
                              ? "#52c41a"
                              : donation.method === "نقدًا"
                              ? "#fa8c16"
                              : "#722ed1",
                        }}
                      >
                        {donation.method}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {donation.isGeneral ? (
                        <span className="text-green-600">تبرع عام</span>
                      ) : donation.project ? (
                        <span className="text-blue-600">
                          مشروع: {donation.project.title}
                        </span>
                      ) : donation.organization ? (
                        <span className="text-purple-600">
                          جهة: {donation.organization.name}
                        </span>
                      ) : (
                        <span className="text-gray-500">غير محدد</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(donation.donatedAt).toLocaleString("ar-EG", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    لا توجد تبرعات تطابق معايير البحث
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer/pagination could be added here */}
        <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t">
          <div className="text-sm text-gray-700">
            عرض <span className="font-medium">{filteredDonations.length}</span>{" "}
            من إجمالي <span className="font-medium">{donations.length}</span>{" "}
            تبرع
          </div>
        </div>
      </div>
    </div>
  );
}
