import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  FiUser,
  FiTag,
  FiImage,
  FiRefreshCw,
  FiCalendar,
  FiMessageSquare,
  FiAlertCircle,
  FiTrendingUp,
  FiAward,
  FiClock,
  FiEye,
  FiHeart,
} from "react-icons/fi";

import API from "../services/api";
import toast from "react-hot-toast";

function Dashboard() {
  const navigate = useNavigate();
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    thisWeek: 0,
  });

  // ================= CHECK AUTHENTICATION =================
  const checkAuth = () => {
    try {
      const user = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      
      console.log("Auth Check - User:", user ? "Present" : "Missing");
      console.log("Auth Check - Token:", token ? "Present" : "Missing");
      
      if (!user || !token) {
        console.log("Authentication failed - redirecting to login");
        toast.error("Please login to access dashboard");
        navigate("/login", { replace: true });
        return false;
      }
      
      // Parse user to verify it's valid JSON
      try {
        JSON.parse(user);
      } catch (e) {
        console.log("Invalid user data in localStorage");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
        return false;
      }
      
      return true;
    } catch (error) {
      console.log("Auth check error:", error);
      return false;
    }
  };

  // ================= CALCULATE STATS =================
  const calculateStats = (doubtsData) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const todayCount = doubtsData.filter(doubt => {
      const doubtDate = new Date(doubt.createdAt);
      doubtDate.setHours(0, 0, 0, 0);
      return doubtDate.getTime() === today.getTime();
    }).length;
    
    const weekCount = doubtsData.filter(doubt => {
      const doubtDate = new Date(doubt.createdAt);
      return doubtDate >= weekAgo;
    }).length;
    
    setStats({
      total: doubtsData.length,
      today: todayCount,
      thisWeek: weekCount,
    });
  };

  // ================= FETCH DOUBTS =================
  const fetchDoubts = async () => {
    // Check authentication first
    const isAuth = checkAuth();
    if (!isAuth) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Get token from localStorage
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      
      console.log("Fetching doubts with token:", token ? "Token exists" : "No token");
      console.log("User:", user);
      
      const response = await API.get("/doubts", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      });
      
      console.log("API Response:", response);
      console.log("Response data:", response.data);
      
      let doubtsData = [];
      
      // Handle different response structures
      if (response.data) {
        if (Array.isArray(response.data)) {
          doubtsData = response.data;
        } else if (response.data.doubts && Array.isArray(response.data.doubts)) {
          doubtsData = response.data.doubts;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          doubtsData = response.data.data;
        } else {
          doubtsData = [];
        }
      }
      
      // Sort by newest first
      doubtsData.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB - dateA;
      });
      
      console.log("Processed doubts data:", doubtsData);
      setDoubts(doubtsData);
      calculateStats(doubtsData);
      
      if (doubtsData.length === 0) {
        toast.success("No doubts found. Be the first to post!");
      } else {
        toast.success(`Loaded ${doubtsData.length} doubts`);
      }
      
    } catch (error) {
      console.log("FETCH ERROR Full:", error);
      console.log("FETCH ERROR Response:", error.response);
      console.log("FETCH ERROR Data:", error.response?.data);
      console.log("FETCH ERROR Status:", error.response?.status);
      
      // Handle different error scenarios
      if (error.response?.status === 401) {
        console.log("Unauthorized - clearing localStorage and redirecting");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        toast.error("Session expired. Please login again.");
        navigate("/login", { replace: true });
        return;
      }
      
      if (error.response?.status === 404) {
        setError("API endpoint not found. Please check your backend connection.");
        toast.error("API endpoint not found");
      } else if (error.code === "ERR_NETWORK") {
        setError("Network error. Cannot connect to server.");
        toast.error("Network error. Please check your connection.");
      } else {
        setError(error.response?.data?.message || "Failed to load doubts");
        toast.error(error.response?.data?.message || "Failed to load doubts");
      }
      
      setDoubts([]);
      setStats({ total: 0, today: 0, thisWeek: 0 });
    } finally {
      setLoading(false);
    }
  };

  // ================= USE EFFECT =================
  useEffect(() => {
    console.log("Dashboard component mounted");
    
    // Small delay to ensure everything is loaded
    const timer = setTimeout(() => {
      fetchDoubts();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // ================= FORMAT DATE =================
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays} days ago`;
      return date.toLocaleDateString();
    } catch (error) {
      return "Invalid date";
    }
  };

  // ================= RETRY FETCH =================
  const retryFetch = () => {
    console.log("Retrying fetch...");
    fetchDoubts();
  };

  // ================= GET TAGS ARRAY =================
  const getTagsArray = (tags) => {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags;
    if (typeof tags === 'string') return tags.split(",").map(tag => tag.trim());
    return [];
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0a0f2a] to-[#020617] text-white relative overflow-hidden">
      {/* ================= BACKGROUND ================= */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-250px] left-[-250px] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[180px] animate-pulse"></div>
        <div className="absolute bottom-[-300px] right-[-300px] w-[650px] h-[650px] bg-blue-500/10 rounded-full blur-[180px] animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-purple-500/5 rounded-full blur-[200px] animate-pulse delay-2000"></div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-20">
        
        {/* ================= HEADER ================= */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-14"
        >
          <div>
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-cyan-400/30 bg-slate-900/50 backdrop-blur-xl mb-6">
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-cyan-400 animate-ping"></div>
              </div>
              <span className="text-xs text-cyan-400 font-medium">Developer Dashboard</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black leading-tight">
              Developer
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-400 bg-clip-text text-transparent animate-gradient">
                Dashboard
              </span>
            </h1>
            <p className="text-slate-400 mt-5 text-sm sm:text-lg max-w-2xl leading-relaxed">
              Explore coding doubts, screenshots, debugging issues,
              and programming discussions shared by developers.
            </p>
          </div>

          {/* REFRESH BUTTON */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={retryFetch}
            disabled={loading}
            className="flex items-center justify-center gap-3 bg-slate-900/80 border border-slate-700/50 hover:border-cyan-400 px-6 py-4 rounded-2xl transition-all duration-300 hover:scale-105 backdrop-blur-2xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiRefreshCw className={`text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
            <span className="font-medium">{loading ? 'Loading...' : 'Refresh'}</span>
          </motion.button>
        </motion.div>

        {/* ================= STATS CARDS ================= */}
        {!loading && !error && doubts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10"
          >
            <div className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 hover:from-slate-800/70 hover:to-slate-900/70 rounded-2xl p-6 border border-slate-700 hover:border-cyan-400/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-2">Total Doubts</p>
                  <p className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    {stats.total}
                  </p>
                </div>
                <div className="w-14 h-14 rounded-xl bg-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <FiMessageSquare className="text-cyan-400 text-2xl" />
                </div>
              </div>
            </div>
            <div className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 hover:from-slate-800/70 hover:to-slate-900/70 rounded-2xl p-6 border border-slate-700 hover:border-green-400/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-2">Today's Doubts</p>
                  <p className="text-5xl font-bold text-green-400">
                    {stats.today}
                  </p>
                </div>
                <div className="w-14 h-14 rounded-xl bg-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <FiTrendingUp className="text-green-400 text-2xl" />
                </div>
              </div>
            </div>
            <div className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 hover:from-slate-800/70 hover:to-slate-900/70 rounded-2xl p-6 border border-slate-700 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-2">This Week</p>
                  <p className="text-5xl font-bold text-yellow-400">
                    {stats.thisWeek}
                  </p>
                </div>
                <div className="w-14 h-14 rounded-xl bg-yellow-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <FiAward className="text-yellow-400 text-2xl" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================= LOADING ================= */}
        {loading && (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-[32px] p-8 animate-pulse">
                <div className="w-3/4 h-7 bg-slate-800 rounded-xl"></div>
                <div className="w-full h-4 bg-slate-800 rounded-lg mt-6"></div>
                <div className="w-5/6 h-4 bg-slate-800 rounded-lg mt-3"></div>
                <div className="w-full h-32 bg-slate-800 rounded-xl mt-4"></div>
                <div className="flex gap-3 mt-6">
                  <div className="w-20 h-10 bg-slate-800 rounded-xl"></div>
                  <div className="w-24 h-10 bg-slate-800 rounded-xl"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================= ERROR STATE ================= */}
        <AnimatePresence>
          {error && !loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-center text-center py-20"
            >
              <div className="w-24 h-24 rounded-full bg-red-500/20 flex items-center justify-center mb-6">
                <FiAlertCircle className="text-6xl text-red-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Error Loading Dashboard</h3>
              <p className="text-slate-400 max-w-md mb-6">{error}</p>
              <button
                onClick={retryFetch}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ================= EMPTY STATE ================= */}
        {!loading && !error && doubts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center text-center py-20"
          >
            <div className="w-36 h-36 rounded-[40px] bg-gradient-to-br from-slate-800 to-slate-900 border border-cyan-400/30 flex items-center justify-center mb-8">
              <FiMessageSquare className="text-7xl text-cyan-400" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">No Doubts Found</h2>
            <p className="text-slate-400 max-w-md mb-8 text-lg">
              No coding doubts have been posted yet. Be the first to ask a question!
            </p>
            <button 
              onClick={() => navigate("/ask-doubt")}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-cyan-500/25"
            >
              Ask Your First Doubt
            </button>
          </motion.div>
        )}

        {/* ================= DOUBTS GRID ================= */}
        {!loading && !error && doubts.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8"
          >
            {doubts.map((doubt, index) => {
              const tagsArray = getTagsArray(doubt.tags);
              return (
                <motion.div
                  key={doubt._id || index}
                  variants={itemVariants}
                  className="group bg-slate-900/50 backdrop-blur-sm border border-slate-800 hover:border-cyan-400 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/10"
                >
                  {doubt.image && (
                    <div className="relative overflow-hidden h-52">
                      <img
                        src={doubt.image}
                        alt={doubt.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold group-hover:text-cyan-400 transition line-clamp-2 mb-3">
                      {doubt.title}
                    </h3>
                    
                    <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 mb-4">
                      {doubt.description}
                    </p>
                    
                    {tagsArray.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {tagsArray.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="text-xs px-2.5 py-1.5 bg-cyan-500/10 border border-cyan-400/20 rounded-lg text-cyan-400 font-medium">
                            #{tag.trim()}
                          </span>
                        ))}
                        {tagsArray.length > 3 && (
                          <span className="text-xs px-2.5 py-1.5 bg-slate-700/50 rounded-lg text-slate-400">
                            +{tagsArray.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                          <FiUser className="text-cyan-400 text-sm" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Posted by</p>
                          <p className="text-sm font-medium text-white">
                            {doubt.user?.name || "Anonymous"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 text-xs">
                        <FiClock className="text-cyan-400" />
                        {formatDate(doubt.createdAt)}
                      </div>
                    </div>

                    {/* View Details Button */}
                    <button
                      onClick={() => navigate(`/doubt/${doubt._id}`)}
                      className="w-full mt-4 py-2 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-cyan-400 transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium"
                    >
                      <FiEye className="text-sm" />
                      View Details
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* ================= FOOTER STATS ================= */}
        {!loading && !error && doubts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 p-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl border border-cyan-500/20 backdrop-blur-sm"
          >
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                  <FiMessageSquare className="text-cyan-400 text-2xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Total Community Doubts</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    {stats.total}
                  </p>
                </div>
              </div>
              <div className="h-12 w-px bg-slate-700 hidden sm:block"></div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <FiTrendingUp className="text-green-400 text-2xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Active Today</p>
                  <p className="text-3xl font-bold text-green-400">{stats.today}</p>
                </div>
              </div>
              <div className="h-12 w-px bg-slate-700 hidden sm:block"></div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <FiHeart className="text-purple-400 text-2xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Community Engagement</p>
                  <p className="text-3xl font-bold text-purple-400">Active</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <style>{`
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}

export default Dashboard;