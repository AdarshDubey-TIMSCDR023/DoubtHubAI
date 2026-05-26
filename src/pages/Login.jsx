import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import {
  FiMail,
  FiLock,
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiZap,
  FiCheckCircle,
} from "react-icons/fi";

import API from "../services/api";


function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= HANDLE SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } = await API.post("/auth/login", formData);

      console.log("LOGIN RESPONSE:", data);

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      // Dispatch custom event for navbar to detect login
      window.dispatchEvent(new Event("userLoggedIn"));

      toast.success(data.message || "Login Successful!");

      // Redirect to AI Chat page
      navigate("/ai-chat");

    } catch (error) {
      console.log("LOGIN ERROR:", error.response?.data);
      toast.error(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0a0f2a] to-[#020617] flex items-center justify-center px-4 py-6 relative overflow-hidden">
      
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-200px] right-[-200px] w-[400px] h-[400px] bg-cyan-500/15 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-250px] left-[-250px] w-[450px] h-[450px] bg-blue-500/15 rounded-full blur-[120px] animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/8 rounded-full blur-[150px]"></div>
      </div>

      {/* Compact Card */}
      <div className="relative w-full max-w-sm bg-slate-900/80 backdrop-blur-2xl border border-cyan-500/20 rounded-2xl p-6 shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500 animate-fade-in-up">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Login to continue
          </p>
        </div>

        {/* Features Badge */}
        <div className="flex justify-center gap-2 mb-6">
          <div className="flex items-center gap-1 text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded-full">
            <FiZap size={10} />
            <span>AI Powered</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded-full">
            <FiCheckCircle size={10} />
            <span>24/7 Support</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email Field */}
          <div>
            <label className="text-slate-400 text-xs font-medium flex items-center gap-1.5 mb-1.5">
              <FiMail className="text-cyan-400 text-xs" />
              Email
            </label>
            <div className={`transition-all duration-300 ${focusedField === 'email' ? 'scale-[1.01]' : ''}`}>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                className="w-full bg-[#020617] border border-slate-700 focus:border-cyan-400 rounded-lg px-4 py-2.5 text-sm outline-none transition-all duration-300 focus:shadow-lg focus:shadow-cyan-500/5"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="text-slate-400 text-xs font-medium flex items-center gap-1.5 mb-1.5">
              <FiLock className="text-cyan-400 text-xs" />
              Password
            </label>
            <div className={`relative transition-all duration-300 ${focusedField === 'password' ? 'scale-[1.01]' : ''}`}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                className="w-full bg-[#020617] border border-slate-700 focus:border-cyan-400 rounded-lg px-4 py-2.5 pr-10 text-sm outline-none transition-all duration-300 focus:shadow-lg focus:shadow-cyan-500/5"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition-colors"
              >
                {showPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link to="/forgot-password" className="text-[10px] text-cyan-400 hover:text-cyan-300 transition-colors">
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-[1.02] shadow-md shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden mt-2"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Logging in...
                </>
              ) : (
                <>
                  Login
                  <FiArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>

        </form>

        {/* Register Link */}
        <div className="mt-5 text-center">
          <p className="text-slate-400 text-xs">
            Don't have an account?{" "}
            <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors inline-flex items-center gap-1">
              Create Account
              <FiArrowRight size={12} />
            </Link>
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="mt-4 p-3 bg-cyan-500/5 border border-cyan-500/15 rounded-lg">
          <p className="text-[10px] text-cyan-400 text-center mb-1.5">Demo Credentials</p>
          <div className="text-[10px] text-slate-500 text-center space-y-0.5">
            <p>Email: demo@doubtHub.com</p>
            <p>Password: demo123</p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default Login;