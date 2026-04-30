import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getRoleFromToken } from "./auth/authService";
import Login from "./auth/Login";
import Signup from "./auth/Signup";

function Home() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabParam === "signup" ? "signup" : "login");
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    if (tabParam === "signup" || tabParam === "login") {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  // Redirect logged-in users to their dashboard
  useEffect(() => {
    if (isLoggedIn) {
      const role = getRoleFromToken();
      const targetPath = role === "ROLE_ADMIN" ? "/admin" : "/user";
      navigate(targetPath, { replace: true });
    }
  }, [isLoggedIn, navigate]);

  if (isLoggedIn) {
    return null; // Prevent flash of login page
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl w-full items-center">
        {/* Left Section - Welcome */}
        <div className="text-gray-800">
          <h1 className="text-6xl font-bold mb-3 bg-gradient-to-r from-primary-500 to-purple-600 bg-clip-text text-transparent">
            🚀 OnboardIO
          </h1>
          <p className="text-3xl text-purple-600 mb-8">
            Employee Onboarding Made Easy
          </p>

          <div className="flex flex-col gap-4 mb-8">
            <div className="flex items-center gap-3">
              <span className="text-2xl text-success font-bold">✓</span>
              <span className="text-lg text-gray-600">Seamless task management</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl text-success font-bold">✓</span>
              <span className="text-lg text-gray-600">Document tracking & approval</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl text-success font-bold">✓</span>
              <span className="text-lg text-gray-600">Progress monitoring</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl text-success font-bold">✓</span>
              <span className="text-lg text-gray-600">HR management tools</span>
            </div>
          </div>

          <p className="text-base text-gray-600 leading-relaxed">
            Join our platform today and get started with your onboarding journey!
          </p>
        </div>

        {/* Right Section - Auth Forms */}
        <div className="bg-white rounded-2xl shadow-strong overflow-hidden">
          <div className="flex gap-0 bg-gray-100 p-2">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 ${
                activeTab === "login"
                  ? 'bg-white text-primary-500 shadow-soft'
                  : 'bg-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              🔐 Login
            </button>
            <button
              onClick={() => setActiveTab("signup")}
              className={`flex-1 py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 ${
                activeTab === "signup"
                  ? 'bg-white text-primary-500 shadow-soft'
                  : 'bg-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              ✍️ Sign Up
            </button>
          </div>

          <div className="p-8">
            {activeTab === "login" ? <Login /> : <Signup />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

