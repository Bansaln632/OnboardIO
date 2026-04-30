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
      <div className="bg-white rounded-lg shadow-soft p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create Account</h2>

        {error && (
          <div className="bg-error-light text-error-dark px-4 py-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="form-label">Username</label>
            <input
              type="text"
              placeholder="Choose a username"
              value={form.username}
              onChange={e => handleChange('username', e.target.value)}
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={e => handleChange('email', e.target.value)}
              className="form-input"
            />
            {!validation.email && form.email && (
              <p className="text-warning text-xs mt-1">Email looks invalid</p>
            )}
          </div>

          <div>
            <label className="form-label">Password</label>
            <input
              type="password"
              placeholder="Create a strong password"
              value={form.password}
              onChange={e => handleChange('password', e.target.value)}
              className="form-input"
            />
            {form.password && !validation.password && (
              <p className="text-warning text-xs mt-1">
                Password should be min 8 chars and include upper/lower/number/special character
              </p>
            )}
          </div>

          <div>
            <label className="form-label">Contact Number</label>
            <input
              type="tel"
              placeholder="Enter contact number"
              value={form.contactNo}
              onChange={e => handleChange('contactNo', e.target.value)}
              className="form-input"
            />
            {form.contactNo && (
              <p className="text-gray-500 text-xs mt-1">
                Normalized: {normalizePhone(form.contactNo)}
              </p>
            )}
          </div>

          <div>
            <label className="form-label">Profile</label>
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
            disabled={loading}
            className="btn btn-success w-full mt-6"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signup;


