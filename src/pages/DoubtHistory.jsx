import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiClock,
  FiTag,
  FiEye,
  FiTrash2,
  FiUser,
  FiImage,
  FiX,
  FiMessageSquare,
  FiRefreshCw,
  FiAlertCircle,
  FiTrendingUp,
  FiAward,
  FiBarChart2,
  FiEdit2,
  FiSave,
  FiThumbsUp,
  FiCode,
  FiCheckCircle,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import API from "../services/api";

function DoubtHistory() {
  const navigate = useNavigate();
  
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoubt, setSelectedDoubt] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [editingDoubt, setEditingDoubt] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    tags: "",
  });

  // Get user from localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user:", error);
        setError("Failed to load user data");
      }
    } else {
      setError("Please login to view your doubts");
    }
  }, []);

  // Helper function to get tags array
  const getTagsArray = (tags) => {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags;
    if (typeof tags === 'string') return tags.split(",").map(tag => tag.trim());
    return [];
  };

  // Helper function to convert tags to string for editing
  const tagsToString = (tags) => {
    if (!tags) return "";
    if (Array.isArray(tags)) return tags.join(", ");
    return tags;
  };

  // Load persisted answers from localStorage
  const loadPersistedAnswers = (apiDoubts) => {
    try {
      const storedAnswers = JSON.parse(localStorage.getItem("doubts_answers") || "{}");
      const storedResolved = JSON.parse(localStorage.getItem("doubts_resolved") || "{}");
      
      return apiDoubts.map(doubt => ({
        ...doubt,
        answers: storedAnswers[doubt._id] || doubt.answers || [],
        status: storedResolved[doubt._id] === true ? "resolved" : (doubt.status || "pending")
      }));
    } catch (error) {
      console.error("Error loading persisted answers:", error);
      return apiDoubts;
    }
  };

  // Fetch doubts
  const fetchDoubts = async () => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    
    if (!currentUser || !currentUser._id) {
      setLoading(false);
      setError("Please login to view your doubts");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await API.get("/doubts");
      
      let allDoubts = [];
      if (response.data) {
        if (Array.isArray(response.data)) {
          allDoubts = response.data;
        } else if (response.data.doubts && Array.isArray(response.data.doubts)) {
          allDoubts = response.data.doubts;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          allDoubts = response.data.data;
        } else {
          allDoubts = [];
        }
      }
      
      // Filter doubts by current user
      const myDoubts = allDoubts.filter(doubt => {
        if (doubt.user && doubt.user._id) {
          return doubt.user._id === currentUser._id;
        }
        if (doubt.userId) {
          return doubt.userId === currentUser._id;
        }
        if (doubt.user === currentUser._id) {
          return true;
        }
        return false;
      });
      
      // Load persisted answers and statuses from localStorage
      const doubtsWithAnswers = loadPersistedAnswers(myDoubts);
      
      // Sort by newest first
      doubtsWithAnswers.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB - dateA;
      });
      
      console.log("Loaded doubts with answers:", doubtsWithAnswers);
      setDoubts(doubtsWithAnswers);
    } catch (error) {
      console.error("Error fetching doubts:", error);
      setError(error.response?.data?.message || "Failed to load doubts");
      toast.error("Failed to load doubts");
    } finally {
      setLoading(false);
    }
  };

  // Delete doubt
  const deleteDoubt = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doubt?")) {
      return;
    }
    
    try {
      await API.delete(`/doubts/${id}`);
      toast.success("Doubt deleted successfully");
      setDoubts(prev => prev.filter(doubt => doubt._id !== id));
      if (selectedDoubt?._id === id) {
        setSelectedDoubt(null);
      }
      if (editingDoubt?._id === id) {
        setEditingDoubt(null);
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete doubt");
    }
  };

  // Edit doubt
  const startEditing = (doubt) => {
    setEditingDoubt(doubt);
    setEditForm({
      title: doubt.title,
      description: doubt.description,
      tags: tagsToString(doubt.tags),
    });
  };

  const cancelEditing = () => {
    setEditingDoubt(null);
    setEditForm({ title: "", description: "", tags: "" });
  };

  const updateDoubt = async (id) => {
    if (!editForm.title.trim()) {
      toast.error("Title is required");
      return;
    }

    try {
      const updateData = {
        title: editForm.title,
        description: editForm.description,
        tags: editForm.tags,
      };
      
      await API.put(`/doubts/${id}`, updateData);
      toast.success("Doubt updated successfully");
      
      setDoubts(prev => prev.map(doubt => 
        doubt._id === id 
          ? { ...doubt, ...updateData }
          : doubt
      ));
      
      setEditingDoubt(null);
      setEditForm({ title: "", description: "", tags: "" });
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Failed to update doubt");
    }
  };

  const formatDate = (date) => {
    if (!date) return "Unknown date";
    try {
      const d = new Date(date);
      const now = new Date();
      const diffTime = Math.abs(now - d);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays} days ago`;
      return d.toLocaleDateString();
    } catch {
      return "Invalid date";
    }
  };

  // Get answer count
  const getAnswerCount = (doubt) => {
    return doubt.answers?.length || 0;
  };

  useEffect(() => {
    if (user && user._id) {
      fetchDoubts();
    } else if (user === null) {
      const timer = setTimeout(() => {
        if (!user && !loading) {
          setLoading(false);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  if (!user && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0a0f2a] to-[#020617] text-white flex items-center justify-center px-4 pt-28 pb-20">
        <div className="text-center">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center mx-auto mb-6 border border-cyan-400/30">
            <FiUser className="text-6xl text-cyan-400" />
          </div>
          <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Welcome Back!</h2>
          <p className="text-slate-400 mb-8">Please login to view your doubt history</p>
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-500/25"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0a0f2a] to-[#020617] text-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0a0f2a] to-[#020617] text-white flex items-center justify-center px-4">
        <div className="text-center">
          <FiAlertCircle className="text-6xl text-red-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Error</h3>
          <p className="text-slate-400">{error}</p>
          <button
            onClick={fetchDoubts}
            className="mt-4 px-6 py-2 bg-cyan-500 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0a0f2a] to-[#020617] text-white px-4 pt-28 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/30 mb-4">
            <FiClock className="text-cyan-400" />
            <span className="text-sm text-cyan-400">Your Posted Doubts</span>
          </div>
          <h1 className="text-4xl font-bold">
            Doubt <span className="text-cyan-400">History</span>
          </h1>
        </div>

        {/* No Doubts */}
        {doubts.length === 0 && (
          <div className="text-center py-20">
            <FiMessageSquare className="text-6xl text-cyan-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Doubts Found</h2>
            <p className="text-slate-400">You haven't asked any doubts yet.</p>
            <button
              onClick={() => navigate("/ask-doubt")}
              className="mt-4 px-6 py-2 bg-cyan-500 rounded-lg hover:bg-cyan-600 transition"
            >
              Ask Your First Doubt
            </button>
          </div>
        )}

        {/* Doubts Grid */}
        {doubts.length > 0 && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-cyan-400">{doubts.length}</p>
                <p className="text-xs text-slate-400">Total Doubts</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-green-400">
                  {doubts.filter(d => d.status === "resolved").length}
                </p>
                <p className="text-xs text-slate-400">Resolved</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-yellow-400">
                  {doubts.filter(d => d.status === "pending").length}
                </p>
                <p className="text-xs text-slate-400">Pending</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-purple-400">
                  {doubts.reduce((sum, d) => sum + getAnswerCount(d), 0)}
                </p>
                <p className="text-xs text-slate-400">Total Answers</p>
              </div>
            </div>

            {/* Refresh Button */}
            <div className="flex justify-end mb-4">
              <button
                onClick={fetchDoubts}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-lg hover:bg-slate-700 transition text-sm"
              >
                <FiRefreshCw className="text-cyan-400" />
                Refresh
              </button>
            </div>

            {/* Doubts Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doubts.map((doubt) => (
                <div
                  key={doubt._id}
                  className="bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700 hover:border-cyan-400/50 transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Image */}
                  {doubt.image && (
                    <img
                      src={doubt.image}
                      alt={doubt.title}
                      className="w-full h-40 object-cover"
                    />
                  )}
                  
                  <div className="p-4">
                    {/* Status */}
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        doubt.status === "resolved" 
                          ? "bg-green-500/20 text-green-400" 
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}>
                        {doubt.status || "pending"}
                      </span>
                      <span className="text-xs text-slate-500">
                        {getAnswerCount(doubt)} answers
                      </span>
                    </div>
                    
                    {/* Title */}
                    <h3 className="font-bold text-lg mb-2 line-clamp-2">
                      {doubt.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-slate-400 text-sm line-clamp-2 mb-3">
                      {doubt.description}
                    </p>
                    
                    {/* Tags */}
                    {doubt.tags && getTagsArray(doubt.tags).length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {getTagsArray(doubt.tags).slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="text-xs px-2 py-0.5 bg-cyan-500/10 rounded-full text-cyan-400">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <FiClock className="text-cyan-400" />
                        {formatDate(doubt.createdAt)}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedDoubt(doubt)}
                          className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 transition"
                          title="View Details"
                        >
                          <FiEye className="text-cyan-400 text-sm" />
                        </button>
                        <button
                          onClick={() => startEditing(doubt)}
                          className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 transition"
                          title="Edit"
                        >
                          <FiEdit2 className="text-blue-400 text-sm" />
                        </button>
                        <button
                          onClick={() => deleteDoubt(doubt._id)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition"
                          title="Delete"
                        >
                          <FiTrash2 className="text-red-400 text-sm" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Detail Modal */}
      {selectedDoubt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedDoubt(null)}
        >
          <div
            className="bg-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-cyan-400">{selectedDoubt.title}</h2>
                <button onClick={() => setSelectedDoubt(null)} className="p-1">
                  <FiX className="text-xl" />
                </button>
              </div>

              {selectedDoubt.image && (
                <img src={selectedDoubt.image} alt="" className="w-full rounded-lg mb-4" />
              )}

              <div className="mb-4">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-slate-300">{selectedDoubt.description}</p>
              </div>

              {/* Answers Section */}
              {selectedDoubt.answers && selectedDoubt.answers.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold mb-3">Answers ({selectedDoubt.answers.length})</h3>
                  <div className="space-y-3">
                    {selectedDoubt.answers.map((answer, idx) => (
                      <div key={idx} className="bg-slate-700/50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center">
                            <FiUser className="text-cyan-400 text-xs" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{answer.user?.name || "Anonymous"}</p>
                            <p className="text-xs text-slate-500">{formatDate(answer.createdAt)}</p>
                          </div>
                          {selectedDoubt.status === "resolved" && idx === selectedDoubt.answers.length - 1 && (
                            <span className="ml-auto text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full flex items-center gap-1">
                              <FiCheckCircle className="text-xs" />
                              Solution
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-300 pl-8">{answer.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(!selectedDoubt.answers || selectedDoubt.answers.length === 0) && (
                <div className="bg-slate-700/30 rounded-lg p-4 text-center mb-4">
                  <FiCode className="text-3xl text-slate-500 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">No answers yet</p>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t border-slate-700">
                <button
                  onClick={() => {
                    startEditing(selectedDoubt);
                    setSelectedDoubt(null);
                  }}
                  className="flex-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 py-2 rounded-lg transition"
                >
                  <FiEdit2 className="inline mr-1" /> Edit
                </button>
                <button
                  onClick={() => {
                    deleteDoubt(selectedDoubt._id);
                    setSelectedDoubt(null);
                  }}
                  className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 py-2 rounded-lg transition"
                >
                  <FiTrash2 className="inline mr-1" /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingDoubt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={cancelEditing}
        >
          <div
            className="bg-slate-800 rounded-xl max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Edit Doubt</h3>
              <div className="mb-3">
                <label className="block text-sm mb-1">Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full bg-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm mb-1">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows="4"
                  className="w-full bg-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={editForm.tags}
                  onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                  className="w-full bg-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => updateDoubt(editingDoubt._id)}
                  className="flex-1 bg-green-500 hover:bg-green-600 py-2 rounded-lg transition"
                >
                  <FiSave className="inline mr-1" /> Save
                </button>
                <button
                  onClick={cancelEditing}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 py-2 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoubtHistory;