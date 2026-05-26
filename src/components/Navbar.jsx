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
  FiCode, // Added for Doubt Solver
} from "react-icons/fi";

import { useState, useEffect } from "react";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);

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
      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30"
      : "text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50";
  };

  const getUserInitial = () => {
    if (user && user.name) {
      return user.name.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-[9999] transition-all duration-500 ${
        scrolled 
          ? "bg-[#020617]/98 backdrop-blur-2xl shadow-2xl border-b border-cyan-500/20 py-2" 
          : "bg-[#020617]/90 backdrop-blur-2xl border-b border-slate-800/50 py-3"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 sm:gap-3 group cursor-pointer relative z-[9999] shrink-0"
            >
              <div className="relative">
                <div className="relative w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-black text-base sm:text-lg md:text-xl shadow-lg shadow-cyan-500/30 group-hover:scale-110 transition-all duration-300 overflow-hidden">
                  <span className="transform group-hover:rotate-6 transition-transform duration-300 relative z-10">D</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                </div>
                <div className="absolute -inset-1 bg-cyan-500 rounded-full blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
              </div>
              
              <div className="relative hidden sm:block">
                <h1 className="text-lg sm:text-xl md:text-2xl font-black tracking-wide bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent">
                  DoubtHub
                </h1>
                <div className="flex items-center gap-1 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></div>
                  <p className="text-[8px] sm:text-[10px] text-cyan-400 font-medium tracking-wide">AI-Powered Learning</p>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation - Only visible when logged in */}
            {user && (
              <div className="hidden md:flex items-center gap-1 lg:gap-2 bg-slate-900/40 rounded-xl lg:rounded-2xl p-1 backdrop-blur-sm border border-white/5">
                <Link
                  to="/ask-doubt"
                  className={`px-3 lg:px-4 py-2 rounded-lg lg:rounded-xl flex items-center gap-2 transition-all duration-300 font-medium text-sm ${activeLink("/ask-doubt")}`}
                >
                  <FiPlusCircle className="text-base" />
                  <span className="hidden lg:inline">Ask Doubt</span>
                </Link>

                <Link
                  to="/ai-chat"
                  className={`px-3 lg:px-4 py-2 rounded-lg lg:rounded-xl flex items-center gap-2 transition-all duration-300 font-medium text-sm ${activeLink("/ai-chat")}`}
                >
                  <FiMessageSquare className="text-base" />
                  <span className="hidden lg:inline">AI Chat</span>
                </Link>

                <Link
                  to="/doubt-solver"
                  className={`px-3 lg:px-4 py-2 rounded-lg lg:rounded-xl flex items-center gap-2 transition-all duration-300 font-medium text-sm ${activeLink("/doubt-solver")}`}
                >
                  <FiCode className="text-base" />
                  <span className="hidden lg:inline">Doubt Solver</span>
                </Link>

                <Link
                  to="/profile"
                  className={`px-3 lg:px-4 py-2 rounded-lg lg:rounded-xl flex items-center gap-2 transition-all duration-300 font-medium text-sm ${activeLink("/profile")}`}
                >
                  <FiUser className="text-base" />
                  <span className="hidden lg:inline">Profile</span>
                </Link>

                <Link
                  to="/history"
                  className={`px-3 lg:px-4 py-2 rounded-lg lg:rounded-xl flex items-center gap-2 transition-all duration-300 font-medium text-sm ${activeLink("/history")}`}
                >
                  <FiClock className="text-base" />
                  <span className="hidden lg:inline">History</span>
                </Link>
              </div>
            )}

            {/* Right Side - Desktop */}
            <div className="hidden md:flex items-center gap-2 lg:gap-3">
              {user ? (
                <>
                  <button className="relative p-2 rounded-lg lg:rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-slate-800/50 transition-all duration-300 group">
                    <FiBell className="text-lg" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    <span className="absolute inset-0 rounded-lg bg-cyan-400/0 group-hover:bg-cyan-400/10 transition-all duration-300"></span>
                  </button>

                  <div className="group relative">
                    <div className="flex items-center gap-2 lg:gap-3 bg-gradient-to-r from-slate-900/90 to-slate-800/90 border border-slate-700/50 px-3 lg:px-4 py-1.5 lg:py-2 rounded-xl hover:border-cyan-400/50 transition-all duration-300 cursor-pointer shadow-lg">
                      <div className="relative">
                        <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-lg lg:rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <span className="text-white text-sm font-bold">{getUserInitial()}</span>
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse"></div>
                      </div>
                      <div className="hidden lg:block">
                        <p className="text-[10px] text-slate-400">Welcome back,</p>
                        <h3 className="font-bold text-sm text-white">{user.name?.split(' ')[0] || user.name}</h3>
                      </div>
                      <div className="hidden lg:block">
                        <svg className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-72 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[10000] overflow-hidden">
                      <div className="p-5 bg-gradient-to-r from-cyan-500/15 to-blue-500/15 border-b border-slate-700/50">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
                            <span className="text-white text-xl font-bold">{getUserInitial()}</span>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400">Signed in as</p>
                            <p className="text-base font-bold text-white">{user.name}</p>
                            <p className="text-xs text-cyan-400 truncate max-w-[180px]">{user.email}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-2">
                        <div className="px-3 py-2 text-xs text-slate-400 flex items-center gap-2">
                          <FiActivity size={12} />
                          <span>Account Overview</span>
                        </div>
                        <div className="px-3 pb-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-300">Membership</span>
                            <span className="text-cyan-400 font-semibold flex items-center gap-1 text-xs">
                              <FiStar size={12} className="fill-cyan-400" />
                              Premium
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm mt-2">
                            <span className="text-slate-300">AI Credits</span>
                            <span className="text-green-400 font-semibold text-xs">Unlimited</span>
                          </div>
                          <div className="flex items-center justify-between text-sm mt-2">
                            <span className="text-slate-300">Doubts Solved</span>
                            <span className="text-blue-400 font-semibold text-xs">24</span>
                          </div>
                        </div>
                        
                        <div className="border-t border-slate-700/50 my-1"></div>
                        
                        <Link
                          to="/profile"
                          className="w-full mt-1 flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-300 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-300"
                        >
                          <FiUser size={14} />
                          <span>My Profile</span>
                        </Link>
                        
                        <Link
                          to="/doubt-solver"
                          className="w-full mt-1 flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-300 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-300"
                        >
                          <FiCode size={14} />
                          <span>Doubt Solver</span>
                        </Link>
                        
                        <Link
                          to="/history"
                          className="w-full mt-1 flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-300 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-300"
                        >
                          <FiClock size={14} />
                          <span>My History</span>
                        </Link>
                        
                        <button
                          onClick={logoutHandler}
                          className="w-full mt-1 flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all duration-300"
                        >
                          <FiLogOut size={14} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    className="px-5 py-2.5 rounded-xl text-sm text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 transition-all duration-300 font-medium"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="relative group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg shadow-cyan-500/25 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Sign Up
                      <FiCompass className="text-sm" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-2xl text-cyan-400 p-2 rounded-xl hover:bg-slate-800/50 transition-all duration-300 z-[9999]"
            >
              {menuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`md:hidden fixed inset-0 bg-black/70 backdrop-blur-md z-[9998] transition-all duration-500 ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile Menu Drawer */}
      <div 
        className={`md:hidden fixed top-0 left-0 bottom-0 w-[300px] sm:w-[350px] bg-gradient-to-b from-[#0a0f2a] to-[#020617] shadow-2xl z-[9999] transition-transform duration-500 ease-out ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile Menu Header */}
        <div className="p-5 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
                <FiCpu className="text-white text-xl" />
              </div>
              <div>
                <h2 className="text-lg font-bold bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">
                  DoubtHub
                </h2>
                <p className="text-[10px] text-cyan-400">AI-Powered Learning</p>
              </div>
            </div>
            <button
              onClick={() => setMenuOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-slate-800/50 transition-all duration-300"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>

        <div className="p-5 overflow-y-auto h-[calc(100vh-80px)]">
          {user ? (
            <>
              {/* User Profile Card */}
              <div className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 rounded-2xl border border-slate-700/50 mb-6 p-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
                      <span className="text-white text-2xl font-bold">{getUserInitial()}</span>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-slate-400">Welcome back,</p>
                    <h3 className="font-bold text-white text-base">{user.name}</h3>
                    <p className="text-[10px] text-cyan-400 truncate">{user.email}</p>
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="space-y-2">
                <Link
                  to="/ask-doubt"
                  className="flex items-center gap-3 text-sm px-3 py-3 rounded-xl hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-blue-500/20 transition-all duration-300 text-slate-300 hover:text-cyan-400"
                  onClick={() => setMenuOpen(false)}
                >
                  <div className="w-9 h-9 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                    <FiPlusCircle className="text-lg text-cyan-400" />
                  </div>
                  <span className="font-medium">Ask Doubt</span>
                </Link>

                <Link
                  to="/ai-chat"
                  className="flex items-center gap-3 text-sm px-3 py-3 rounded-xl hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-blue-500/20 transition-all duration-300 text-slate-300 hover:text-cyan-400"
                  onClick={() => setMenuOpen(false)}
                >
                  <div className="w-9 h-9 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                    <FiMessageSquare className="text-lg text-cyan-400" />
                  </div>
                  <span className="font-medium">AI Chat</span>
                </Link>

                <Link
                  to="/doubt-solver"
                  className="flex items-center gap-3 text-sm px-3 py-3 rounded-xl hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-blue-500/20 transition-all duration-300 text-slate-300 hover:text-cyan-400"
                  onClick={() => setMenuOpen(false)}
                >
                  <div className="w-9 h-9 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                    <FiCode className="text-lg text-cyan-400" />
                  </div>
                  <span className="font-medium">Doubt Solver</span>
                </Link>

                <Link
                  to="/profile"
                  className="flex items-center gap-3 text-sm px-3 py-3 rounded-xl hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-blue-500/20 transition-all duration-300 text-slate-300 hover:text-cyan-400"
                  onClick={() => setMenuOpen(false)}
                >
                  <div className="w-9 h-9 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                    <FiUser className="text-lg text-cyan-400" />
                  </div>
                  <span className="font-medium">My Profile</span>
                </Link>

                <Link
                  to="/history"
                  className="flex items-center gap-3 text-sm px-3 py-3 rounded-xl hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-blue-500/20 transition-all duration-300 text-slate-300 hover:text-cyan-400"
                  onClick={() => setMenuOpen(false)}
                >
                  <div className="w-9 h-9 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                    <FiClock className="text-lg text-cyan-400" />
                  </div>
                  <span className="font-medium">History</span>
                </Link>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-slate-700/50">
                <div className="text-center p-3 bg-slate-800/30 rounded-xl">
                  <FiAward className="text-cyan-400 text-xl mx-auto mb-2" />
                  <p className="text-[10px] text-slate-400">Reputation</p>
                  <p className="text-base font-bold text-white">1,250</p>
                </div>
                <div className="text-center p-3 bg-slate-800/30 rounded-xl">
                  <FiZap className="text-cyan-400 text-xl mx-auto mb-2" />
                  <p className="text-[10px] text-slate-400">AI Credits</p>
                  <p className="text-base font-bold text-white">Unlimited</p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={logoutHandler}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 py-3 rounded-xl mt-6 text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-red-500/20"
              >
                <FiLogOut className="text-base" />
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Auth Buttons */}
              <div className="space-y-3">
                <Link
                  to="/login"
                  className="block text-center border border-slate-700 hover:border-cyan-400 py-3 rounded-xl transition-all duration-300 text-sm text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="block text-center bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 py-3 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg shadow-cyan-500/25"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>

              {/* Features Section */}
              <div className="mt-8 pt-6 border-t border-slate-700/50">
                <div className="flex items-center gap-2 mb-4">
                  <FiStar className="text-cyan-400 text-sm" />
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Why Join DoubtHub?</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                    <span>AI-Powered Assistant</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                    <span>Real-time Debugging</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                    <span>24/7 Availability</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                    <span>Community Support</span>
                  </div>
                </div>
              </div>

              {/* CTA Banner */}
              <div className="mt-6 p-3 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl border border-cyan-500/20">
                <div className="flex items-center gap-2">
                  <FiHelpCircle className="text-cyan-400 text-sm" />
                  <p className="text-[11px] text-cyan-400">Login to access all features and start learning!</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Navbar;