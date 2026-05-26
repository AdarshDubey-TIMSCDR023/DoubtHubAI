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
} from "react-icons/fi";
import toast from "react-hot-toast";
import API from "../services/api";

function Profile() {
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const [user, setUser] = useState(storedUser);
  const [loading, setLoading] = useState(false);
  const [profilePic, setProfilePic] = useState(storedUser?.profilePic || "");
  const [preview, setPreview] = useState(storedUser?.profilePic || "");
  const [stats, setStats] = useState({
    totalDoubts: 0,
    resolvedDoubts: 0,
    helpfulAnswers: 0,
    reputation: 1250,
  });
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
      const { data } = await API.get("/doubts");
      const doubts = data.doubts || [];
      const myDoubts = doubts.filter((doubt) => doubt.user?._id === user?._id);
      const resolved = myDoubts.filter((doubt) => doubt.status === "resolved");
      setStats({
        totalDoubts: myDoubts.length,
        resolvedDoubts: resolved.length,
        helpfulAnswers: Math.floor(Math.random() * 500) + 100,
        reputation: 1250 + myDoubts.length * 10,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

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
      techStack: editForm.techStack.filter(function(tech) {
        return tech !== techToRemove;
      })
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="mb-6 sm:mb-8 lg:mb-10 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500/10 rounded-full border border-blue-500/20 mb-3 sm:mb-4">
            <FiStar className="text-blue-400 text-xs sm:text-sm" />
            <span className="text-blue-400 text-xs sm:text-sm font-semibold">Premium Account</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Profile Settings
          </h1>
          <p className="text-gray-400 mt-2 sm:mt-3 text-sm sm:text-base lg:text-lg">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-700 overflow-hidden sticky top-8 shadow-xl">
              <div className="h-20 sm:h-24 lg:h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
              </div>
              
              <div className="relative -mt-10 sm:-mt-12 lg:-mt-16 flex justify-center">
                <div className="relative group">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-xl sm:rounded-2xl border-4 border-gray-800 overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800 shadow-2xl">
                    {preview ? (
                      <img
                        src={preview}
                        alt="profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                        <FiUser className="text-2xl sm:text-3xl lg:text-4xl text-white/60" />
                      </div>
                    )}
                  </div>
                  
                  <label className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 flex items-center justify-center cursor-pointer shadow-lg transition-all duration-200 hover:scale-110">
                    <FiCamera className="text-white text-xs sm:text-sm" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      disabled={loading}
                    />
                  </label>
                </div>
              </div>

              <div className="text-center px-4 sm:px-6 py-3 sm:py-4">
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="text-lg sm:text-xl lg:text-2xl font-bold bg-gray-700 border border-gray-600 rounded-lg sm:rounded-xl px-2 sm:px-3 py-1 sm:py-2 text-center w-full text-white focus:border-blue-500 focus:outline-none"
                  />
                ) : (
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{user?.name}</h2>
                )}
                
                <div className="flex items-center justify-center gap-2 mt-2 text-gray-400">
                  <FiMail className="text-blue-400 text-xs sm:text-sm flex-shrink-0" />
                  <span className="text-xs sm:text-sm break-all">{user?.email}</span>
                </div>

                {!isEditing && editForm.location && (
                  <div className="flex items-center justify-center gap-2 mt-2 text-gray-500 text-xs sm:text-sm">
                    <FiMapPin className="text-blue-400 flex-shrink-0" />
                    <span>{editForm.location}</span>
                  </div>
                )}

                <div className="mt-3 sm:mt-4 inline-flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-yellow-500/10 rounded-full border border-yellow-500/20">
                  <FiAward className="text-yellow-400 text-xs sm:text-sm" />
                  <span className="text-yellow-400 text-xs sm:text-sm font-semibold">{stats.reputation} Reputation</span>
                </div>

                <div className="mt-4 sm:mt-6 flex gap-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 flex items-center justify-center gap-1 sm:gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-semibold transition text-xs sm:text-sm shadow-lg"
                  >
                    <FiEdit size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="flex-1 flex items-center justify-center gap-1 sm:gap-2 bg-gray-700 hover:bg-gray-600 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-semibold transition text-xs sm:text-sm"
                  >
                    <FiLock size={14} />
                    Security
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-700 p-4 sm:p-6">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="text-center p-2 sm:p-3 bg-gray-700/30 rounded-lg sm:rounded-xl">
                    <FiLayers className="text-blue-400 text-base sm:text-xl mx-auto mb-1 sm:mb-2" />
                    <p className="text-lg sm:text-2xl font-bold text-white">{stats.totalDoubts}</p>
                    <p className="text-xs text-gray-400">Total Doubts</p>
                  </div>
                  
                  <div className="text-center p-2 sm:p-3 bg-gray-700/30 rounded-lg sm:rounded-xl">
                    <FiCheckCircle className="text-green-400 text-base sm:text-xl mx-auto mb-1 sm:mb-2" />
                    <p className="text-lg sm:text-2xl font-bold text-white">{stats.resolvedDoubts}</p>
                    <p className="text-xs text-gray-400">Resolved</p>
                  </div>

                  <div className="text-center p-2 sm:p-3 bg-gray-700/30 rounded-lg sm:rounded-xl">
                    <FiCode className="text-purple-400 text-base sm:text-xl mx-auto mb-1 sm:mb-2" />
                    <p className="text-lg sm:text-2xl font-bold text-white">{stats.helpfulAnswers}</p>
                    <p className="text-xs text-gray-400">Helpful Answers</p>
                  </div>

                  <div className="text-center p-2 sm:p-3 bg-gray-700/30 rounded-lg sm:rounded-xl">
                    <FiTrendingUp className="text-pink-400 text-base sm:text-xl mx-auto mb-1 sm:mb-2" />
                    <p className="text-lg sm:text-2xl font-bold text-white">Top 5%</p>
                    <p className="text-xs text-gray-400">Global Rank</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-700 p-4 sm:p-6 lg:p-8 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <FiImage className="text-white text-base sm:text-lg lg:text-xl" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">About Me</h2>
                  <p className="text-xs sm:text-sm text-gray-400">Personal information and bio</p>
                </div>
              </div>
              
              {isEditing ? (
                <>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg sm:rounded-xl p-3 sm:p-4 text-gray-200 outline-none focus:border-blue-500 resize-none text-sm sm:text-base"
                    rows={4}
                    placeholder="Write something about yourself..."
                  />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4">
                    <div>
                      <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Location</label>
                      <input
                        type="text"
                        value={editForm.location}
                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                        placeholder="Your location"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg sm:rounded-xl p-2 sm:p-3 text-white text-sm sm:text-base outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Website</label>
                      <input
                        type="url"
                        value={editForm.website}
                        onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                        placeholder="https://yourwebsite.com"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg sm:rounded-xl p-2 sm:p-3 text-white text-sm sm:text-base outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <p className="text-gray-300 leading-relaxed text-sm sm:text-base lg:text-lg">
                    {editForm.bio}
                  </p>
                  {editForm.website && (
                    <a 
                      href={editForm.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-3 sm:mt-4 text-blue-400 hover:text-blue-300 transition text-sm sm:text-base"
                    >
                      <FiGlobe />
                      {editForm.website}
                    </a>
                  )}
                </div>
              )}

              {isEditing ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6">
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">GitHub</label>
                    <input
                      type="text"
                      value={editForm.github}
                      onChange={(e) => setEditForm({ ...editForm, github: e.target.value })}
                      placeholder="GitHub username"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg sm:rounded-xl p-2 sm:p-3 text-white text-sm sm:text-base outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Twitter</label>
                    <input
                      type="text"
                      value={editForm.twitter}
                      onChange={(e) => setEditForm({ ...editForm, twitter: e.target.value })}
                      placeholder="Twitter username"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg sm:rounded-xl p-2 sm:p-3 text-white text-sm sm:text-base outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">LinkedIn</label>
                    <input
                      type="text"
                      value={editForm.linkedin}
                      onChange={(e) => setEditForm({ ...editForm, linkedin: e.target.value })}
                      placeholder="LinkedIn username"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg sm:rounded-xl p-2 sm:p-3 text-white text-sm sm:text-base outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6">
                  {editForm.github && (
                    <a href={"https://github.com/" + editForm.github} target="_blank" rel="noopener noreferrer" className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-lg sm:rounded-xl bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition transform hover:scale-110">
                      <FiGithub className="text-gray-300 text-sm sm:text-base" />
                    </a>
                  )}
                  {editForm.twitter && (
                    <a href={"https://twitter.com/" + editForm.twitter} target="_blank" rel="noopener noreferrer" className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-lg sm:rounded-xl bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition transform hover:scale-110">
                      <FiTwitter className="text-gray-300 text-sm sm:text-base" />
                    </a>
                  )}
                  {editForm.linkedin && (
                    <a href={"https://linkedin.com/in/" + editForm.linkedin} target="_blank" rel="noopener noreferrer" className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-lg sm:rounded-xl bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition transform hover:scale-110">
                      <FiLinkedin className="text-gray-300 text-sm sm:text-base" />
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-700 p-4 sm:p-6 lg:p-8 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <FiCode className="text-white text-base sm:text-lg lg:text-xl" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">Tech Stack</h2>
                    <p className="text-xs sm:text-sm text-gray-400">Technologies I work with</p>
                  </div>
                </div>
                {isEditing && (
                  <div className="text-xs sm:text-sm text-blue-400 font-semibold">
                    Click + to add technologies
                  </div>
                )}
              </div>
              
              {isEditing ? (
                <>
                  <div className="flex flex-col sm:flex-row gap-3 mb-4 sm:mb-6">
                    <input
                      type="text"
                      value={newTech}
                      onChange={(e) => setNewTech(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleAddTech()}
                      placeholder="Add a technology (e.g., Python, Django)"
                      className="flex-1 bg-gray-700 border border-gray-600 rounded-lg sm:rounded-xl p-2 sm:p-3 text-white text-sm sm:text-base outline-none focus:border-blue-500"
                    />
                    <button
                      onClick={handleAddTech}
                      className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      <FiPlus />
                      Add
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {editForm.techStack.map(function(tech) {
                      return (
                        <div key={tech} className="group relative px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg sm:rounded-xl text-gray-200 hover:border-blue-500 transition-all text-sm sm:text-base">
                          <span>{tech}</span>
                          <button onClick={() => handleRemoveTech(tech)} className="ml-2 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition">
                            <FiTrash2 size={12} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {editForm.techStack.map(function(tech) {
                    return (
                      <span key={tech} className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg sm:rounded-xl text-xs sm:text-sm text-gray-200 hover:scale-105 transition-transform cursor-default">
                        {tech}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-700 p-4 sm:p-6 lg:p-8 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center">
                  <FiBell className="text-white text-base sm:text-lg lg:text-xl" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">Preferences</h2>
                  <p className="text-xs sm:text-sm text-gray-400">Customize your experience</p>
                </div>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 bg-gray-700/30 rounded-lg sm:rounded-xl">
                  <div className="flex items-center gap-3">
                    <FiBell className="text-blue-400 text-base sm:text-xl flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium text-sm sm:text-base">Email Notifications</p>
                      <p className="text-xs sm:text-sm text-gray-400">Receive updates about your doubts</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setPreferences({...preferences, emailNotifications: !preferences.emailNotifications})}
                    className="relative inline-flex h-5 w-10 sm:h-6 sm:w-11 items-center rounded-full transition"
                  >
                    <span className={"inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white transition " + (preferences.emailNotifications ? "translate-x-5 sm:translate-x-6" : "translate-x-1")} />
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 bg-gray-700/30 rounded-lg sm:rounded-xl">
                  <div className="flex items-center gap-3">
                    <FiMonitor className="text-purple-400 text-base sm:text-xl flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium text-sm sm:text-base">Dark Mode</p>
                      <p className="text-xs sm:text-sm text-gray-400">Always enabled for best experience</p>
                    </div>
                  </div>
                  <FiCheckCircle className="text-green-400 text-lg sm:text-xl flex-shrink-0" />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 bg-gray-700/30 rounded-lg sm:rounded-xl">
                  <div className="flex items-center gap-3">
                    <FiGlobe className="text-pink-400 text-base sm:text-xl flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium text-sm sm:text-base">Language</p>
                      <p className="text-xs sm:text-sm text-gray-400">English (United States)</p>
                    </div>
                  </div>
                  <FiCheckCircle className="text-green-400 text-lg sm:text-xl flex-shrink-0" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-700 p-4 sm:p-6 lg:p-8 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                  <FiShield className="text-white text-base sm:text-lg lg:text-xl" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">Account Security</h2>
                  <p className="text-xs sm:text-sm text-gray-400">Manage your account security</p>
                </div>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 sm:py-3 border-b border-gray-700">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-400">Email Address</p>
                    <p className="text-white font-medium text-sm sm:text-base break-all">{user?.email}</p>
                  </div>
                  <FiMail className="text-gray-500 flex-shrink-0" />
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 sm:py-3 border-b border-gray-700">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-400">Member Since</p>
                    <p className="text-white font-medium text-sm sm:text-base">January 2026</p>
                  </div>
                  <FiCalendar className="text-gray-500 flex-shrink-0" />
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 sm:py-3">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-400">Account Status</p>
                    <p className="text-green-400 font-medium flex items-center gap-2 text-sm sm:text-base">
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse"></span>
                      Verified and Active
                    </p>
                  </div>
                  <FiCheckCircle className="text-green-400 flex-shrink-0" />
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex flex-col sm:flex-row gap-3 sticky bottom-4 bg-gray-900/95 backdrop-blur-lg p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-700">
                <button
                  onClick={handleUpdateProfile}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  {loading ? (
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <FiSave />
                  )}
                  {loading ? "Saving..." : "Save All Changes"}
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <FiX />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-700 max-w-md w-full p-4 sm:p-6 lg:p-8 shadow-2xl transform transition-all mx-4">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <FiKey className="text-white text-lg sm:text-xl" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">Reset Password</h2>
                <p className="text-xs sm:text-sm text-gray-400">Secure your account</p>
              </div>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Current Password</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg sm:rounded-xl p-2 sm:p-3 text-white text-sm sm:text-base outline-none focus:border-blue-500"
                  placeholder="Enter current password"
                />
              </div>
              
              <div>
                <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">New Password</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg sm:rounded-xl p-2 sm:p-3 text-white text-sm sm:text-base outline-none focus:border-blue-500"
                  placeholder="Enter new password (min 6 characters)"
                />
              </div>
              
              <div>
                <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg sm:rounded-xl p-2 sm:p-3 text-white text-sm sm:text-base outline-none focus:border-blue-500"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 mt-6 sm:mt-8">
              <button
                onClick={handleResetPassword}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition shadow-lg text-sm sm:text-base"
              >
                {loading ? "Changing..." : "Change Password"}
              </button>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition text-sm sm:text-base"
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