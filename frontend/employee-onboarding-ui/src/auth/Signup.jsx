import { useState } from "react";
import { signup } from "./authService";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";

function Signup() {
  const navigate = useNavigate();
  const { showSuccess } = useToast();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    contactNo: "",
    profile: "REGULAR",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validation, setValidation] = useState({});

  // validation helpers
  const emailValid = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const passwordValid = (pw) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(pw);
  };

  const normalizePhone = (value) => {
    if (!value) return "";
    const digits = value.replace(/\D+/g, "");
    if (!digits) return "";
    return `+${digits}`;
  };

  const handleChange = (field, value) => {
    if (field === "contactNo") {
      value = normalizePhone(value);
    }
    setForm((f) => ({ ...f, [field]: value }));

    if (field === "email") setValidation((v) => ({ ...v, email: emailValid(value) }));
    if (field === "password") setValidation((v) => ({ ...v, password: passwordValid(value) }));
  };

  const handleSubmit = async () => {
    setError(null);
    const { username, email, password, contactNo } = form;
    if (!username || !email || !password) {
      setError("Username, email and password are required");
      return;
    }
    if (!emailValid(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!passwordValid(password)) {
      setError("Password must be at least 8 characters and include uppercase, lowercase, number and special character");
      return;
    }
    if (contactNo && normalizePhone(contactNo).length < 4) {
      setError("Please enter a valid contact number");
      return;
    }

    setLoading(true);
    try {
      // Send form without employeeId; backend will generate it
      await signup(form);
      showSuccess("Signup successful — please log in");
      navigate("/login");
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-purple-600 bg-clip-text text-transparent mb-2">
            Join OnboardIO
          </h2>
          <p className="text-gray-600">Create your account and get started</p>
        </div>

        {error && (
          <div className="alert alert-error animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="form-label flex items-center gap-2">
              <span className="text-lg">👤</span>
              Username
            </label>
            <input
              type="text"
              placeholder="Choose a username"
              value={form.username}
              onChange={e => handleChange('username', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="space-y-2">
            <label className="form-label flex items-center gap-2">
              <span className="text-lg">📧</span>
              Email Address
            </label>
            <input
              type="email"
              placeholder="your.email@company.com"
              value={form.email}
              onChange={e => handleChange('email', e.target.value)}
              className="form-input"
            />
            {!validation.email && form.email && (
              <p className="text-orange-600 text-xs mt-1 flex items-center gap-1">
                <span>⚠️</span> Email looks invalid
              </p>
            )}
            {validation.email && form.email && (
              <p className="text-green-600 text-xs mt-1 flex items-center gap-1">
                <span>✓</span> Email looks good
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="form-label flex items-center gap-2">
              <span className="text-lg">🔒</span>
              Password
            </label>
            <input
              type="password"
              placeholder="Create a strong password"
              value={form.password}
              onChange={e => handleChange('password', e.target.value)}
              className="form-input"
            />
            {form.password && !validation.password && (
              <p className="text-orange-600 text-xs mt-1 flex items-start gap-1">
                <span>💡</span>
                <span>Min 8 chars with uppercase, lowercase, number & special character</span>
              </p>
            )}
            {validation.password && form.password && (
              <p className="text-green-600 text-xs mt-1 flex items-center gap-1">
                <span>✓</span> Strong password
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="form-label flex items-center gap-2">
              <span className="text-lg">📱</span>
              Contact Number
            </label>
            <input
              type="tel"
              placeholder="+1234567890"
              value={form.contactNo}
              onChange={e => handleChange('contactNo', e.target.value)}
              className="form-input"
            />
            {form.contactNo && (
              <p className="text-gray-500 text-xs mt-1 flex items-center gap-1">
                <span>ℹ️</span>
                Normalized: {normalizePhone(form.contactNo)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="form-label flex items-center gap-2">
              <span className="text-lg">🎯</span>
              Profile Type
            </label>
            <select
              value={form.profile}
              onChange={e => setForm({...form, profile: e.target.value})}
              className="form-input"
            >
              <option value="REGULAR">Regular Employee</option>
              <option value="HR">HR Personnel</option>
            </select>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !form.username || !form.email || !form.password}
            className="btn btn-success w-full text-lg flex items-center justify-center gap-2 mt-6"
          >
            {loading ? (
              <>
                <span className="spinner w-5 h-5 border-2"></span>
                <span>Creating account...</span>
              </>
            ) : (
              <>
                <span>✨</span>
                <span>Create Account</span>
              </>
            )}
          </button>
        </div>

        <div className="text-center text-sm text-gray-600 pt-4">
          <p>Already have an account? <span className="text-primary-600 font-semibold cursor-pointer hover:underline">Sign in above</span></p>
        </div>
      </div>
    </div>
  );
}

export default Signup;


