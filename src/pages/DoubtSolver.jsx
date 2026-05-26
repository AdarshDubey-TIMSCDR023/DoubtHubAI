import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiTag,
  FiImage,
  FiRefreshCw,
  FiMessageSquare,
  FiAlertCircle,
  FiClock,
  FiSend,
  FiCheckCircle,
  FiX,
  FiCode,
  FiEye,
  FiThumbsUp,
  FiBookOpen,
} from "react-icons/fi";
import toast from "react-hot-toast";
import API from "../services/api";

function DoubtSolver() {
  const navigate = useNavigate();
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDoubt, setSelectedDoubt] = useState(null);
  const [answerText, setAnswerText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const [markAsResolvedAfterAnswer, setMarkAsResolvedAfterAnswer] = useState(true);

  // Get user from localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user:", error);
      }
    }
  }, []);

  // Helper function to get tags array
  const getTagsArray = (tags) => {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags;
    if (typeof tags === 'string') return tags.split(",").map(tag => tag.trim());
    return [];
  };

  // Load persisted data from localStorage
  const loadPersistedData = (apiDoubts) => {
    try {
      // Load answers from localStorage
      const storedAnswers = JSON.parse(localStorage.getItem("doubts_answers") || "{}");
      
      // Load resolved statuses from localStorage
      const storedResolved = JSON.parse(localStorage.getItem("doubts_resolved") || "{}");
      
      // Merge API data with localStorage data
      const mergedDoubts = apiDoubts.map(doubt => ({
        ...doubt,
        answers: storedAnswers[doubt._id] || doubt.answers || [],
        status: storedResolved[doubt._id] === true ? "resolved" : (doubt.status || "pending")
      }));
      
      return mergedDoubts;
    } catch (error) {
      console.error("Error loading persisted data:", error);
      return apiDoubts;
    }
  };

  // Fetch all doubts
  const fetchDoubts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem("token");
      const response = await API.get("/doubts", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      });
      
      let doubtsData = [];
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
      
      // Load persisted answers and statuses
      const mergedDoubts = loadPersistedData(doubtsData);
      
      // Sort by newest first
      mergedDoubts.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB - dateA;
      });
      
      setDoubts(mergedDoubts);
      
      if (mergedDoubts.length === 0) {
        toast.success("No doubts available. Check back later!");
      }
    } catch (error) {
      console.error("Error fetching doubts:", error);
      setError(error.response?.data?.message || "Failed to load doubts");
      toast.error("Failed to load doubts");
    } finally {
      setLoading(false);
    }
  };

  // Submit answer to a doubt
  const submitAnswer = async () => {
    if (!answerText.trim()) {
      toast.error("Please write an answer before submitting");
      return;
    }

    try {
      setSubmitting(true);
      
      // Get existing answers or initialize empty array
      const existingAnswers = selectedDoubt.answers || [];
      
      const answerData = {
        content: answerText,
        user: {
          _id: user?._id,
          name: user?.name,
          email: user?.email,
        },
        createdAt: new Date().toISOString(),
      };
      
      const updatedAnswers = [...existingAnswers, answerData];
      
      // Save to localStorage (persists across refreshes)
      const allDoubtsKey = "doubts_answers";
      const storedAnswers = JSON.parse(localStorage.getItem(allDoubtsKey) || "{}");
      storedAnswers[selectedDoubt._id] = updatedAnswers;
      localStorage.setItem(allDoubtsKey, JSON.stringify(storedAnswers));
      
      // If mark as resolved is enabled, save resolved status
      if (markAsResolvedAfterAnswer) {
        const resolvedKey = "doubts_resolved";
        const storedResolved = JSON.parse(localStorage.getItem(resolvedKey) || "{}");
        storedResolved[selectedDoubt._id] = true;
        localStorage.setItem(resolvedKey, JSON.stringify(storedResolved));
      }
      
      // Show success message
      if (markAsResolvedAfterAnswer) {
        toast.success("Answer submitted and doubt marked as resolved!");
      } else {
        toast.success("Answer submitted successfully!");
      }
      
      // Update the doubts list with the new answer and status
      setDoubts(prev => prev.map(doubt => 
        doubt._id === selectedDoubt._id 
          ? { 
              ...doubt, 
              answers: updatedAnswers,
              status: markAsResolvedAfterAnswer ? "resolved" : doubt.status
            }
          : doubt
      ));
      
      // Update selected doubt
      setSelectedDoubt({ 
        ...selectedDoubt, 
        answers: updatedAnswers,
        status: markAsResolvedAfterAnswer ? "resolved" : selectedDoubt.status
      });
      setAnswerText("");
      
    } catch (error) {
      console.error("Error submitting answer:", error);
      toast.error("Failed to submit answer");
    } finally {
      setSubmitting(false);
    }
  };

  // Mark doubt as resolved
  const markAsResolved = async (doubtId) => {
    try {
      // Save resolved status to localStorage
      const resolvedKey = "doubts_resolved";
      const storedResolved = JSON.parse(localStorage.getItem(resolvedKey) || "{}");
      storedResolved[doubtId] = true;
      localStorage.setItem(resolvedKey, JSON.stringify(storedResolved));
      
      // Update local state
      setDoubts(prev => prev.map(doubt => 
        doubt._id === doubtId 
          ? { ...doubt, status: "resolved" }
          : doubt
      ));
      
      if (selectedDoubt?._id === doubtId) {
        setSelectedDoubt({ ...selectedDoubt, status: "resolved" });
      }
      
      toast.success("Doubt marked as resolved!");
      
    } catch (error) {
      console.error("Error marking as resolved:", error);
      toast.error("Failed to mark as resolved");
    }
  };

  // Format date
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

  useEffect(() => {
    fetchDoubts();
  }, []);

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

  // Get answer count
  const getAnswerCount = (doubt) => {
    return doubt.answers?.length || 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0a0f2a] to-[#020617] text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-250px] left-[-250px] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[180px] animate-pulse"></div>
        <div className="absolute bottom-[-300px] right-[-300px] w-[650px] h-[650px] bg-blue-500/10 rounded-full blur-[180px] animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-purple-500/5 rounded-full blur-[200px] animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-cyan-400/30 bg-slate-900/50 backdrop-blur-xl mb-6">
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-cyan-400 animate-ping"></div>
            </div>
            <span className="text-xs text-cyan-400 font-medium">Help Others Learn</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black leading-tight">
            Doubt
            <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-400 bg-clip-text text-transparent animate-gradient">
              Solver
            </span>
          </h1>
          <p className="text-slate-400 mt-4 text-base max-w-2xl mx-auto">
            Help fellow developers by answering their coding doubts and sharing your knowledge
          </p>
        </motion.div>

        {/* Stats Bar */}
        {!loading && !error && doubts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl p-4 mb-8 border border-cyan-500/20"
          >
            <div className="flex flex-wrap justify-around items-center gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-cyan-400">{doubts.length}</p>
                <p className="text-xs text-slate-400">Total Doubts</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">
                  {doubts.filter(d => d.status === "resolved").length}
                </p>
                <p className="text-xs text-slate-400">Resolved</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-400">
                  {doubts.filter(d => d.status !== "resolved").length}
                </p>
                <p className="text-xs text-slate-400">Pending</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-400">
                  {doubts.reduce((sum, d) => sum + getAnswerCount(d), 0)}
                </p>
                <p className="text-xs text-slate-400">Total Answers</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Refresh Button */}
        <div className="flex justify-end mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchDoubts}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 transition border border-slate-700 hover:border-cyan-400/50 text-sm"
          >
            <FiRefreshCw className={`text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </motion.button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 animate-pulse">
                <div className="w-3/4 h-6 bg-slate-800 rounded-lg mb-4"></div>
                <div className="w-full h-20 bg-slate-800 rounded-lg mb-4"></div>
                <div className="flex gap-2">
                  <div className="w-16 h-6 bg-slate-800 rounded-lg"></div>
                  <div className="w-20 h-6 bg-slate-800 rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center py-20"
          >
            <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mb-6">
              <FiAlertCircle className="text-5xl text-red-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Error Loading Doubts</h3>
            <p className="text-slate-400 max-w-md mb-6">{error}</p>
            <button
              onClick={fetchDoubts}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 rounded-xl font-semibold"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* No Doubts State */}
        {!loading && !error && doubts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center text-center py-20"
          >
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center mb-6">
              <FiBookOpen className="text-6xl text-cyan-400" />
            </div>
            <h2 className="text-3xl font-bold mb-3">No Doubts Available</h2>
            <p className="text-slate-400 max-w-md mb-6">Check back later for new coding questions!</p>
            <button
              onClick={fetchDoubts}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 rounded-xl font-semibold"
            >
              Refresh
            </button>
          </motion.div>
        )}

        {/* Doubts Grid */}
        {!loading && !error && doubts.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {doubts.map((doubt) => {
              const tagsArray = getTagsArray(doubt.tags);
              const isResolved = doubt.status === "resolved";
              const answerCount = getAnswerCount(doubt);
              
              return (
                <motion.div
                  key={doubt._id}
                  variants={itemVariants}
                  className={`group bg-slate-900/50 backdrop-blur-sm border rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                    isResolved 
                      ? "border-green-500/30 hover:border-green-400/50" 
                      : "border-slate-800 hover:border-cyan-400/50"
                  }`}
                >
                  {/* Status Badge */}
                  <div className="relative z-10 p-4 pb-0">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      isResolved 
                        ? "bg-green-500/80 text-white" 
                        : "bg-yellow-500/80 text-white"
                    }`}>
                      {isResolved ? "Resolved" : "Pending"}
                    </span>
                  </div>

                  {/* Image */}
                  {doubt.image && (
                    <div className="relative overflow-hidden h-48">
                      <img
                        src={doubt.image}
                        alt={doubt.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
                    </div>
                  )}

                  <div className="p-6">
                    {/* Title */}
                    <h3 className="text-xl font-bold group-hover:text-cyan-400 transition line-clamp-2 mb-3">
                      {doubt.title}
                    </h3>

                    {/* Description */}
                    <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 mb-4">
                      {doubt.description}
                    </p>

                    {/* Tags */}
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

                    {/* Metadata */}
                    <div className="flex items-center justify-between mb-4 pt-3 border-t border-slate-800">
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

                    {/* Answer Stats */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <FiMessageSquare className="text-cyan-400 text-sm" />
                        <span className="text-sm text-slate-400">
                          {answerCount} {answerCount === 1 ? "Answer" : "Answers"}
                        </span>
                      </div>
                      {!isResolved && (
                        <button
                          onClick={() => markAsResolved(doubt._id)}
                          className="text-xs px-3 py-1 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 transition"
                        >
                          Mark Resolved
                        </button>
                      )}
                    </div>

                    {/* Solve Button */}
                    <button
                      onClick={() => setSelectedDoubt(doubt)}
                      className={`w-full py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                        isResolved
                          ? "bg-slate-800/50 text-slate-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 hover:scale-105 shadow-lg shadow-cyan-500/25"
                      }`}
                      disabled={isResolved}
                    >
                      <FiSend className="text-sm" />
                      {isResolved ? "Already Resolved" : "Solve This Doubt"}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* Solve Doubt Modal */}
      <AnimatePresence>
        {selectedDoubt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
            onClick={() => setSelectedDoubt(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 sm:p-8">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        selectedDoubt.status === "resolved" 
                          ? "bg-green-500/20 text-green-400" 
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}>
                        {selectedDoubt.status || "pending"}
                      </span>
                      <span className="text-xs text-slate-500">
                        {getAnswerCount(selectedDoubt)} answers
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-cyan-400">
                      {selectedDoubt.title}
                    </h2>
                  </div>
                  <button
                    onClick={() => setSelectedDoubt(null)}
                    className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition"
                  >
                    <FiX className="text-xl" />
                  </button>
                </div>

                {/* Doubt Details */}
                {selectedDoubt.image && (
                  <img
                    src={selectedDoubt.image}
                    alt={selectedDoubt.title}
                    className="w-full rounded-xl mb-6"
                  />
                )}

                <div className="mb-6">
                  <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="w-1 h-4 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></span>
                    Question
                  </h3>
                  <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {selectedDoubt.description}
                  </p>
                </div>

                {/* Tags */}
                {selectedDoubt.tags && getTagsArray(selectedDoubt.tags).length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                      <FiTag className="text-cyan-400" />
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {getTagsArray(selectedDoubt.tags).map((tag, idx) => (
                        <span key={idx} className="px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-400 text-sm font-medium">
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Existing Answers */}
                {selectedDoubt.answers && selectedDoubt.answers.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                      <FiMessageSquare className="text-cyan-400" />
                      Answers ({selectedDoubt.answers.length})
                    </h3>
                    <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                      {selectedDoubt.answers.map((answer, idx) => (
                        <div key={idx} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                                <FiUser className="text-cyan-400 text-sm" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-white">
                                  {answer.user?.name || "Anonymous"}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {formatDate(answer.createdAt)}
                                </p>
                              </div>
                            </div>
                            <FiThumbsUp className="text-slate-500 hover:text-cyan-400 cursor-pointer transition" />
                          </div>
                          <p className="text-slate-300 text-sm leading-relaxed">
                            {answer.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add Answer Section */}
                {selectedDoubt.status !== "resolved" && (
                  <div className="border-t border-slate-700 pt-6">
                    <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                      <FiCode className="text-cyan-400" />
                      Your Solution
                    </h3>
                    <textarea
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                      rows="5"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none resize-none"
                      placeholder="Write your solution here... Include code examples, explanations, and best practices..."
                    />
                    
                    {/* Option to mark as resolved */}
                    <div className="flex items-center gap-3 mt-4 mb-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={markAsResolvedAfterAnswer}
                          onChange={(e) => setMarkAsResolvedAfterAnswer(e.target.checked)}
                          className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-0"
                        />
                        <span className="text-sm text-slate-300">
                          Mark this doubt as resolved after submitting answer
                        </span>
                      </label>
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={submitAnswer}
                        disabled={submitting}
                        className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        {submitting ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                          <FiSend />
                        )}
                        {submitting ? "Submitting..." : "Submit Answer"}
                      </button>
                      <button
                        onClick={() => setAnswerText("")}
                        className="px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 transition"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                )}

                {selectedDoubt.status === "resolved" && (
                  <div className="border-t border-slate-700 pt-6">
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
                      <FiCheckCircle className="text-green-400 text-2xl mx-auto mb-2" />
                      <p className="text-green-400 font-semibold">This doubt has been resolved</p>
                      <p className="text-slate-400 text-sm mt-1">Thanks for helping the community!</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

export default DoubtSolver;