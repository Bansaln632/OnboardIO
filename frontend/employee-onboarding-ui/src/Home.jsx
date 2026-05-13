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
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-soft"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-soft" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-soft" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-7xl w-full items-center relative z-10">
        {/* Left Section - Hero Content */}
        <div className="text-gray-800 space-y-8 animate-fade-in">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-12 transition-transform duration-300">
                <span className="text-3xl">🚀</span>
              </div>
              <h1 className="text-6xl font-extrabold bg-gradient-to-r from-primary-500 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                OnboardIO
              </h1>
            </div>
            <p className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text mb-4">
              Employee Onboarding
            </p>
            <p className="text-xl text-gray-600 font-medium">
              Made Simple, Smart & Seamless
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: "✨", text: "Seamless task management", color: "from-blue-500 to-cyan-500" },
              { icon: "📄", text: "Document tracking & approval", color: "from-green-500 to-emerald-500" },
              { icon: "📊", text: "Real-time progress monitoring", color: "from-purple-500 to-pink-500" },
              { icon: "🎯", text: "Advanced HR management tools", color: "from-orange-500 to-red-500" }
            ].map((feature, index) => (
              <div 
                key={index}
                className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-soft hover:shadow-medium transition-all duration-300 transform hover:translate-x-2 animate-slide-in-right"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center text-2xl shadow-md`}>
                  {feature.icon}
                </div>
                <span className="text-lg font-semibold text-gray-700">{feature.text}</span>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-primary-50 to-purple-50 p-6 rounded-2xl border-2 border-primary-200">
            <p className="text-base text-gray-700 leading-relaxed">
              <span className="font-bold text-primary-600">Join thousands of companies</span> streamlining their onboarding process. Get started today and experience the future of employee integration!
            </p>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center gap-8 pt-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">10K+</div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">500+</div>
              <div className="text-sm text-gray-600">Companies</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600">99%</div>
              <div className="text-sm text-gray-600">Satisfaction</div>
            </div>
          </div>
        </div>

        {/* Right Section - Auth Forms */}
        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="glass rounded-3xl shadow-strong overflow-hidden border-2 border-white">
            <div className="flex gap-0 bg-gradient-to-r from-primary-500 to-purple-600 p-1">
              <button
                onClick={() => setActiveTab("login")}
                className={`flex-1 py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 ${
                  activeTab === "login"
                    ? 'bg-white text-primary-600 shadow-lg'
                    : 'bg-transparent text-white hover:bg-white hover:bg-opacity-20'
                }`}
              >
                <span className="mr-2">🔐</span> Login
              </button>
              <button
                onClick={() => setActiveTab("signup")}
                className={`flex-1 py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 ${
                  activeTab === "signup"
                    ? 'bg-white text-primary-600 shadow-lg'
                    : 'bg-transparent text-white hover:bg-white hover:bg-opacity-20'
                }`}
              >
                <span className="mr-2">✍️</span> Sign Up
              </button>
            </div>

            <div className="p-8 bg-white bg-opacity-90">
              {activeTab === "login" ? <Login /> : <Signup />}
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>🔒 Your data is secure and encrypted</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
