import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiUser,
  FiMail,
  FiLock,
  FiCalendar,
  FiBook,
  FiUpload,
  FiX,
  FiArrowRight,
  FiArrowLeft,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiImage,
  FiCpu,
} from "react-icons/fi";
import API from "../services/api";

function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    dob: "",
    gender: "",
    college: "",
  });
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }
    setProfilePic(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeProfilePic = () => {
    setProfilePic(null);
    setPreview("");
  };

  const validateStep1 = () => {
    if (!profilePic) {
      toast.error("Please upload a profile picture");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.name.trim()) {
      toast.error("Please enter your full name");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("Please enter your email");
      return false;
    }
    if (!formData.password) {
      toast.error("Please enter a password");
      return false;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!formData.dob) {
      toast.error("Please select your date of birth");
      return false;
    }
    if (!formData.gender) {
      toast.error("Please select your gender");
      return false;
    }
    if (!formData.college.trim()) {
      toast.error("Please enter your college/university name");
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const prevStep = () => step > 1 && setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep3()) return;

    try {
      setLoading(true);
      let profilePicUrl = "";
      
      if (profilePic) {
        const uploadData = new FormData();
        uploadData.append("image", profilePic);
        const uploadResponse = await fetch(
          "https://doubthub-ai-backend.onrender.com/api/upload",
          { method: "POST", body: uploadData }
        );
        const uploadResult = await uploadResponse.json();
        profilePicUrl = uploadResult.imageUrl || uploadResult.url || "";
      }

      await API.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        dob: formData.dob,
        gender: formData.gender,
        college: formData.college,
        profilePic: profilePicUrl,
      });

      toast.success("Registration Successful! Please login.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 100;
  const maxYear = currentYear - 5;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0a0f2a] to-[#020617] flex items-center justify-center p-4">
      <div className="max-w-5xl w-full bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row">
          {/* Left Side - Brand Panel (Compact) */}
          <div className="md:w-80 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-6 border-r border-slate-700/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <FiCpu className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">DoubtHub</h1>
                <p className="text-[10px] text-cyan-400">AI Platform</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-cyan-500/10 rounded-xl p-4 border border-cyan-500/20">
                <p className="text-xs text-cyan-400 mb-2">✨ Join the community</p>
                <p className="text-sm text-slate-300 leading-relaxed">Connect with developers worldwide and solve coding challenges together</p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-slate-800/30 rounded-lg">
                  <p className="text-lg font-bold text-cyan-400">10K+</p>
                  <p className="text-[10px] text-slate-400">Users</p>
                </div>
                <div className="p-2 bg-slate-800/30 rounded-lg">
                  <p className="text-lg font-bold text-cyan-400">50K+</p>
                  <p className="text-[10px] text-slate-400">Doubts</p>
                </div>
                <div className="p-2 bg-slate-800/30 rounded-lg">
                  <p className="text-lg font-bold text-cyan-400">98%</p>
                  <p className="text-[10px] text-slate-400">Satisfaction</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="flex-1 p-6">
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Create Account</h2>
              <p className="text-xs text-slate-400 mt-1">Fill in your details to get started</p>
              
              {/* Step Indicator */}
              <div className="flex items-center justify-center gap-4 mt-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                      step === i ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30" :
                      step > i ? "bg-green-500 text-white" : "bg-slate-700 text-slate-400"
                    }`}>
                      {step > i ? <FiCheckCircle className="text-sm" /> : i}
                    </div>
                    {i < 3 && <div className={`w-8 h-0.5 mx-1 ${step > i ? "bg-green-500" : "bg-slate-700"}`}></div>}
                  </div>
                ))}
              </div>
            </div>

            {/* Progress Steps */}
            <div className="flex gap-1 mb-6">
              <div className={`flex-1 h-1 rounded-full transition-all ${step >= 1 ? "bg-gradient-to-r from-cyan-500 to-blue-600" : "bg-slate-700"}`}></div>
              <div className={`flex-1 h-1 rounded-full transition-all ${step >= 2 ? "bg-gradient-to-r from-cyan-500 to-blue-600" : "bg-slate-700"}`}></div>
              <div className={`flex-1 h-1 rounded-full transition-all ${step >= 3 ? "bg-gradient-to-r from-cyan-500 to-blue-600" : "bg-slate-700"}`}></div>
            </div>

            <form onSubmit={step === 3 ? handleSubmit : (e) => e.preventDefault()}>
              {/* Step 1 - Profile Picture */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="relative inline-block">
                      <div 
                        className="w-24 h-24 rounded-full bg-slate-800 border-2 border-dashed border-cyan-400/50 cursor-pointer overflow-hidden hover:border-cyan-400 transition-all mx-auto"
                        onClick={() => document.getElementById('profilePicInput').click()}
                      >
                        {preview ? (
                          <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                            <FiUpload className="text-2xl" />
                            <span className="text-[10px] mt-1">Upload</span>
                          </div>
                        )}
                      </div>
                      {preview && (
                        <button
                          type="button"
                          onClick={removeProfilePic}
                          className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition"
                        >
                          <FiX className="text-white text-xs" />
                        </button>
                      )}
                      <input id="profilePicInput" type="file" accept="image/*" onChange={handleProfilePicChange} className="hidden" />
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2">JPG, PNG up to 5MB</p>
                  </div>

                  <div className="bg-cyan-500/5 rounded-xl p-3 border border-cyan-500/20">
                    <div className="flex items-center gap-2">
                      <FiCheckCircle className="text-cyan-400 text-sm" />
                      <p className="text-xs text-slate-300">Add a profile picture to build trust in the community</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2 - Personal Info */}
              {step === 2 && (
                <div className="space-y-3">
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm focus:border-cyan-400 focus:outline-none transition"
                      required
                    />
                  </div>

                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm focus:border-cyan-400 focus:outline-none transition"
                      required
                    />
                  </div>

                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password (min. 6 characters)"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-9 pr-9 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm focus:border-cyan-400 focus:outline-none transition"
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                      {showPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                    </button>
                  </div>

                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full pl-9 pr-9 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm focus:border-cyan-400 focus:outline-none transition"
                      required
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                      {showConfirmPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                    </button>
                  </div>

                  {formData.password && formData.confirmPassword && (
                    <div className={`text-xs flex items-center gap-1 ${formData.password === formData.confirmPassword ? "text-green-400" : "text-red-400"}`}>
                      {formData.password === formData.confirmPassword ? <FiCheckCircle /> : <FiX />}
                      {formData.password === formData.confirmPassword ? "Passwords match" : "Passwords do not match"}
                    </div>
                  )}
                </div>
              )}

              {/* Step 3 - Education Info */}
              {step === 3 && (
                <div className="space-y-3">
                  <div className="relative">
                    <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      min={`${minYear}-01-01`}
                      max={`${maxYear}-12-31`}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm focus:border-cyan-400 focus:outline-none transition"
                      required
                    />
                  </div>

                  <div className="flex gap-2">
                    {["Male", "Female", "Other"].map((gender) => (
                      <label key={gender} className={`flex-1 cursor-pointer text-center py-2 rounded-lg border transition ${
                        formData.gender === gender 
                          ? "border-cyan-400 bg-cyan-500/10 text-cyan-400" 
                          : "border-slate-700 bg-slate-800/30 text-slate-400 hover:border-slate-600"
                      }`}>
                        <input type="radio" name="gender" value={gender} checked={formData.gender === gender} onChange={handleChange} className="hidden" />
                        <span className="text-sm">{gender}</span>
                      </label>
                    ))}
                  </div>

                  <div className="relative">
                    <FiBook className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                    <input
                      type="text"
                      name="college"
                      placeholder="College/University Name"
                      value={formData.college}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm focus:border-cyan-400 focus:outline-none transition"
                      required
                    />
                  </div>

                  {/* Preview */}
                  <div className="mt-4 p-3 bg-slate-800/30 rounded-lg border border-slate-700">
                    <p className="text-xs text-cyan-400 mb-2">Profile Preview</p>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-slate-700 overflow-hidden">
                        {preview ? (
                          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><FiUser className="text-slate-500" /></div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{formData.name || "Your Name"}</p>
                        <p className="text-xs text-slate-500">{formData.email || "your@email.com"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3 mt-6">
                {step > 1 && (
                  <button type="button" onClick={prevStep} className="flex-1 px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition flex items-center justify-center gap-2 text-sm">
                    <FiArrowLeft size={14} /> Back
                  </button>
                )}
                {step < 3 ? (
                  <button type="button" onClick={nextStep} className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:opacity-90 transition flex items-center justify-center gap-2 text-sm">
                    Next <FiArrowRight size={14} />
                  </button>
                ) : (
                  <button type="submit" disabled={loading} className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold hover:opacity-90 transition flex items-center justify-center gap-2 text-sm">
                    {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <FiCheckCircle size={14} />}
                    {loading ? "Creating..." : "Create Account"}
                  </button>
                )}
              </div>
            </form>

            {/* Footer */}
            <div className="text-center mt-6 pt-4 border-t border-slate-800">
              <p className="text-xs text-slate-500">
                Already have an account? <Link to="/login" className="text-cyan-400 hover:text-cyan-300 transition">Sign In</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;