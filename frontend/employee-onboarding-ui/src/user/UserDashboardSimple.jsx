import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

function UserDashboard() {
  const navigate = useNavigate();
  const [onboarding, setOnboarding] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOnboarding();
  }, []);

  const fetchOnboarding = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/user/onboarding");
      setOnboarding(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load onboarding");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 animate-fade-in">
          <div className="spinner w-16 h-16 border-4"></div>
          <p className="text-xl text-gray-600 font-medium">Loading your onboarding status...</p>
        </div>
      </div>
    );
  }

  // If there's an error and no onboarding data, show error state
  if (error && !onboarding.id) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-strong p-12 max-w-2xl text-center border-4 border-red-200 animate-fade-in">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-5xl">⚠️</span>
          </div>
          <h2 className="text-3xl font-bold text-red-600 mb-4">Onboarding Not Found</h2>
          <p className="text-lg text-gray-700 mb-3 font-semibold">{error}</p>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Your onboarding record hasn't been created yet. Please contact your HR administrator or try refreshing the page.
          </p>
          <button
            className="btn btn-primary text-lg"
            onClick={() => window.location.reload()}
          >
            🔄 Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // Calculate progress color
  const progressPercentage = onboarding.progress || 0;
  let progressColorClass = "from-red-500 to-orange-500";
  if (progressPercentage >= 75) progressColorClass = "from-green-500 to-emerald-500";
  else if (progressPercentage >= 50) progressColorClass = "from-blue-500 to-cyan-500";
  else if (progressPercentage >= 25) progressColorClass = "from-yellow-500 to-orange-500";

  // Status color
  const getStatusBadge = (status) => {
    if (status === "COMPLETED") return "badge-success";
    if (status === "IN_PROGRESS") return "badge-info";
    return "badge-warning";
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-8">
        {error && (
          <div className="alert alert-error">
            <span className="text-xl">⚠️</span>
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Hero Welcome Section */}
        <div className="relative overflow-hidden rounded-3xl shadow-strong">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-purple-600 to-pink-500"></div>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
          </div>
          <div className="relative p-8 sm:p-12 text-white">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                    <span className="text-4xl">🎉</span>
                  </div>
                  <div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold">Welcome Aboard!</h1>
                    <p className="text-xl opacity-90 mt-1">Let's complete your journey</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white bg-opacity-15 backdrop-blur-md rounded-xl px-6 py-3 inline-block">
                  <span className="text-2xl">👤</span>
                  <div>
                    <p className="text-sm opacity-75">Employee</p>
                    <p className="text-lg font-bold">{onboarding.employeeUsername || "N/A"}</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className={`badge ${getStatusBadge(onboarding.status)} text-lg px-4 py-2`}>
                  {onboarding.status ? onboarding.status.replace(/_/g, " ") : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Progress Card */}
          <div className="stat-card animate-slide-in-right bg-gradient-to-br from-white to-primary-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider">Overall Progress</h3>
              <span className="text-3xl">📊</span>
            </div>
            <div className="stat-value mb-4">{onboarding.progress || 0}%</div>
            <div className="progress-bar h-4 bg-gray-200">
              <div
                className={`progress-fill h-full rounded-full bg-gradient-to-r ${progressColorClass}`}
                style={{ width: `${onboarding.progress || 0}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 mt-3">
              {progressPercentage >= 75 ? "Almost there! 🎯" : 
               progressPercentage >= 50 ? "Great progress! 💪" :
               progressPercentage >= 25 ? "Keep going! 🚀" : "Let's get started! ⚡"}
            </p>
          </div>

          {/* HR Assignment Card */}
          <div className="stat-card animate-slide-in-right bg-gradient-to-br from-white to-purple-50" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider">Assigned HR</h3>
              <span className="text-3xl">👨‍💼</span>
            </div>
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {onboarding.assignedHrUsername || "Awaiting Assignment"}
            </div>
            <p className="text-sm text-gray-600">
              {onboarding.assignedHrUsername ? "Your dedicated HR contact" : "Will be assigned soon"}
            </p>
          </div>

          {/* Status Info Card */}
          <div className="stat-card animate-slide-in-right bg-gradient-to-br from-white to-pink-50" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider">Current Phase</h3>
              <span className="text-3xl">🎯</span>
            </div>
            <div className="text-2xl font-bold text-pink-600 mb-2">
              {onboarding.status === "COMPLETED" ? "Completed" : 
               onboarding.status === "IN_PROGRESS" ? "In Progress" : "Not Started"}
            </div>
            <p className="text-sm text-gray-600">
              {onboarding.status === "COMPLETED" ? "All tasks complete! 🎊" : "Continue with activities"}
            </p>
          </div>
        </div>

        {/* Action Steps Guide */}
        <div className="card card-hover bg-gradient-to-br from-white to-blue-50 border-2 border-blue-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📋</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Your Onboarding Roadmap</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {[
              { icon: "✅", title: "Complete Tasks", desc: "Finish all assigned tasks to progress", color: "from-blue-500 to-cyan-500" },
              { icon: "📚", title: "Training Programs", desc: "Complete required training modules", color: "from-purple-500 to-pink-500" },
              { icon: "📄", title: "Upload Documents", desc: "Submit all required documentation", color: "from-green-500 to-emerald-500" },
              { icon: "🎯", title: "Get Approval", desc: "Await admin approval to complete", color: "from-orange-500 to-red-500" }
            ].map((step, index) => (
              <div 
                key={index}
                className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-soft hover:shadow-medium transition-all duration-300 transform hover:translate-x-2"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${step.color} rounded-lg flex items-center justify-center flex-shrink-0 shadow-md`}>
                  <span className="text-2xl">{step.icon}</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-1">{step.title}</h4>
                  <p className="text-sm text-gray-600">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate("/activities")}
            className="btn btn-primary text-lg w-full sm:w-auto"
          >
            <span>⚡</span> Go to Activities
          </button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: "📋", title: "Tasks & Trainings", desc: "View and complete activities", path: "/activities" },
            { icon: "📄", title: "Upload Documents", desc: "Submit required files", path: "/activities" },
            { icon: "ℹ️", title: "About OnboardIO", desc: "Learn more about us", path: "/about" }
          ].map((link, index) => (
            <div
              key={index}
              onClick={() => navigate(link.path)}
              className="card card-hover cursor-pointer bg-gradient-to-br from-white to-gray-50 text-center group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                <span className="text-3xl">{link.icon}</span>
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-2">{link.title}</h4>
              <p className="text-sm text-gray-600">{link.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;

