import { logout, getRoleFromToken } from "../auth/authService";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsDropdownOpen(false);
  };

  const tokenRole = getRoleFromToken();
  const isLoggedIn = !!localStorage.getItem("token");
  const isAdmin = tokenRole === "ROLE_ADMIN";

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
    <nav className="bg-gradient-to-r from-primary-500 to-purple-600 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <button
              onClick={handleLogoClick}
              className="text-2xl font-bold text-white hover:scale-105 transition-transform duration-300"
            >
              🚀 OnboardIO
            </button>
          </div>

          {/* Navigation Menu */}
          {isLoggedIn && (
            <div className="flex items-center gap-3">
              {/* Dashboard Button */}
              <button
                onClick={() => navigate(isAdmin ? "/admin" : "/user")}
                className={`btn btn-primary px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive(isAdmin ? "/admin" : "/user")
                    ? 'bg-white bg-opacity-25 border-b-3 border-yellow-400 text-white'
                    : 'bg-white bg-opacity-10 text-white hover:bg-opacity-20'
                }`}
              >
                📊 Dashboard
              </button>

              {/* Activities Button */}
              <button
                onClick={() => navigate("/activities")}
                className={`btn btn-primary px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive("/activities")
                    ? 'bg-white bg-opacity-25 border-b-3 border-yellow-400 text-white'
                    : 'bg-white bg-opacity-10 text-white hover:bg-opacity-20'
                }`}
              >
                ⚡ Activities
              </button>
            </div>
          )}

          {/* Right side - About Us and User menu */}
          <div className="flex items-center gap-3">
            {/* About Us Button */}
            <button
              onClick={() => navigate("/about")}
              className={`btn btn-primary px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive("/about")
                  ? 'bg-white bg-opacity-25 text-white'
                  : 'bg-white bg-opacity-10 text-white hover:bg-opacity-20'
              }`}
            >
              ℹ️ About Us
            </button>

            {isLoggedIn && (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="btn btn-primary rounded-lg font-medium hover:bg-opacity-20 transition-all duration-200"
                >
                  👤 {isAdmin ? "Admin" : "User"} ▼
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-strong py-2 animate-fade-in">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      🚪 Logout
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

