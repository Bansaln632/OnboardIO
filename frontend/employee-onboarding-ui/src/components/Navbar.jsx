import { logout, getRoleFromToken } from "../auth/authService";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import NotificationBell from "./NotificationBell";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsDropdownOpen(false);
  };

  const tokenRole = getRoleFromToken();
  const isLoggedIn = !!localStorage.getItem("token");
  const isAdmin = tokenRole === "ROLE_ADMIN";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Determine active tab
  const isActive = (path) => location.pathname === path;

  // Handle logo click - go to home if not logged in, dashboard if logged in
  const handleLogoClick = () => {
    if (isLoggedIn) {
      navigate(isAdmin ? "/admin" : "/user");
    } else {
      navigate("/");
    }
  };

  return (
    <nav className="bg-gradient-to-r from-primary-500 via-purple-600 to-pink-500 shadow-strong sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo/Brand */}
          <div className="flex items-center py-3">
            <button
              onClick={handleLogoClick}
              className="flex items-center gap-3 text-white hover:scale-105 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-md group-hover:bg-opacity-30 transition-all duration-300">
                <span className="text-2xl animate-bounce-soft">🚀</span>
              </div>
              <span className="text-2xl font-extrabold tracking-tight">OnboardIO</span>
            </button>
          </div>

          {/* Navigation Menu */}
          {isLoggedIn && (
            <div className="flex items-center gap-2">
              {/* Dashboard Button */}
              <button
                onClick={() => navigate(isAdmin ? "/admin" : "/user")}
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
                  isActive(isAdmin ? "/admin" : "/user")
                    ? 'bg-white text-primary-600 shadow-lg transform scale-105'
                    : 'bg-white bg-opacity-10 text-white hover:bg-opacity-20 backdrop-blur-sm'
                }`}
              >
                <span className="text-lg">📊</span>
                <span>Dashboard</span>
              </button>

              {/* Activities Button */}
              <button
                onClick={() => navigate("/activities")}
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
                  isActive("/activities")
                    ? 'bg-white text-primary-600 shadow-lg transform scale-105'
                    : 'bg-white bg-opacity-10 text-white hover:bg-opacity-20 backdrop-blur-sm'
                }`}
              >
                <span className="text-lg">⚡</span>
                <span>Activities</span>
              </button>
            </div>
          )}

          {/* Right side - About Us and User menu */}
          <div className="flex items-center gap-2">
            {/* About Us Button */}
            <button
              onClick={() => navigate("/about")}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
                isActive("/about")
                  ? 'bg-white text-primary-600 shadow-lg'
                  : 'bg-white bg-opacity-10 text-white hover:bg-opacity-20 backdrop-blur-sm'
              }`}
            >
              <span className="text-lg">ℹ️</span>
              <span>About</span>
            </button>

            {/* Notification Bell - Only for logged in users */}
            {isLoggedIn && (
              <div className="px-2">
                <NotificationBell />
              </div>
            )}

            {isLoggedIn && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="px-5 py-2.5 bg-white bg-opacity-10 hover:bg-opacity-20 backdrop-blur-sm text-white rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2"
                >
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-lg">{isAdmin ? "👨‍💼" : "👤"}</span>
                  </div>
                  <span>{isAdmin ? "Admin" : "User"}</span>
                  <span className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-strong py-2 animate-fade-in overflow-hidden border-2 border-primary-100">
                    <div className="px-4 py-3 border-b-2 border-gray-100 bg-gradient-to-r from-primary-50 to-purple-50">
                      <p className="text-sm font-semibold text-gray-700">Signed in as</p>
                      <p className="text-xs text-gray-600 mt-1">{isAdmin ? "Administrator" : "Employee"}</p>
                    </div>
                    <button
                      onClick={() => {
                        navigate("/notifications");
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-purple-50 transition-all duration-200 flex items-center gap-3 font-semibold"
                    >
                      <span className="text-xl">🔔</span>
                      <span>Notifications</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-200 flex items-center gap-3 font-semibold"
                    >
                      <span className="text-xl">🚪</span>
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

