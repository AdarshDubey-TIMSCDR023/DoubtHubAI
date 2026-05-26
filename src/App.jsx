import {
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AIChat from "./pages/AIChat";
import AskDoubt from "./pages/AskDoubt";
import Profile from "./pages/Profile";
import DoubtHistory from "./pages/DoubtHistory";
import DoubtSolver from "./pages/DoubtSolver";


function Home() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0a0f2a] to-[#020617] text-white overflow-hidden relative">
      
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-250px] left-[-250px] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-[-300px] right-[-300px] w-[650px] h-[650px] bg-blue-600/10 rounded-full blur-[180px] animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-purple-500/8 rounded-full blur-[200px]"></div>
        <div className="absolute top-[20%] right-[10%] w-1 h-1 bg-cyan-400 rounded-full animate-ping"></div>
        <div className="absolute bottom-[30%] left-[15%] w-2 h-2 bg-blue-400 rounded-full animate-ping delay-500"></div>
      </div>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* LEFT CONTENT */}
          <div className="text-center lg:text-left z-10">
            {/* Platform Badge */}
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-cyan-400/30 bg-slate-900/50 backdrop-blur-xl shadow-lg mx-auto lg:mx-0">
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-cyan-400 animate-ping opacity-75"></div>
              </div>
              <span className="text-sm text-slate-300 font-medium tracking-wide">
                DoubtHub AI Platform - Next Generation Coding Assistant
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="mt-8 sm:mt-10 text-5xl sm:text-7xl md:text-8xl font-black leading-[1.1] tracking-tight">
              Your AI-Powered
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-400 bg-clip-text text-transparent">
                Coding Companion
              </span>
            </h1>

            {/* Description */}
            <p className="mt-6 sm:mt-8 text-slate-300 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0">
              DoubtHub is revolutionizing developer education with cutting-edge AI technology. 
              Get instant solutions, debug complex issues, and master programming concepts with our intelligent platform.
            </p>

            {/* Platform Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 max-w-2xl mx-auto lg:mx-0">
              <div className="flex items-center gap-3 bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 rounded-xl p-3 hover:border-cyan-400/50 hover:bg-slate-800/50 transition-all duration-300 group">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Real-time AI Solutions</p>
                  <p className="text-xs text-slate-500">Responses in milliseconds</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 rounded-xl p-3 hover:border-cyan-400/50 hover:bg-slate-800/50 transition-all duration-300 group">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">24/7 Availability</p>
                  <p className="text-xs text-slate-500">Always ready to help</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 rounded-xl p-3 hover:border-cyan-400/50 hover:bg-slate-800/50 transition-all duration-300 group">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A5.982 5.982 0 0010 13a5.982 5.982 0 00-8 4.57V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm8 9.43V14h-2v1h2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">15+ Languages</p>
                  <p className="text-xs text-slate-500">Multi-language support</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 rounded-xl p-3 hover:border-cyan-400/50 hover:bg-slate-800/50 transition-all duration-300 group">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Smart Debugging</p>
                  <p className="text-xs text-slate-500">Intelligent error detection</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 mt-10 sm:mt-12 justify-center lg:justify-start">
              <Link
                to="/login"
                className="group relative bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-8 sm:px-9 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-cyan-500/25 overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Get Started Now
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 sm:gap-12 justify-center lg:justify-start mt-12 pt-4 border-t border-slate-800/50">
              <div className="text-center lg:text-left group">
                <div className="text-3xl sm:text-4xl font-bold text-cyan-400 group-hover:scale-110 transition-transform duration-300">50K+</div>
                <div className="text-xs sm:text-sm text-slate-500 mt-1">Doubts Solved</div>
              </div>
              <div className="text-center lg:text-left group">
                <div className="text-3xl sm:text-4xl font-bold text-cyan-400 group-hover:scale-110 transition-transform duration-300">98%</div>
                <div className="text-xs sm:text-sm text-slate-500 mt-1">Satisfaction Rate</div>
              </div>
              <div className="text-center lg:text-left group">
                <div className="text-3xl sm:text-4xl font-bold text-cyan-400 group-hover:scale-110 transition-transform duration-300">24/7</div>
                <div className="text-xs sm:text-sm text-slate-500 mt-1">AI Support</div>
              </div>
            </div>
          </div>

          {/* RIGHT - PLATFORM INFO CARD */}
          <div className="relative z-10 mt-12 lg:mt-0">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-[100px] rounded-full"></div>
            
            {/* Info Card */}
            <div className="relative bg-gradient-to-br from-slate-900/80 to-slate-900/40 border border-slate-700/50 backdrop-blur-3xl rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-8 shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 hover:scale-105">
              
              {/* Decorative Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="text-xs text-cyan-400 font-mono bg-cyan-500/10 px-2 py-1 rounded">DoubtHub v3.0</div>
              </div>

              {/* Platform Information */}
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/30">
                    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 1L2 5v8l8 4 8-4V5l-8-4z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">About DoubtHub</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    DoubtHub is an advanced AI-powered platform designed to transform how developers learn, 
                    debug, and solve coding challenges. Our mission is to make coding accessible to everyone.
                  </p>
                </div>

                {/* Key Features */}
                <div className="border-t border-slate-700/50 pt-4">
                  <h4 className="text-lg font-semibold text-cyan-400 mb-3">Premium Features:</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 group hover:translate-x-2 transition-all duration-300">
                      <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center mt-0.5 group-hover:bg-cyan-500/40 transition-all">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">Instant AI Responses</p>
                        <p className="text-xs text-slate-500">Powered by advanced language models</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 group hover:translate-x-2 transition-all duration-300">
                      <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center mt-0.5 group-hover:bg-cyan-500/40 transition-all">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">Multi-Technology Support</p>
                        <p className="text-xs text-slate-500">React, Node.js, Python, MongoDB, DSA, and 50+ frameworks</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 group hover:translate-x-2 transition-all duration-300">
                      <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center mt-0.5 group-hover:bg-cyan-500/40 transition-all">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">Smart Code Debugging</p>
                        <p className="text-xs text-slate-500">Real-time error analysis and fixes</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 group hover:translate-x-2 transition-all duration-300">
                      <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center mt-0.5 group-hover:bg-cyan-500/40 transition-all">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">Chat History & Sessions</p>
                        <p className="text-xs text-slate-500">Never lose your conversations</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 group hover:translate-x-2 transition-all duration-300">
                      <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center mt-0.5 group-hover:bg-cyan-500/40 transition-all">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">Code Explanation & Examples</p>
                        <p className="text-xs text-slate-500">Detailed explanations with working examples</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pro Tip */}
                <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-4 hover:from-cyan-500/15 hover:to-blue-500/15 transition-all duration-300 hover:scale-105">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-cyan-400 font-semibold">Pro Tip</p>
                      <p className="text-xs text-slate-400">Our AI is trained on millions of solutions from top developers worldwide</p>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="text-center text-xs text-slate-500">
                  Trusted by developers from 100+ countries
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-cyan-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-blue-500/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-400 bg-clip-text text-transparent">
                DoubtHub
              </span>{" "}
              Works
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Simple, fast, and effective - get your coding doubts resolved in three easy steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 hover:border-cyan-400/50 transition-all duration-300 group">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Ask Your Doubt</h3>
              <p className="text-slate-400 text-sm">Type your coding question or describe the problem you're facing in detail</p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 hover:border-cyan-400/50 transition-all duration-300 group">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
              <p className="text-slate-400 text-sm">Our advanced AI analyzes your question and provides accurate, contextual solutions</p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 hover:border-cyan-400/50 transition-all duration-300 group">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Solution</h3>
              <p className="text-slate-400 text-sm">Receive detailed explanations, code examples, and best practices instantly</p>
            </div>
          </div>
        </div>
      </section>

      {/* Advertisement Section 1 - Why Choose DoubtHub */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-500/30 mb-6">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
              <span className="text-xs text-cyan-400 font-semibold">Why Developers Love DoubtHub</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Transform Your{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Coding Experience
              </span>
            </h2>
            <p className="text-slate-300 text-lg max-w-3xl mx-auto">
              Join over 10,000+ developers who have accelerated their learning and solved complex coding challenges with DoubtHub's cutting-edge AI technology.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="text-center p-6 rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 hover:border-cyan-400/50 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Save Hours of Debugging</h3>
              <p className="text-slate-400 text-sm">Get instant AI-powered solutions and reduce your debugging time by up to 80%.</p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 hover:border-cyan-400/50 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Learn Faster</h3>
              <p className="text-slate-400 text-sm">Master new technologies and programming concepts with detailed AI explanations.</p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 hover:border-cyan-400/50 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A5.982 5.982 0 0010 13a5.982 5.982 0 00-8 4.57V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm8 9.43V14h-2v1h2z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">24/7 Availability</h3>
              <p className="text-slate-400 text-sm">Get help anytime, anywhere. Perfect for late-night coding sessions and urgent deadlines.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Advertisement Section 2 - Special Offer */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="relative bg-gradient-to-r from-cyan-600/20 to-blue-600/20 backdrop-blur-2xl rounded-3xl border border-cyan-500/30 p-8 md:p-12 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/30 border border-cyan-400/50 mb-6">
                <span className="text-xs font-bold text-cyan-400">LIMITED TIME OFFER</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Start Your{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Free Trial
                </span>{" "}
                Today
              </h2>
              <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-8">
                Get 50 free AI queries every day. No credit card required. Upgrade anytime for unlimited access.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-cyan-500/25"
                >
                  Create Free Account
                </Link>
                <Link
                  to="/login"
                  className="border border-slate-600 hover:border-cyan-400 hover:text-cyan-400 px-8 py-4 rounded-2xl font-semibold transition-all duration-300"
                >
                  Login to Your Account
                </Link>
              </div>
              <p className="text-slate-500 text-sm mt-6">
                Trusted by developers from 100+ countries. Join the DoubtHub community today!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Advertisement Section 3 - Enterprise Ready */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900/50 to-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-500/30 mb-6">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                <span className="text-xs text-cyan-400 font-semibold">FOR TEAMS & ENTERPRISES</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Scale Your Team's{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Productivity
                </span>
              </h2>
              <p className="text-slate-300 text-lg mb-6">
                Empower your entire development team with DoubtHub's enterprise-grade AI platform. 
                Reduce onboarding time, accelerate development, and ship code faster.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-slate-300">
                  <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Team collaboration features
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                  <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Advanced analytics & insights
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                  <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Priority support & dedicated account manager
                </li>
              </ul>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              >
                Contact Sales
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-3xl rounded-full"></div>
              <div className="relative bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
                <div className="flex gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="space-y-4">
                  <div className="bg-slate-900/50 rounded-xl p-4">
                    <p className="text-cyan-400 text-sm mb-2">// Team Productivity Report</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Time saved per developer:</span>
                      <span className="text-cyan-400 font-bold">8.5 hours/week</span>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-slate-400">Faster code reviews:</span>
                      <span className="text-cyan-400 font-bold">65%</span>
                    </div>
                  </div>
                  <div className="bg-slate-900/50 rounded-xl p-4">
                    <p className="text-cyan-400 text-sm mb-2">// Customer Success Story</p>
                    <p className="text-slate-300 text-sm">"DoubtHub reduced our bug resolution time by 70% and helped our junior developers ramp up 3x faster."</p>
                    <p className="text-slate-500 text-xs mt-2">- Tech Lead, Fortune 500 Company</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              What Developers{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Say
              </span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Join thousands of satisfied developers who transformed their coding experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 hover:border-cyan-400/50 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold">A</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Aditya Sharma</h4>
                  <div className="flex gap-1 text-yellow-400 text-sm">
                    ★★★★★
                  </div>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                "DoubtHub has been a game-changer for my coding journey. The AI responses are incredibly accurate and helpful. Saved me hours of debugging!"
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 hover:border-cyan-400/50 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold">P</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Priya Patel</h4>
                  <div className="flex gap-1 text-yellow-400 text-sm">
                    ★★★★★
                  </div>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                "The best AI coding assistant I've ever used. It understands complex problems and provides clear, actionable solutions."
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 hover:border-cyan-400/50 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold">R</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Rajesh Kumar</h4>
                  <div className="flex gap-1 text-yellow-400 text-sm">
                    ★★★★★
                  </div>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                "Fantastic platform! The AI chat is super responsive and the explanations are easy to understand. Highly recommended for all developers."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
          </div>

          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 hover:border-cyan-400/50 transition-all duration-300">
              <h3 className="text-lg font-semibold text-white mb-2">How accurate is the AI?</h3>
              <p className="text-slate-400 text-sm">Our AI is trained on millions of coding solutions and achieves 98% accuracy in solving common programming problems.</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 hover:border-cyan-400/50 transition-all duration-300">
              <h3 className="text-lg font-semibold text-white mb-2">Can I use DoubtHub for any programming language?</h3>
              <p className="text-slate-400 text-sm">Yes! DoubtHub supports 15+ programming languages including JavaScript, Python, Java, C++, and more.</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 hover:border-cyan-400/50 transition-all duration-300">
              <h3 className="text-lg font-semibold text-white mb-2">Is my data secure?</h3>
              <p className="text-slate-400 text-sm">Absolutely! We use industry-standard encryption to protect your conversations and personal information.</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 hover:border-cyan-400/50 transition-all duration-300">
              <h3 className="text-lg font-semibold text-white mb-2">Do I need to pay to use DoubtHub?</h3>
              <p className="text-slate-400 text-sm">No! We offer a free plan with 50 queries per day. For unlimited access, check out our Pro plan.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function App() {
  return (
    <div className="bg-gradient-to-br from-[#020617] via-[#0a0f2a] to-[#020617] text-white min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ai-chat" element={<AIChat />} />
        <Route path="/ask-doubt" element={<AskDoubt />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/history" element={<DoubtHistory />} />
        <Route path="/doubt-solver" element={<DoubtSolver />} />

      </Routes>
    </div>
  );
}

export default App;