import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, getRoleFromToken } from "./authService";
import GoogleSignInButton from "./GoogleSignInButton";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
      <div className="bg-white rounded-lg shadow-soft p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Welcome Back</h2>

        {error && (
          <div className="bg-error-light text-error-dark px-4 py-3 rounded-md mb-4 text-sm">
            {String(error)}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="form-label">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="form-input"
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="btn btn-primary w-full mt-6"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Google Sign-In Button */}
          <GoogleSignInButton />
        </div>
      </div>
    </div>
  );
}

export default Login;


