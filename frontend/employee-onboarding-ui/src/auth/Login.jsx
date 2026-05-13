import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, getRoleFromToken } from "./authService";
import GoogleSignInButton from "./GoogleSignInButton";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await login({ email, password });
      const role = getRoleFromToken();
      console.log("Logged in with role:", role);
      navigate(role === "ROLE_ADMIN" ? "/admin" : "/user");
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data || err.message || "Login failed";
      console.log("Login error:", err?.response?.data?.message);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-purple-600 bg-clip-text text-transparent mb-2">
            Welcome Back!
          </h2>
          <p className="text-gray-600">Sign in to continue your journey</p>
        </div>

        {error && (
          <div className="alert alert-error animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              <span className="font-medium">{String(error)}</span>
            </div>
          </div>
        )}

        <div className="space-y-5">
          <div className="space-y-2">
            <label className="form-label flex items-center gap-2">
              <span className="text-lg">📧</span>
              Email Address
            </label>
            <input
              type="email"
              placeholder="your.email@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              className="form-input"
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <label className="form-label flex items-center gap-2">
              <span className="text-lg">🔒</span>
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="form-input pr-12"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading || !email || !password}
            className="btn btn-primary w-full text-lg flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="spinner w-5 h-5 border-2"></span>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>🚀</span>
                <span>Sign In</span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-semibold">Or continue with</span>
            </div>
          </div>

          {/* Google Sign-In Button */}
          <GoogleSignInButton />
        </div>

        <div className="text-center text-sm text-gray-600 pt-4">
          <p>Don't have an account? <span className="text-primary-600 font-semibold cursor-pointer hover:underline">Contact your HR</span></p>
        </div>
      </div>
    </div>
  );
}

export default Login;


