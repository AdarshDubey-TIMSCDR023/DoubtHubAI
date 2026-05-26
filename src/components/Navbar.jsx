import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  FiMessageSquare,
  FiPlusCircle,
  FiLogOut,
  FiUser,
  FiMenu,
  FiX,
  FiHelpCircle,
  FiActivity,
  FiZap,
  FiStar,
  FiTrendingUp,
  FiCompass,
  FiBell,
  FiCpu,
  FiHome,
  FiUsers,
  FiAward,
  FiClock,
  FiCode,
  FiSearch,
  FiBookOpen,
  FiThumbsUp,
  FiShield,
} from "react-icons/fi";

// Add these for additional icons
import { IoSunny, IoBulb } from "react-icons/io5";
import { MdAutoAwesome } from "react-icons/md";

import { useState, useEffect, useRef } from "react";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationsRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const checkUser = () => {
      const userData = localStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        setUser(null);
      }
    };

    checkUser();

    const handleStorageChange = (e) => {
      if (e.key === "user") {
        checkUser();
      }
    };
    window.addEventListener("storage", handleStorageChange);

    const handleAuthEvent = () => {
      checkUser();
    };
    window.addEventListener("userLoggedIn", handleAuthEvent);
    window.addEventListener("userLoggedOut", handleAuthEvent);

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userLoggedIn", handleAuthEvent);
      window.removeEventListener("userLoggedOut", handleAuthEvent);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setNotificationsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target) &&
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    window.dispatchEvent(new Event("userLoggedOut"));
    navigate("/login");
    setMenuOpen(false);
  };

  const activeLink = (path) => {
    return location.pathname === path
      ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/30 scale-105"
      : "text-slate-300 hover:text-cyan-400 hover:bg-white/5";
  };

  const getUserInitial = () => {
    if (user && user.name) {
      return user.name.charAt(0).toUpperCase();
    }
    return "U";
  };

  const notifications = [
    { id: 1, title: "New feature released!", time: "2 min ago", read: false, icon: <MdAutoAwesome className="text-cyan-400" /> },
    { id: 2, title: "Your doubt was answered", time: "1 hour ago", read: false, icon: <FiMessageSquare className="text-cyan-400" /> },
    { id: 3, title: "Weekly learning report", time: "1 day ago", read: true, icon: <FiTrendingUp className="text-cyan-400" /> },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-[9999] transition-all duration-500 ${
        scrolled 
          ? "bg-[#020617]/95 backdrop-blur-2xl shadow-2xl border-b border-cyan-500/30 py-2" 
          : "bg-[#020617]/80 backdrop-blur-xl border-b border-slate-800/40 py-3"
      }`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 sm:gap-3 md:gap-4">
            {/* Logo - Responsive */}
            <Link
              to="/"
              className="flex items-center gap-1.5 sm:gap-2 md:gap-3 group cursor-pointer relative z-[9999] shrink-0"
            >
              <div className="relative">
                <div className="relative w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl md:rounded-2xl bg-gradient-to-br from-cyan-400 via-cyan-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm sm:text-base md:text-lg lg:text-xl shadow-lg shadow-cyan-500/30 group-hover:scale-110 transition-all duration-300 group-hover:shadow-cyan-400/50">
                  <span className="transform group-hover:rotate-6 transition-transform duration-300 relative z-10">D</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                </div>
                <div className="absolute -inset-1 bg-cyan-500 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
              </div>
              
              <div className="relative hidden xs:block">
                <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-black tracking-wide bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent">
                  DoubtHub
                </h1>
                <div className="flex items-center gap-1 mt-0.5">
                  <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-cyan-400 animate-pulse"></div>
                  <p className="text-[7px] sm:text-[8px] md:text-[10px] text-cyan-400 font-medium tracking-wide hidden sm:block">AI-Powered Learning</p>
                </div>
              </div>
            </Link>

            {/* Search Bar - Responsive */}
            {user && (
              <div className={`hidden md:flex items-center flex-1 max-w-sm lg:max-w-md transition-all duration-300 ${searchFocused ? 'scale-105' : 'scale-100'} mx-2 lg:mx-4`}>
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className={`h-3.5 w-3.5 lg:h-4 lg:w-4 transition-colors duration-300 ${searchFocused ? 'text-cyan-400' : 'text-slate-500'}`} />
                  </div>
                  <input
                    type="text"
                    placeholder="Search doubts, topics..."
                    className="w-full bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg lg:rounded-xl py-1.5 lg:py-2 pl-9 pr-3 text-xs lg:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/70 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                  />
                </div>
              </div>
            )}

            {/* Desktop Navigation - Responsive */}
            {user && (
              <div className="hidden md:flex items-center gap-1 bg-white/5 backdrop-blur-sm rounded-xl lg:rounded-2xl p-1 border border-white/10">
                <Link
                  to="/ask-doubt"
                  className={`px-2 lg:px-4 py-1.5 lg:py-2 rounded-lg lg:rounded-xl flex items-center gap-1 lg:gap-2 transition-all duration-300 font-medium text-xs lg:text-sm ${activeLink("/ask-doubt")}`}
                >
                  <div className="p-0.5 lg:p-1 rounded-md lg:rounded-lg bg-cyan-500/20">
                    <FiPlusCircle className="text-xs lg:text-sm text-cyan-400" />
                  </div>
                  <span className="hidden lg:inline">Ask Doubt</span>
                  <span className="lg:hidden text-cyan-400">Ask</span>
                </Link>

                <Link
                  to="/ai-chat"
                  className={`px-2 lg:px-4 py-1.5 lg:py-2 rounded-lg lg:rounded-xl flex items-center gap-1 lg:gap-2 transition-all duration-300 font-medium text-xs lg:text-sm ${activeLink("/ai-chat")}`}
                >
                  <div className="p-0.5 lg:p-1 rounded-md lg:rounded-lg bg-cyan-500/20">
                    <FiMessageSquare className="text-xs lg:text-sm text-cyan-400" />
                  </div>
                  <span className="hidden lg:inline">AI Chat</span>
                  <span className="lg:hidden text-cyan-400">Chat</span>
                </Link>

                <Link
                  to="/doubt-solver"
                  className={`px-2 lg:px-4 py-1.5 lg:py-2 rounded-lg lg:rounded-xl flex items-center gap-1 lg:gap-2 transition-all duration-300 font-medium text-xs lg:text-sm ${activeLink("/doubt-solver")}`}
                >
                  <div className="p-0.5 lg:p-1 rounded-md lg:rounded-lg bg-cyan-500/20">
                    <FiCode className="text-xs lg:text-sm text-cyan-400" />
                  </div>
                  <span className="hidden lg:inline">Solver</span>
                  <span className="lg:hidden text-cyan-400">Solve</span>
                </Link>

                <Link
                  to="/history"
                  className={`px-2 lg:px-4 py-1.5 lg:py-2 rounded-lg lg:rounded-xl flex items-center gap-1 lg:gap-2 transition-all duration-300 font-medium text-xs lg:text-sm ${activeLink("/history")}`}
                >
                  <div className="p-0.5 lg:p-1 rounded-md lg:rounded-lg bg-cyan-500/20">
                    <FiClock className="text-xs lg:text-sm text-cyan-400" />
                  </div>
                  <span className="hidden lg:inline">History</span>
                  <span className="lg:hidden text-cyan-400">History</span>
                </Link>
              </div>
            )}

            {/* Right Side - Desktop - Responsive */}
            <div className="hidden md:flex items-center gap-2 lg:gap-4">
              {user ? (
                <>
                  {/* Notifications */}
                  <div className="relative" ref={notificationsRef}>
                    <button 
                      ref={buttonRef}
                      onClick={() => setNotificationsOpen(!notificationsOpen)}
                      className="relative p-1.5 lg:p-2 rounded-lg lg:rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-white/10 transition-all duration-300 group"
                    >
                      <FiBell className="text-lg lg:text-xl" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 lg:w-5 lg:h-5 bg-gradient-to-r from-red-500 to-red-600 rounded-full text-[8px] lg:text-[10px] font-bold text-white flex items-center justify-center shadow-lg shadow-red-500/30">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                    
                    {notificationsOpen && (
                      <div className="absolute right-0 mt-2 w-72 lg:w-80 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-xl lg:rounded-2xl shadow-2xl z-[10000] overflow-hidden">
                        <div className="p-3 lg:p-4 border-b border-slate-700/50 flex justify-between items-center">
                          <h3 className="font-bold text-white text-sm lg:text-base">Notifications</h3>
                          <button className="text-[10px] lg:text-xs text-cyan-400 hover:text-cyan-300">Mark all read</button>
                        </div>
                        <div className="max-h-80 lg:max-h-96 overflow-y-auto">
                          {notifications.map(notif => (
                            <div key={notif.id} className={`p-3 lg:p-4 hover:bg-white/5 transition-colors cursor-pointer border-b border-slate-700/30 last:border-0 ${!notif.read ? 'bg-cyan-500/5' : ''}`}>
                              <div className="flex gap-2 lg:gap-3">
                                <div className={`w-7 h-7 lg:w-8 lg:h-8 rounded-lg flex items-center justify-center ${!notif.read ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-500'}`}>
                                  {notif.icon}
                                </div>
                                <div className="flex-1">
                                  <p className={`text-xs lg:text-sm ${!notif.read ? 'text-white font-medium' : 'text-slate-400'}`}>{notif.title}</p>
                                  <p className="text-[10px] lg:text-xs text-slate-500 mt-1">{notif.time}</p>
                                </div>
                                {!notif.read && <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-cyan-400 animate-pulse"></div>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* User Profile Dropdown - Responsive */}
                  <div className="group relative">
                    <div className="flex items-center gap-1.5 lg:gap-3 bg-gradient-to-r from-slate-900/90 to-slate-800/90 border border-slate-700/50 px-2 lg:px-4 py-1 lg:py-1.5 rounded-xl lg:rounded-2xl hover:border-cyan-500/70 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-cyan-500/10">
                      <div className="relative">
                        <div className="w-7 h-7 lg:w-9 lg:h-9 rounded-lg lg:rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <span className="text-white text-xs lg:text-sm font-bold">{getUserInitial()}</span>
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 lg:w-2.5 lg:h-2.5 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse"></div>
                      </div>
                      <div className="hidden lg:block">
                        <p className="text-[10px] text-slate-400">Welcome back,</p>
                        <h3 className="font-bold text-sm text-white">{user.name?.split(' ')[0] || user.name}</h3>
                      </div>
                      <svg className={`w-3 h-3 lg:w-4 lg:h-4 text-slate-500 group-hover:text-cyan-400 transition-all duration-300 group-hover:rotate-180`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    
                    <div className="absolute right-0 mt-2 w-72 lg:w-80 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-xl lg:rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[10000] overflow-hidden">
                      <div className="p-4 lg:p-5 bg-gradient-to-r from-cyan-500/15 to-indigo-500/15 border-b border-slate-700/50">
                        <div className="flex items-center gap-3 lg:gap-4">
                          <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center shadow-lg">
                            <span className="text-white text-xl lg:text-2xl font-bold">{getUserInitial()}</span>
                          </div>
                          <div>
                            <p className="text-[10px] lg:text-xs text-slate-400">Signed in as</p>
                            <p className="text-sm lg:text-base font-bold text-white">{user.name}</p>
                            <p className="text-[10px] lg:text-xs text-cyan-400 truncate max-w-[140px] lg:max-w-[180px]">{user.email}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-2">
                        <div className="px-2 lg:px-3 py-1.5 lg:py-2 text-[10px] lg:text-xs text-slate-400 flex items-center gap-2">
                          <FiActivity size={10} className="lg:w-3 lg:h-3" />
                          <span>Account Overview</span>
                        </div>
                        <div className="px-2 lg:px-3 pb-2 lg:pb-3">
                          <div className="grid grid-cols-2 gap-2 lg:gap-3">
                            <div className="bg-white/5 rounded-lg lg:rounded-xl p-1.5 lg:p-2 text-center">
                              <div className="flex items-center justify-center gap-0.5 lg:gap-1 text-cyan-400 mb-0.5 lg:mb-1">
                                <FiStar size={10} className="lg:w-3 lg:h-3 fill-cyan-400" />
                                <span className="text-[10px] lg:text-xs font-semibold">Premium</span>
                              </div>
                              <p className="text-[8px] lg:text-[10px] text-slate-400">Membership</p>
                            </div>
                            <div className="bg-white/5 rounded-lg lg:rounded-xl p-1.5 lg:p-2 text-center">
                              <div className="flex items-center justify-center gap-0.5 lg:gap-1 text-green-400 mb-0.5 lg:mb-1">
                                <FiZap size={10} className="lg:w-3 lg:h-3" />
                                <span className="text-[10px] lg:text-xs font-semibold">Unlimited</span>
                              </div>
                              <p className="text-[8px] lg:text-[10px] text-slate-400">AI Credits</p>
                            </div>
                          </div>
                          <div className="mt-2 lg:mt-3 flex items-center justify-between text-xs lg:text-sm bg-white/5 rounded-lg lg:rounded-xl p-1.5 lg:p-2">
                            <span className="text-slate-300 text-[10px] lg:text-xs">Doubts Solved</span>
                            <span className="text-cyan-400 font-bold text-xs lg:text-sm">24</span>
                          </div>
                        </div>
                        
                        <div className="border-t border-slate-700/50 my-1"></div>
                        
                        <Link to="/profile" className="w-full mt-1 flex items-center gap-2 lg:gap-3 px-2 lg:px-3 py-2 lg:py-2.5 rounded-lg lg:rounded-xl text-xs lg:text-sm text-slate-300 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-300">
                          <FiUser size={14} className="lg:w-4 lg:h-4" />
                          <span>My Profile</span>
                        </Link>
                        
                        <Link to="/history" className="w-full mt-1 flex items-center gap-2 lg:gap-3 px-2 lg:px-3 py-2 lg:py-2.5 rounded-lg lg:rounded-xl text-xs lg:text-sm text-slate-300 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-300">
                          <FiClock size={14} className="lg:w-4 lg:h-4" />
                          <span>My History</span>
                        </Link>

                        <Link to="/ai-chat" className="w-full mt-1 flex items-center gap-2 lg:gap-3 px-2 lg:px-3 py-2 lg:py-2.5 rounded-lg lg:rounded-xl text-xs lg:text-sm text-slate-300 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-300">
                          <FiCpu size={14} className="lg:w-4 lg:h-4" />
                          <span>AI Assistant</span>
                        </Link>
                        
                        <button onClick={logoutHandler} className="w-full mt-1 lg:mt-2 flex items-center gap-2 lg:gap-3 px-2 lg:px-3 py-2 lg:py-2.5 rounded-lg lg:rounded-xl text-xs lg:text-sm text-red-400 hover:bg-red-500/10 transition-all duration-300">
                          <FiLogOut size={14} className="lg:w-4 lg:h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 lg:gap-3">
                  <Link to="/login" className="px-3 lg:px-5 py-1.5 lg:py-2.5 rounded-lg lg:rounded-xl text-xs lg:text-sm text-slate-300 hover:text-cyan-400 hover:bg-white/5 transition-all duration-300 font-medium">
                    Login
                  </Link>
                  <Link to="/register" className="relative group bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 px-4 lg:px-6 py-1.5 lg:py-2.5 rounded-lg lg:rounded-xl text-xs lg:text-sm font-semibold transition-all duration-300 shadow-lg shadow-cyan-500/25 overflow-hidden">
                    <span className="relative z-10 flex items-center gap-1 lg:gap-2">
                      Get Started
                      <FiCompass className="text-xs lg:text-sm group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-xl sm:text-2xl text-cyan-400 p-1.5 sm:p-2 rounded-lg sm:rounded-xl hover:bg-white/10 transition-all duration-300 z-[9999]"
            >
              {menuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`md:hidden fixed inset-0 bg-black/80 backdrop-blur-md z-[9998] transition-all duration-500 ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile Menu Drawer - Improved Responsive */}
      <div 
        className={`md:hidden fixed top-0 left-0 bottom-0 w-[280px] xs:w-[320px] sm:w-[380px] bg-gradient-to-b from-[#0a0f2a] to-[#020617] shadow-2xl z-[9999] transition-transform duration-500 ease-out ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 sm:p-5 border-b border-slate-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center shadow-lg">
                  <FiCpu className="text-white text-lg sm:text-xl" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">
                    DoubtHub
                  </h2>
                  <p className="text-[8px] sm:text-[10px] text-cyan-400">AI-Powered Learning</p>
                </div>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-white/10 transition-all duration-300"
              >
                <FiX size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-5">
            {user ? (
              <>
                {/* User Profile Card - Responsive */}
                <div className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 rounded-xl sm:rounded-2xl border border-slate-700/50 mb-4 sm:mb-6 p-3 sm:p-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center shadow-lg">
                        <span className="text-white text-xl sm:text-2xl font-bold">{getUserInitial()}</span>
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse"></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-[8px] sm:text-[10px] text-slate-400">Welcome back,</p>
                      <h3 className="font-bold text-white text-sm sm:text-lg">{user.name}</h3>
                      <p className="text-[9px] sm:text-[11px] text-cyan-400 truncate">{user.email}</p>
                    </div>
                  </div>
                </div>

                {/* Mobile Search - Responsive */}
                <div className="mb-4 sm:mb-6">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs sm:text-sm" />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg sm:rounded-xl py-2 sm:py-2.5 pl-8 sm:pl-9 pr-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/70"
                    />
                  </div>
                </div>

                {/* Navigation Links - Responsive */}
                <div className="space-y-1">
                  <Link
                    to="/ask-doubt"
                    className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm px-2 sm:px-3 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-indigo-500/20 transition-all duration-300 text-slate-300 hover:text-cyan-400"
                    onClick={() => setMenuOpen(false)}
                  >
                    <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                      <FiPlusCircle className="text-base sm:text-lg text-cyan-400" />
                    </div>
                    <span className="font-medium">Ask Doubt</span>
                  </Link>

                  <Link
                    to="/ai-chat"
                    className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm px-2 sm:px-3 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-indigo-500/20 transition-all duration-300 text-slate-300 hover:text-cyan-400"
                    onClick={() => setMenuOpen(false)}
                  >
                    <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                      <FiMessageSquare className="text-base sm:text-lg text-cyan-400" />
                    </div>
                    <span className="font-medium">AI Chat</span>
                  </Link>

                  <Link
                    to="/doubt-solver"
                    className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm px-2 sm:px-3 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-indigo-500/20 transition-all duration-300 text-slate-300 hover:text-cyan-400"
                    onClick={() => setMenuOpen(false)}
                  >
                    <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                      <FiCode className="text-base sm:text-lg text-cyan-400" />
                    </div>
                    <span className="font-medium">Doubt Solver</span>
                  </Link>

                  <Link
                    to="/profile"
                    className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm px-2 sm:px-3 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-indigo-500/20 transition-all duration-300 text-slate-300 hover:text-cyan-400"
                    onClick={() => setMenuOpen(false)}
                  >
                    <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                      <FiUser className="text-base sm:text-lg text-cyan-400" />
                    </div>
                    <span className="font-medium">My Profile</span>
                  </Link>

                  <Link
                    to="/history"
                    className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm px-2 sm:px-3 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-indigo-500/20 transition-all duration-300 text-slate-300 hover:text-cyan-400"
                    onClick={() => setMenuOpen(false)}
                  >
                    <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                      <FiClock className="text-base sm:text-lg text-cyan-400" />
                    </div>
                    <span className="font-medium">History</span>
                  </Link>
                </div>

                {/* Stats Grid - Responsive */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-700/50">
                  <div className="text-center p-2 sm:p-3 bg-white/5 rounded-lg sm:rounded-xl">
                    <FiAward className="text-cyan-400 text-base sm:text-xl mx-auto mb-1 sm:mb-2" />
                    <p className="text-[8px] sm:text-[10px] text-slate-400">Reputation</p>
                    <p className="text-sm sm:text-base font-bold text-white">1,250</p>
                  </div>
                  <div className="text-center p-2 sm:p-3 bg-white/5 rounded-lg sm:rounded-xl">
                    <FiZap className="text-cyan-400 text-base sm:text-xl mx-auto mb-1 sm:mb-2" />
                    <p className="text-[8px] sm:text-[10px] text-slate-400">AI Credits</p>
                    <p className="text-sm sm:text-base font-bold text-white">Unlimited</p>
                  </div>
                </div>

                {/* Logout Button - Responsive */}
                <button
                  onClick={logoutHandler}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 py-2.5 sm:py-3 rounded-lg sm:rounded-xl mt-4 sm:mt-6 text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-red-500/20"
                >
                  <FiLogOut className="text-sm sm:text-base" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <div className="space-y-2 sm:space-y-3">
                  <Link
                    to="/login"
                    className="block text-center border border-slate-700 hover:border-cyan-400 py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 text-xs sm:text-sm text-slate-300 hover:text-cyan-400 hover:bg-white/5 font-medium"
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block text-center bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 shadow-lg shadow-cyan-500/25"
                    onClick={() => setMenuOpen(false)}
                  >
                    Create Account
                  </Link>
                </div>

                <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-700/50">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                    <FiStar className="text-cyan-400 text-xs sm:text-sm" />
                    <h4 className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">Why Join DoubtHub?</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-slate-400 bg-white/5 rounded-lg sm:rounded-xl p-1.5 sm:p-2">
                      <FiThumbsUp className="text-cyan-400" size={10} className="sm:w-3 sm:h-3" />
                      <span>AI Assistant</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-slate-400 bg-white/5 rounded-lg sm:rounded-xl p-1.5 sm:p-2">
                      <FiCode className="text-cyan-400" size={10} className="sm:w-3 sm:h-3" />
                      <span>Debugging</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-slate-400 bg-white/5 rounded-lg sm:rounded-xl p-1.5 sm:p-2">
                      <FiClock className="text-cyan-400" size={10} className="sm:w-3 sm:h-3" />
                      <span>24/7 Support</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-slate-400 bg-white/5 rounded-lg sm:rounded-xl p-1.5 sm:p-2">
                      <FiUsers className="text-cyan-400" size={10} className="sm:w-3 sm:h-3" />
                      <span>Community</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 rounded-lg sm:rounded-xl border border-cyan-500/20">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <FiShield className="text-cyan-400 text-base sm:text-lg mt-0.5" />
                    <div>
                      <p className="text-[10px] sm:text-xs text-cyan-400 font-semibold">Secure Learning Environment</p>
                      <p className="text-[9px] sm:text-[11px] text-slate-400 mt-0.5 sm:mt-1">Login to access all features and start your learning journey!</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
