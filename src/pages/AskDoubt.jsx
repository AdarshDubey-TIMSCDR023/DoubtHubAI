import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiUpload,
  FiImage,
  FiX,
  FiSend,
  FiTag,
  FiFileText,
  FiHelpCircle,
  FiCheckCircle,
} from "react-icons/fi";
import API from "../services/api";

function AskDoubt() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedDoubt, setSubmittedDoubt] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (JPEG, PNG, GIF, WEBP)");
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }
    
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setPreview("");
    // Clean up the object URL to prevent memory leaks
    if (preview) {
      URL.revokeObjectURL(preview);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      let imageUrl = "";

      // Upload image using your backend Cloudinary endpoint
      if (image) {
        const uploadData = new FormData();
        uploadData.append("image", image);

        const uploadResponse = await fetch(
          "https://doubthub-ai-backend.onrender.com/api/upload",
          {
            method: "POST",
            body: uploadData,
          }
        );

        const uploadResult = await uploadResponse.json();
        console.log("UPLOAD RESULT:", uploadResult);
        
        if (uploadResult.success) {
          imageUrl = uploadResult.imageUrl;
        } else {
          throw new Error(uploadResult.message || "Upload failed");
        }
      }

      const sendData = {
        title: formData.title,
        description: formData.description,
        tags: formData.tags,
        image: imageUrl,
      };

      console.log("SEND DATA:", sendData);

      const { data } = await API.post("/doubts", sendData);

      // Store the submitted doubt for modal
      setSubmittedDoubt({
        id: data.doubt?._id || data._id,
        title: formData.title,
        description: formData.description,
        tags: formData.tags,
        image: imageUrl,
      });

      // Show success modal
      setShowSuccessModal(true);

      // Reset form
      setFormData({
        title: "",
        description: "",
        tags: "",
      });
      setImage(null);
      if (preview) {
        URL.revokeObjectURL(preview);
      }
      setPreview("");

    } catch (error) {
      console.log("ERROR:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to create doubt");
    } finally {
      setLoading(false);
    }
  };

  const handleViewHistory = () => {
    setShowSuccessModal(false);
    setSubmittedDoubt(null);
    navigate("/history");
  };

  const handlePostAnother = () => {
    setShowSuccessModal(false);
    setSubmittedDoubt(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0a0f2a] to-[#020617] text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-250px] left-[-250px] w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[180px] animate-pulse"></div>
        <div className="absolute bottom-[-300px] right-[-300px] w-[550px] h-[550px] bg-blue-600/15 rounded-full blur-[180px] animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/8 rounded-full blur-[200px]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-20">
        {/* Heading */}
        <div className="text-center mb-14 animate-fade-in-up">
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/30 backdrop-blur-2xl mb-6 shadow-lg">
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-cyan-400 animate-ping"></div>
            </div>
            <FiImage className="text-cyan-400 text-xl" />
            <span className="text-slate-300 font-medium">Upload Coding Errors & Screenshots</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black leading-tight">
            Ask Your
            <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-400 bg-clip-text text-transparent animate-gradient">
              Coding Doubt
            </span>
          </h1>

          <p className="text-slate-400 mt-6 text-sm sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Share your coding issue, upload screenshots, explain bugs, and get help instantly from the community.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={submitHandler}
          className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 border border-slate-700/50 backdrop-blur-3xl rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-8 lg:p-10 shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500 space-y-8"
        >
          {/* Title */}
          <div className="group">
            <label className="text-slate-300 font-medium flex items-center gap-2 mb-3">
              <div className="w-1 h-4 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></div>
              Doubt Title
              <span className="text-red-400 text-sm">*</span>
            </label>
            <input
              type="text"
              name="title"
              placeholder="e.g., How to fix React state update issue?"
              value={formData.title}
              onChange={handleChange}
              className="w-full bg-[#020617] border border-slate-700 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/10 transition-all duration-300 text-white placeholder:text-slate-500"
              required
            />
          </div>

          {/* Description */}
          <div className="group">
            <label className="text-slate-300 font-medium flex items-center gap-2 mb-3">
              <div className="w-1 h-4 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></div>
              Description
              <span className="text-red-400 text-sm">*</span>
            </label>
            <textarea
              rows="8"
              name="description"
              placeholder="Explain your issue in detail. Include error messages, expected behavior, and what you've tried..."
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-[#020617] border border-slate-700 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/10 transition-all duration-300 resize-none text-white placeholder:text-slate-500"
              required
            ></textarea>
          </div>

          {/* Tags */}
          <div className="group">
            <label className="text-slate-300 font-medium flex items-center gap-2 mb-3">
              <div className="w-1 h-4 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></div>
              Tags
              <span className="text-slate-500 text-sm">(Optional)</span>
            </label>
            <div className="relative">
              <FiTag className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                name="tags"
                placeholder="React, Node.js, MongoDB, JavaScript"
                value={formData.tags}
                onChange={handleChange}
                className="w-full bg-[#020617] border border-slate-700 rounded-2xl pl-12 pr-5 py-4 outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/10 transition-all duration-300 text-white placeholder:text-slate-500"
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">Separate tags with commas for better visibility</p>
          </div>

          {/* Image Upload */}
          <div className="group">
            <label className="text-slate-300 font-medium flex items-center gap-2 mb-3">
              <div className="w-1 h-4 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></div>
              Upload Screenshot
              <span className="text-slate-500 text-sm">(Optional)</span>
            </label>

            <label className="flex flex-col items-center justify-center w-full min-h-[260px] border-2 border-dashed border-slate-700 rounded-2xl cursor-pointer bg-[#020617]/50 hover:border-cyan-400 hover:bg-[#020617]/70 transition-all duration-300 overflow-hidden relative group-hover:border-cyan-400">
              {preview ? (
                <div className="relative w-full h-full">
                  <img
                    src={preview}
                    alt="preview"
                    className="w-full h-full object-cover max-h-[300px]"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
                  >
                    <FiX className="text-xl" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <FiUpload className="text-cyan-400 text-5xl" />
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    Upload Screenshot
                  </h3>
                  <p className="text-slate-400 mt-3 text-sm">Click to upload coding screenshots</p>
                  <p className="text-slate-500 text-xs mt-2">PNG, JPG, JPEG up to 5MB</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Button */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="group relative flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Posting Your Doubt...
                  </>
                ) : (
                  <>
                    <FiSend className="text-lg" />
                    Post Doubt
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>

          {/* Helper Text */}
          <div className="flex items-center justify-center gap-2 pt-2 text-xs text-slate-500">
            <FiHelpCircle className="text-cyan-400" />
            <span>Your doubt will be visible to the community. Be clear and specific for better answers.</span>
          </div>
        </form>

        {/* Feature Tips */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
              <FiFileText className="text-cyan-400 text-lg" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Clear Description</p>
              <p className="text-xs text-slate-500">Explain your issue in detail</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
              <FiTag className="text-cyan-400 text-lg" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Add Tags</p>
              <p className="text-xs text-slate-500">Help others find your question</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
              <FiImage className="text-cyan-400 text-lg" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Add Screenshots</p>
              <p className="text-xs text-slate-500">Show error messages visually</p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border border-cyan-500/30 max-w-md w-full p-8 shadow-2xl transform transition-all animate-scale-in">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30 animate-bounce-in">
                <FiCheckCircle className="text-white text-4xl" />
              </div>
            </div>

            {/* Success Message */}
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-3">
                Doubt Posted Successfully!
              </h2>
              <p className="text-slate-300 text-sm">
                Your coding doubt has been shared with the community. Experts will help you soon.
              </p>
            </div>

            {/* Doubt Summary */}
            <div className="bg-slate-800/50 rounded-2xl p-4 mb-6 border border-slate-700">
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-400 mb-1">Title</p>
                  <p className="text-sm text-white font-medium break-words">{submittedDoubt?.title}</p>
                </div>
                {submittedDoubt?.tags && (
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Tags</p>
                    <p className="text-sm text-cyan-400 break-words">{submittedDoubt.tags}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleViewHistory}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                View My Doubts
              </button>
              <button
                onClick={handlePostAnother}
                className="flex-1 bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                Post Another
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

export default AskDoubt;