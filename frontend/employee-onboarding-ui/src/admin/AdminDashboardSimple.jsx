import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

function AdminDashboard() {
  const navigate = useNavigate();
  const [onboardings, setOnboardings] = useState([]);
  const [loadingOnboardings, setLoadingOnboardings] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    fetchOnboardings();
  }, []);

  const fetchOnboardings = async () => {
    setError(null);
    setLoadingOnboardings(true);
    try {
      const res = await api.get("/api/admin/onboarding");
      const data = res.data || [];
      setOnboardings(data);
    } catch (err) {
      const m = err?.response?.data?.message || err.message || "Failed to load onboardings";
      setError(m);
    } finally {
      setLoadingOnboardings(false);
    }
  };

  // Filter onboardings
  const filteredOnboardings = onboardings.filter(o => {
    const matchesSearch = o.employeeUsername?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         o.assignedHrUsername?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredOnboardings.length / pageSize));
  const pagedOnboardings = filteredOnboardings.slice((page - 1) * pageSize, page * pageSize);

  const getStatusBadge = (status) => {
    if (status === "COMPLETED") return "badge-success";
    if (status === "IN_PROGRESS") return "badge-warning";
    return "badge-error";
  };

  const getProgressColor = (progress) => {
    if (progress >= 75) return "from-green-500 to-emerald-500";
    if (progress >= 50) return "from-blue-500 to-cyan-500";
    if (progress >= 25) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-orange-500";
  };

  // Calculate stats
  const stats = {
    total: onboardings.length,
    completed: onboardings.filter(o => o.status === "COMPLETED").length,
    inProgress: onboardings.filter(o => o.status === "IN_PROGRESS").length,
    notStarted: onboardings.filter(o => o.status === "NOT_STARTED").length,
    avgProgress: onboardings.length > 0 
      ? Math.round(onboardings.reduce((acc, o) => acc + (o.progress || 0), 0) / onboardings.length)
      : 0
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-3xl shadow-strong">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-purple-600 to-pink-500"></div>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
          </div>
          <div className="relative p-8 text-white">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                <span className="text-4xl">📊</span>
              </div>
              <div>
                <h1 className="text-4xl sm:text-5xl font-extrabold">Admin Dashboard</h1>
                <p className="text-xl opacity-90 mt-1">Manage employee onboardings</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {[
            { label: "Total Employees", value: stats.total, icon: "👥", color: "from-blue-500 to-cyan-500" },
            { label: "Completed", value: stats.completed, icon: "✅", color: "from-green-500 to-emerald-500" },
            { label: "In Progress", value: stats.inProgress, icon: "⏳", color: "from-yellow-500 to-orange-500" },
            { label: "Not Started", value: stats.notStarted, icon: "⭕", color: "from-red-500 to-pink-500" },
            { label: "Avg Progress", value: `${stats.avgProgress}%`, icon: "📈", color: "from-purple-500 to-pink-500" }
          ].map((stat, index) => (
            <div 
              key={index}
              className="card bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-slide-in-right"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider">{stat.label}</h3>
                <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center shadow-md`}>
                  <span className="text-xl">{stat.icon}</span>
                </div>
              </div>
              <p className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-purple-600 bg-clip-text text-transparent">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert alert-error">
            <span className="text-xl">⚠️</span>
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Filters and Search */}
        <div className="card bg-white">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="🔍 Search by employee or HR name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input pl-12"
                />
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl">🔍</span>
              </div>
            </div>
            <div className="flex gap-3 w-full lg:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="form-input flex-1 lg:flex-none"
              >
                <option value="ALL">All Status</option>
                <option value="COMPLETED">Completed</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="NOT_STARTED">Not Started</option>
              </select>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="form-input flex-1 lg:flex-none"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>
          </div>
        </div>

        {/* Onboardings Section */}
        <div className="card bg-white">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <span className="text-3xl">📋</span>
              Employee Onboardings
              <span className="text-lg text-gray-500 font-normal">({filteredOnboardings.length})</span>
            </h2>
            <div className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </div>
          </div>

          {loadingOnboardings ? (
            <div className="text-center py-20">
              <div className="spinner w-16 h-16 border-4 mx-auto mb-4"></div>
              <p className="text-xl text-gray-600 font-medium">Loading onboardings...</p>
            </div>
          ) : filteredOnboardings.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-gray-300 rounded-xl">
              <span className="text-6xl mb-4 block">📭</span>
              <p className="text-xl text-gray-600 font-medium">No onboardings found</p>
              <p className="text-gray-500 mt-2">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pagedOnboardings.map((o, index) => (
                <div 
                  key={o.id}
                  className="border-2 border-gray-100 rounded-2xl p-6 hover:border-primary-300 hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-white to-gray-50 animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                          <span className="text-2xl">👤</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-800 mb-2">
                            {o.employeeUsername || "(No name)"}
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">👨‍💼</span>
                              <div>
                                <p className="text-gray-500 text-xs">HR Contact</p>
                                <p className="font-semibold text-gray-700">{o.assignedHrUsername || "Unassigned"}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-lg">📊</span>
                              <div>
                                <p className="text-gray-500 text-xs">Progress</p>
                                <p className="font-bold text-primary-600">{o.progress}%</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-lg">🎯</span>
                              <div>
                                <p className="text-gray-500 text-xs">Status</p>
                                <span className={`badge ${getStatusBadge(o.status)}`}>
                                  {o.status?.replace(/_/g, " ")}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="lg:w-64">
                      <div className="progress-bar h-3 bg-gray-200">
                        <div
                          className={`progress-fill h-full rounded-full bg-gradient-to-r ${getProgressColor(o.progress)}`}
                          style={{ width: `${o.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-600 mt-2 text-center font-medium">
                        {o.progress >= 75 ? "Almost complete! 🎯" : 
                         o.progress >= 50 ? "Good progress 💪" :
                         o.progress >= 25 ? "Getting started 🚀" : "Just beginning ⚡"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {filteredOnboardings.length > 0 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t-2 border-gray-100">
              <div className="text-sm text-gray-600">
                Showing {Math.min((page - 1) * pageSize + 1, filteredOnboardings.length)} to {Math.min(page * pageSize, filteredOnboardings.length)} of {filteredOnboardings.length} results
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn btn-secondary text-sm"
                >
                  ← Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="btn btn-primary text-sm"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
