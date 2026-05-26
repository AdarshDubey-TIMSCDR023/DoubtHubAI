import { useEffect, useState } from "react";
import {
  FiUser,
  FiMail,
  FiEdit,
  FiCamera,
  FiLayers,
  FiImage,
  FiLock,
  FiKey,
  FiShield,
  FiCheckCircle,
  FiCalendar,
  FiMapPin,
  FiGlobe,
  FiPlus,
  FiTrash2,
  FiSave,
  FiX,
  FiGithub,
  FiTwitter,
  FiLinkedin,
  FiCode,
  FiBell,
  FiMonitor,
  FiStar,
  FiTrendingUp,
  FiAward,
  FiMessageSquare,
  FiThumbsUp,
  FiArrowLeft,
  FiRefreshCw,
} from "react-icons/fi";
import toast from "react-hot-toast";
import API from "../services/api";

function Profile() {
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const [user, setUser] = useState(storedUser);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [profilePic, setProfilePic] = useState(storedUser?.profilePic || "");
  const [preview, setPreview] = useState(storedUser?.profilePic || "");
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalDoubts: 0,
    resolvedDoubts: 0,
    totalAnswers: 0,
    helpfulAnswers: 0,
    reputation: 0,
    rank: "New",
    percentile: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newTech, setNewTech] = useState("");
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    darkMode: true,
    language: "English",
  });
  
  const [editForm, setEditForm] = useState({
    name: storedUser?.name || "",
    bio: storedUser?.bio || "Passionate developer exploring AI, Web Development, React.js, Node.js, MongoDB, and building modern full-stack applications.",
    location: storedUser?.location || "San Francisco, CA",
    website: storedUser?.website || "",
    github: storedUser?.github || "",
    twitter: storedUser?.twitter || "",
    linkedin: storedUser?.linkedin || "",
    techStack: storedUser?.techStack || ["React.js", "Node.js", "MongoDB", "TailwindCSS", "Express.js", "AI/ML"],
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const fetchStats = async () => {
    try {
      setRefreshing(true);
      const { data: doubtsData } = await API.get("/doubts");
      const doubts = doubtsData.doubts || [];
      const myDoubts = doubts.filter((doubt) => doubt.user?._id === user?._id);
      const resolved = myDoubts.filter((doubt) => doubt.status === "resolved");
      
      const { data: answersData } = await API.get("/answers");
      const answers = answersData.answers || [];
      const myAnswers = answers.filter((answer) => answer.user?._id === user?._id);
      const helpfulAnswers = myAnswers.filter((answer) => answer.helpful === true).length;
      
      const reputation = 1000 + (myDoubts.length * 5) + (helpfulAnswers * 10) + (resolved.length * 15);
      
      let rank = "New";
      let percentile = 0;
      if (reputation > 5000) { rank = "Legend"; percentile = 99; }
      else if (reputation > 2000) { rank = "Expert"; percentile = 95; }
      else if (reputation > 1000) { rank = "Pro"; percentile = 85; }
      else if (reputation > 500) { rank = "Intermediate"; percentile = 70; }
      else if (reputation > 100) { rank = "Beginner"; percentile = 50; }
      
      setStats({
        totalDoubts: myDoubts.length,
        resolvedDoubts: resolved.length,
        totalAnswers: myAnswers.length,
        helpfulAnswers: helpfulAnswers,
        reputation: reputation,
        rank: rank,
        percentile: percentile,
      });
      
      const recent = [
        ...myDoubts.slice(0, 3).map(d => ({ type: 'doubt', title: d.title, date: d.createdAt, status: d.status })),
        ...myAnswers.slice(0, 3).map(a => ({ type: 'answer', title: a.content?.substring(0, 50), date: a.createdAt, helpful: a.helpful }))
      ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);
      
      setRecentActivity(recent);
      toast.success("Stats refreshed!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to refresh stats");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchStats();
    }
  }, [user?._id]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", file);

      const uploadResponse = await fetch(
        "https://doubthub-ai-backend.onrender.com/api/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const uploadData = await uploadResponse.json();
      const imageUrl = uploadData.imageUrl || uploadData.url;
      setProfilePic(imageUrl);

      const updatedUser = { ...user, profilePic: imageUrl };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("Profile picture updated!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      const updatedUser = { ...user, ...editForm };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTech = () => {
    if (newTech.trim() && !editForm.techStack.includes(newTech.trim())) {
      setEditForm({
        ...editForm,
        techStack: [...editForm.techStack, newTech.trim()]
      });
      setNewTech("");
    }
  };

  const handleRemoveTech = (techToRemove) => {
    setEditForm({
      ...editForm,
      techStack: editForm.techStack.filter((tech) => tech !== techToRemove)
    });
  };

  const handleResetPassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords don't match!");
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters!");
      return;
    }

    try {
      setLoading(true);
      await API.post("/users/reset-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      
      toast.success("Password changed successfully!");
      setShowPasswordModal(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({
      name: user?.name || "",
      bio: user?.bio || "Passionate developer exploring AI, Web Development, React.js, Node.js, MongoDB, and building modern full-stack applications.",
      location: user?.location || "San Francisco, CA",
      website: user?.website || "",
      github: user?.github || "",
      twitter: user?.twitter || "",
      linkedin: user?.linkedin || "",
      techStack: user?.techStack || ["React.js", "Node.js", "MongoDB", "TailwindCSS", "Express.js", "AI/ML"],
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: <FiUser size={16} /> },
    { id: "activity", label: "Activity", icon: <FiTrendingUp size={16} /> },
    { id: "tech", label: "Tech", icon: <FiCode size={16} /> },
    { id: "settings", label: "Settings", icon: <FiBell size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Main Container - Responsive padding */}
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 lg:py-8">
        
        {/* Header Section */}
        <div className="max-w-7xl mx-auto mb-5 sm:mb-6 md:mb-8">
          {/* Mobile Header */}
          <div className="flex items-center justify-between sm:hidden">
            <button 
              onClick={() => window.history.back()}
              className="p-2 rounded-lg bg-slate-800/50 text-slate-400 active:scale-95 transition"
            >
              <FiArrowLeft size={20} />
            </button>
            <h1 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Profile
            </h1>
            <button 
              onClick={fetchStats} 
              disabled={refreshing}
              className="p-2 rounded-lg bg-slate-800/50 text-slate-400 active:scale-95 transition"
            >
              <FiRefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
            </button>
          </div>

          {/* Tablet/Desktop Header */}
          <div className="hidden sm:flex sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 rounded-full border border-cyan-500/20 mb-2 md:mb-3">
                <FiStar className="text-cyan-400 text-xs sm:text-sm" />
                <span className="text-cyan-400 text-xs sm:text-sm font-semibold">
                  {stats.rank} Member • Top {stats.percentile}%
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Profile Settings
              </h1>
              <p className="text-slate-400 mt-1 text-xs sm:text-sm">Manage your account settings and preferences</p>
            </div>
            <button 
              onClick={fetchStats} 
              disabled={refreshing}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 text-slate-400 hover:text-cyan-400 transition-all"
            >
              <FiRefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
              <span className="text-sm">Refresh Stats</span>
            </button>
          </div>
        </div>

        {/* Mobile Tabs - Bottom Navigation Style */}
        <div className="sm:hidden max-w-7xl mx-auto mb-5">
          <div className="flex gap-1 p-1 bg-slate-800/50 rounded-xl border border-slate-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-lg text-xs font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg"
                    : "text-slate-400 hover:text-cyan-400"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-4 md:gap-5 lg:gap-6">
            
            {/* Left Column - Profile Card */}
            <div className={`w-full lg:w-1/3 transition-all duration-300 ${
              activeTab !== "overview" ? "hidden lg:block" : "block"
            }`}>
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-slate-700 overflow-hidden sticky top-4 shadow-xl">
                
                {/* Cover Image */}
                <div className="h-20 sm:h-24 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 relative">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                </div>
                
                {/* Profile Picture */}
                <div className="relative -mt-10 sm:-mt-12 flex justify-center px-4">
                  <div className="relative group">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl border-4 border-slate-800 overflow-hidden bg-slate-700 shadow-xl">
                      {preview ? (
                        <img src={preview} alt="profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-500/20 to-purple-500/20">
                          <FiUser className="text-2xl sm:text-3xl text-white/60" />
                        </div>
                      )}
                    </div>
                    <label className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition active:scale-95">
                      <FiCamera className="text-white text-xs sm:text-sm" />
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" disabled={loading} />
                    </label>
                  </div>
                </div>

                {/* User Info */}
                <div className="text-center px-3 sm:px-4 py-3 sm:py-4">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="text-base sm:text-lg md:text-xl font-bold bg-slate-700 border border-slate-600 rounded-lg px-2 sm:px-3 py-1.5 text-center w-full text-white focus:border-cyan-500 outline-none"
                    />
                  ) : (
                    <h2 className="text-base sm:text-lg md:text-xl font-bold text-white">{user?.name || "Adarsh Dubey"}</h2>
                  )}
                  
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-2 text-slate-400">
                    <FiMail className="text-cyan-400 text-xs sm:text-sm flex-shrink-0" />
                    <span className="text-[11px] sm:text-xs truncate max-w-[200px] sm:max-w-full">{user?.email || "dadarsh360@gmail.com"}</span>
                  </div>

                  {!isEditing && editForm.location && (
                    <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-2 text-slate-500 text-[11px] sm:text-xs">
                      <FiMapPin className="text-cyan-400 flex-shrink-0" />
                      <span className="truncate">{editForm.location}</span>
                    </div>
                  )}

                  <div className="mt-2 sm:mt-3 inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-yellow-500/10 rounded-full border border-yellow-500/20">
                    <FiAward className="text-yellow-400 text-xs sm:text-sm" />
                    <span className="text-yellow-400 text-xs sm:text-sm font-semibold">{stats.reputation} Reputation</span>
                  </div>

                  <div className="mt-3 sm:mt-4 flex gap-2">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-semibold transition text-[11px] sm:text-xs shadow-lg active:scale-95"
                    >
                      <FiEdit size={12} />
                      Edit
                    </button>
                    <button
                      onClick={() => setShowPasswordModal(true)}
                      className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 bg-slate-700 hover:bg-slate-600 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-semibold transition text-[11px] sm:text-xs active:scale-95"
                    >
                      <FiLock size={12} />
                      Security
                    </button>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="border-t border-slate-700 p-3 sm:p-4">
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <div className="text-center p-2 sm:p-2.5 bg-slate-700/30 rounded-lg sm:rounded-xl">
                      <FiLayers className="text-cyan-400 text-base sm:text-lg mx-auto mb-1 sm:mb-1.5" />
                      <p className="text-base sm:text-lg md:text-xl font-bold text-white">{stats.totalDoubts}</p>
                      <p className="text-[10px] sm:text-xs text-slate-400">Total Doubts</p>
                    </div>
                    <div className="text-center p-2 sm:p-2.5 bg-slate-700/30 rounded-lg sm:rounded-xl">
                      <FiCheckCircle className="text-green-400 text-base sm:text-lg mx-auto mb-1 sm:mb-1.5" />
                      <p className="text-base sm:text-lg md:text-xl font-bold text-white">{stats.resolvedDoubts}</p>
                      <p className="text-[10px] sm:text-xs text-slate-400">Resolved</p>
                    </div>
                    <div className="text-center p-2 sm:p-2.5 bg-slate-700/30 rounded-lg sm:rounded-xl">
                      <FiMessageSquare className="text-purple-400 text-base sm:text-lg mx-auto mb-1 sm:mb-1.5" />
                      <p className="text-base sm:text-lg md:text-xl font-bold text-white">{stats.totalAnswers}</p>
                      <p className="text-[10px] sm:text-xs text-slate-400">Answers</p>
                    </div>
                    <div className="text-center p-2 sm:p-2.5 bg-slate-700/30 rounded-lg sm:rounded-xl">
                      <FiThumbsUp className="text-pink-400 text-base sm:text-lg mx-auto mb-1 sm:mb-1.5" />
                      <p className="text-base sm:text-lg md:text-xl font-bold text-white">{stats.helpfulAnswers}</p>
                      <p className="text-[10px] sm:text-xs text-slate-400">Helpful</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-slate-700">
                    <div className="flex justify-between text-[9px] sm:text-xs text-slate-400 mb-1">
                      <span>Contribution Level</span>
                      <span>{stats.percentile}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-1.5 sm:h-2">
                      <div 
                        className="bg-gradient-to-r from-cyan-500 to-purple-500 h-1.5 sm:h-2 rounded-full transition-all duration-500"
                        style={{ width: `${stats.percentile}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Content */}
            <div className="w-full lg:w-2/3 space-y-4 sm:space-y-5 md:space-y-6">
              
              {/* About Me Section */}
              {(activeTab === "overview") && (
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-slate-700 p-4 sm:p-5 md:p-6 shadow-xl">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center">
                      <FiImage className="text-white text-base sm:text-lg" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg md:text-xl font-bold text-white">About Me</h2>
                      <p className="text-[10px] sm:text-xs text-slate-400">Personal information</p>
                    </div>
                  </div>
                  
                  {isEditing ? (
                    <div className="space-y-3 sm:space-y-4">
                      <textarea
                        value={editForm.bio}
                        onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg sm:rounded-xl p-2.5 sm:p-3 text-slate-200 outline-none focus:border-cyan-500 resize-none text-xs sm:text-sm"
                        rows={4}
                        placeholder="Write something about yourself..."
                      />
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                        <input
                          type="text"
                          value={editForm.location}
                          onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                          placeholder="Location"
                          className="bg-slate-700 border border-slate-600 rounded-lg sm:rounded-xl p-2 sm:p-2.5 text-white text-xs sm:text-sm outline-none focus:border-cyan-500"
                        />
                        <input
                          type="url"
                          value={editForm.website}
                          onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                          placeholder="Website"
                          className="bg-slate-700 border border-slate-600 rounded-lg sm:rounded-xl p-2 sm:p-2.5 text-white text-xs sm:text-sm outline-none focus:border-cyan-500"
                        />
                        <input
                          type="text"
                          value={editForm.github}
                          onChange={(e) => setEditForm({ ...editForm, github: e.target.value })}
                          placeholder="GitHub username"
                          className="bg-slate-700 border border-slate-600 rounded-lg sm:rounded-xl p-2 sm:p-2.5 text-white text-xs sm:text-sm outline-none focus:border-cyan-500"
                        />
                        <input
                          type="text"
                          value={editForm.twitter}
                          onChange={(e) => setEditForm({ ...editForm, twitter: e.target.value })}
                          placeholder="Twitter username"
                          className="bg-slate-700 border border-slate-600 rounded-lg sm:rounded-xl p-2 sm:p-2.5 text-white text-xs sm:text-sm outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
                        {editForm.bio}
                      </p>
                      
                      <div className="flex gap-2 mt-3 sm:mt-4 flex-wrap">
                        {editForm.github && (
                          <a href={`https://github.com/${editForm.github}`} target="_blank" rel="noopener noreferrer" className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition hover:scale-110 active:scale-95">
                            <FiGithub className="text-slate-300 text-xs sm:text-sm" />
                          </a>
                        )}
                        {editForm.twitter && (
                          <a href={`https://twitter.com/${editForm.twitter}`} target="_blank" rel="noopener noreferrer" className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition hover:scale-110 active:scale-95">
                            <FiTwitter className="text-slate-300 text-xs sm:text-sm" />
                          </a>
                        )}
                        {editForm.linkedin && (
                          <a href={`https://linkedin.com/in/${editForm.linkedin}`} target="_blank" rel="noopener noreferrer" className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition hover:scale-110 active:scale-95">
                            <FiLinkedin className="text-slate-300 text-xs sm:text-sm" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Recent Activity Section */}
              {(activeTab === "overview" || activeTab === "activity") && (
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-slate-700 p-4 sm:p-5 md:p-6 shadow-xl">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl bg-gradient-to-r from-green-500 to-cyan-500 flex items-center justify-center">
                      <FiTrendingUp className="text-white text-base sm:text-lg" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg md:text-xl font-bold text-white">Recent Activity</h2>
                      <p className="text-[10px] sm:text-xs text-slate-400">Your latest contributions</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 sm:space-y-3">
                    {recentActivity.length > 0 ? (
                      recentActivity.map((activity, idx) => (
                        <div key={idx} className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-slate-700/30 rounded-lg sm:rounded-xl">
                          <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ${
                            activity.type === 'doubt' ? 'bg-cyan-500/20' : 'bg-purple-500/20'
                          }`}>
                            {activity.type === 'doubt' ? (
                              <FiMessageSquare className="text-cyan-400 text-xs sm:text-sm" />
                            ) : (
                              <FiThumbsUp className="text-purple-400 text-xs sm:text-sm" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-xs sm:text-sm font-medium break-words line-clamp-2">
                              {activity.type === 'doubt' ? activity.title : (activity.title || '') + '...'}
                            </p>
                            <div className="flex items-center gap-1.5 sm:gap-2 mt-1 flex-wrap">
                              <span className="text-[9px] sm:text-xs text-slate-400">{formatDate(activity.date)}</span>
                              {activity.type === 'doubt' && activity.status === 'resolved' && (
                                <span className="text-[8px] sm:text-[9px] bg-green-500/20 text-green-400 px-1.5 sm:px-2 py-0.5 rounded-full">Resolved</span>
                              )}
                              {activity.type === 'answer' && activity.helpful && (
                                <span className="text-[8px] sm:text-[9px] bg-pink-500/20 text-pink-400 px-1.5 sm:px-2 py-0.5 rounded-full">Helpful</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 sm:py-8 text-slate-400">
                        <FiMessageSquare className="text-3xl sm:text-4xl mx-auto mb-2 opacity-50" />
                        <p className="text-xs sm:text-sm">No activity yet</p>
                        <p className="text-[10px] sm:text-xs mt-1">Start asking doubts or answering questions!</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tech Stack Section */}
              {(activeTab === "overview" || activeTab === "tech") && (
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-slate-700 p-4 sm:p-5 md:p-6 shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3 sm:mb-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                        <FiCode className="text-white text-base sm:text-lg" />
                      </div>
                      <div>
                        <h2 className="text-base sm:text-lg md:text-xl font-bold text-white">Tech Stack</h2>
                        <p className="text-[10px] sm:text-xs text-slate-400">Technologies I work with</p>
                      </div>
                    </div>
                    {isEditing && (
                      <div className="text-[10px] sm:text-xs text-cyan-400 font-semibold">
                        Click + to add
                      </div>
                    )}
                  </div>
                  
                  {isEditing ? (
                    <div>
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-3 sm:mb-4">
                        <input
                          type="text"
                          value={newTech}
                          onChange={(e) => setNewTech(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && handleAddTech()}
                          placeholder="Add technology..."
                          className="flex-1 bg-slate-700 border border-slate-600 rounded-lg sm:rounded-xl p-2 sm:p-2.5 text-white text-xs sm:text-sm outline-none focus:border-cyan-500"
                        />
                        <button
                          onClick={handleAddTech}
                          className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 transition text-xs sm:text-sm font-semibold active:scale-95"
                        >
                          <FiPlus className="inline mr-1" size={12} /> Add
                        </button>
                      </div>
                      
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {editForm.techStack.map((tech) => (
                          <div key={tech} className="group relative px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-lg sm:rounded-xl text-slate-200 text-[11px] sm:text-sm">
                            <span>{tech}</span>
                            <button onClick={() => handleRemoveTech(tech)} className="ml-1.5 sm:ml-2 text-red-400 opacity-0 group-hover:opacity-100 transition">
                              <FiTrash2 size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {editForm.techStack.map((tech) => (
                        <span key={tech} className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-lg sm:rounded-xl text-[10px] sm:text-xs text-slate-200">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Preferences Section */}
              {(activeTab === "overview" || activeTab === "settings") && (
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-slate-700 p-4 sm:p-5 md:p-6 shadow-xl">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center">
                      <FiBell className="text-white text-base sm:text-lg" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg md:text-xl font-bold text-white">Preferences</h2>
                      <p className="text-[10px] sm:text-xs text-slate-400">Customize your experience</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 sm:p-3 bg-slate-700/30 rounded-lg sm:rounded-xl">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <FiBell className="text-cyan-400 text-sm sm:text-base flex-shrink-0" />
                        <div>
                          <p className="text-white font-medium text-xs sm:text-sm">Email Notifications</p>
                          <p className="text-[9px] sm:text-xs text-slate-400">Receive updates about your doubts</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setPreferences({...preferences, emailNotifications: !preferences.emailNotifications})}
                        className={`relative inline-flex h-5 w-9 sm:h-5 sm:w-10 items-center rounded-full transition-all ${
                          preferences.emailNotifications ? 'bg-gradient-to-r from-cyan-500 to-purple-500' : 'bg-slate-600'
                        }`}
                      >
                        <span className={`inline-block h-3 w-3 sm:h-3.5 sm:w-3.5 transform rounded-full bg-white transition-all ${
                          preferences.emailNotifications ? "translate-x-4 sm:translate-x-5" : "translate-x-1"
                        }`} />
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 sm:p-3 bg-slate-700/30 rounded-lg sm:rounded-xl">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <FiMonitor className="text-purple-400 text-sm sm:text-base flex-shrink-0" />
                        <div>
                          <p className="text-white font-medium text-xs sm:text-sm">Dark Mode</p>
                          <p className="text-[9px] sm:text-xs text-slate-400">Always enabled for best experience</p>
                        </div>
                      </div>
                      <FiCheckCircle className="text-green-400 text-base sm:text-lg flex-shrink-0" />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 sm:p-3 bg-slate-700/30 rounded-lg sm:rounded-xl">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <FiGlobe className="text-pink-400 text-sm sm:text-base flex-shrink-0" />
                        <div>
                          <p className="text-white font-medium text-xs sm:text-sm">Language</p>
                          <p className="text-[9px] sm:text-xs text-slate-400">English (United States)</p>
                        </div>
                      </div>
                      <FiCheckCircle className="text-green-400 text-base sm:text-lg flex-shrink-0" />
                    </div>
                  </div>
                </div>
              )}

              {/* Edit Actions - Sticky on Mobile */}
              {isEditing && (
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sticky bottom-3 sm:bottom-4 bg-slate-900/95 backdrop-blur-lg p-3 sm:p-4 rounded-lg sm:rounded-xl border border-slate-700 shadow-xl z-10">
                  <button
                    onClick={handleUpdateProfile}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-semibold transition flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm active:scale-95"
                  >
                    {loading ? (
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <FiSave size={12} />
                    )}
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-semibold transition flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm active:scale-95"
                  >
                    <FiX size={12} />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-slate-800 rounded-xl sm:rounded-2xl border border-slate-700 max-w-md w-full p-4 sm:p-5 md:p-6 shadow-2xl mx-3 sm:mx-4">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center">
                <FiKey className="text-white text-base sm:text-lg" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-white">Reset Password</h2>
                <p className="text-[10px] sm:text-xs text-slate-400">Secure your account</p>
              </div>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-[10px] sm:text-xs text-slate-400 mb-1">Current Password</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg sm:rounded-xl p-2 sm:p-2.5 text-white text-xs sm:text-sm outline-none focus:border-cyan-500"
                  placeholder="Enter current password"
                />
              </div>
              
              <div>
                <label className="block text-[10px] sm:text-xs text-slate-400 mb-1">New Password</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg sm:rounded-xl p-2 sm:p-2.5 text-white text-xs sm:text-sm outline-none focus:border-cyan-500"
                  placeholder="Enter new password (min 6 characters)"
                />
              </div>
              
              <div>
                <label className="block text-[10px] sm:text-xs text-slate-400 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg sm:rounded-xl p-2 sm:p-2.5 text-white text-xs sm:text-sm outline-none focus:border-cyan-500"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-5 sm:mt-6">
              <button
                onClick={handleResetPassword}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-semibold transition text-xs sm:text-sm active:scale-95"
              >
                {loading ? "Changing..." : "Change Password"}
              </button>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-semibold transition text-xs sm:text-sm active:scale-95"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
