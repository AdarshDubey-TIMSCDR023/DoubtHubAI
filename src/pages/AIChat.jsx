import { useState, useRef, useEffect } from "react";
import {
  FiSend,
  FiCpu,
  FiUser,
  FiZap,
  FiTrash2,
  FiDownload,
  FiMessageSquare,
  FiChevronRight,
  FiPlus,
  FiMenu,
  FiClock,
  FiMessageCircle,
  FiStar,
  FiHash,
  FiCode,
  FiBookOpen,
  FiGithub,
  FiX,
} from "react-icons/fi";
import toast from "react-hot-toast";
import API from "../services/api";

function AIChat() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [user, setUser] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const sidebarRef = useRef(null);

  // Get current user from localStorage
  useEffect(() => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error("Error parsing user:", error);
    }
  }, []);

  // Load user-specific sessions on mount
  useEffect(() => {
    if (!user) return;
    
    try {
      const storageKey = `aiChatSessions_${user._id || user.email}`;
      const savedSessions = JSON.parse(localStorage.getItem(storageKey) || "[]");
      const activeSessionId = localStorage.getItem(`activeAIChatSession_${user._id || user.email}`);
      
      if (savedSessions.length > 0) {
        setSessions(savedSessions);
        
        let activeSession = savedSessions.find(s => s.id === activeSessionId);
        
        if (!activeSession && savedSessions.length > 0) {
          activeSession = savedSessions[0];
        }
        
        if (activeSession) {
          setMessages(activeSession.messages || []);
          setCurrentSessionId(activeSession.id);
        } else {
          createNewChat();
        }
      } else {
        createNewChat();
      }
    } catch (error) {
      console.error("Error loading sessions:", error);
      createNewChat();
    }
  }, [user]);

  // Auto-save messages to user-specific storage
  useEffect(() => {
    if (currentSessionId && user && messages.length >= 0) {
      saveCurrentSession();
    }
  }, [messages, currentSessionId, user]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [question]);

  // Close sidebar on outside click on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (window.innerWidth <= 768 && showSidebar && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setShowSidebar(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSidebar]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && showSidebar) {
        setShowSidebar(false);
      }
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [showSidebar]);

  // Save current session to user-specific localStorage
  const saveCurrentSession = () => {
    if (!currentSessionId || !user) return;
    
    try {
      const storageKey = `aiChatSessions_${user._id || user.email}`;
      const updatedSessions = sessions.map(session => {
        if (session.id === currentSessionId) {
          return {
            ...session,
            messages: messages,
            lastUpdated: new Date().toISOString(),
            title: getSessionTitle(messages),
          };
        }
        return session;
      });
      
      setSessions(updatedSessions);
      localStorage.setItem(storageKey, JSON.stringify(updatedSessions));
      localStorage.setItem(`activeAIChatSession_${user._id || user.email}`, currentSessionId);
    } catch (error) {
      console.error("Error saving session:", error);
    }
  };

  const getSessionTitle = (msgs) => {
    if (msgs.length === 0) return "New Chat";
    const firstUserMessage = msgs.find(m => m.type === "user");
    if (firstUserMessage && firstUserMessage.text) {
      const text = firstUserMessage.text.substring(0, 35);
      return text.length === 35 ? text + "..." : text;
    }
    return "New Chat";
  };

  const getSessionIcon = (session) => {
    if (session.pinned) return <FiStar size={16} fill="#fbbf24" color="#fbbf24" />;
    if (session.title.toLowerCase().includes("react")) return <FiCode size={16} />;
    if (session.title.toLowerCase().includes("javascript")) return <FiHash size={16} />;
    if (session.title.toLowerCase().includes("github")) return <FiGithub size={16} />;
    if (session.messages.length > 3) return <FiMessageCircle size={16} />;
    return <FiMessageSquare size={16} />;
  };

  const createNewChat = () => {
    if (!user) return;
    
    const newSessionId = `session_${Date.now()}`;
    const newSession = {
      id: newSessionId,
      title: "New Chat",
      messages: [],
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      pinned: false,
    };
    
    const updatedSessions = [newSession, ...sessions];
    setSessions(updatedSessions);
    setCurrentSessionId(newSessionId);
    setMessages([]);
    
    const storageKey = `aiChatSessions_${user._id || user.email}`;
    localStorage.setItem(storageKey, JSON.stringify(updatedSessions));
    localStorage.setItem(`activeAIChatSession_${user._id || user.email}`, newSessionId);
    
    toast.success("New chat created!");
    setShowSidebar(false);
  };

  const switchSession = (sessionId) => {
    const selectedSession = sessions.find(s => s.id === sessionId);
    if (selectedSession) {
      setMessages(selectedSession.messages || []);
      setCurrentSessionId(sessionId);
      localStorage.setItem(`activeAIChatSession_${user?._id || user?.email}`, sessionId);
      toast.success(`Switched to: ${selectedSession.title}`);
      setShowSidebar(false);
    }
  };

  const deleteSession = (sessionId, e) => {
    e.stopPropagation();
    
    if (sessions.length === 1) {
      toast.error("Cannot delete the only chat. Create a new one first.");
      return;
    }
    
    if (window.confirm("Delete this chat session permanently?")) {
      const updatedSessions = sessions.filter(s => s.id !== sessionId);
      setSessions(updatedSessions);
      
      const storageKey = `aiChatSessions_${user?._id || user?.email}`;
      localStorage.setItem(storageKey, JSON.stringify(updatedSessions));
      
      if (sessionId === currentSessionId) {
        const nextSession = updatedSessions[0];
        if (nextSession) {
          setMessages(nextSession.messages || []);
          setCurrentSessionId(nextSession.id);
          localStorage.setItem(`activeAIChatSession_${user?._id || user?.email}`, nextSession.id);
          toast.success(`Switched to: ${nextSession.title}`);
        } else {
          createNewChat();
        }
      }
      
      toast.success("Chat deleted!");
    }
  };

  const clearCurrentChat = () => {
    if (messages.length === 0) {
      toast.error("No messages to clear");
      return;
    }
    
    if (window.confirm("Are you sure you want to clear all messages in this chat?")) {
      setMessages([]);
      toast.success("Chat cleared!");
    }
  };

  const formatAIResponse = (text) => {
    let formattedText = text;
    
    formattedText = formattedText.replace(/(\d+\.\s*)([^\n]+)/g, (match, number, content) => {
      return `<div class="ai-list-item"><span class="ai-list-number">${number}</span><span class="ai-list-content">${content}</span></div>`;
    });
    
    formattedText = formattedText.replace(/[•\-*]\s*([^\n]+)/g, (match, content) => {
      return `<div class="ai-bullet"><span class="ai-bullet-icon">▹</span><span>${content}</span></div>`;
    });
    
    formattedText = formattedText.replace(/`([^`]+)`/g, '<code class="ai-inline-code">$1</code>');
    
    formattedText = formattedText.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
      return `<pre class="ai-code-block"><code class="language-${lang || 'javascript'}">${escapeHtml(code.trim())}</code></pre>`;
    });
    
    formattedText = formattedText.replace(/^###\s+(.+)$/gm, '<div class="ai-heading ai-heading-3">$1</div>');
    formattedText = formattedText.replace(/^##\s+(.+)$/gm, '<div class="ai-heading ai-heading-2">$1</div>');
    formattedText = formattedText.replace(/^#\s+(.+)$/gm, '<div class="ai-heading ai-heading-1">$1</div>');
    
    formattedText = formattedText.replace(/\*\*([^*]+)\*\*/g, '<strong class="ai-bold">$1</strong>');
    formattedText = formattedText.replace(/\*([^*]+)\*/g, '<em class="ai-italic">$1</em>');
    
    formattedText = formattedText.replace(/\n\n/g, '<div class="ai-paragraph-spacer"></div>');
    formattedText = formattedText.replace(/\n/g, '<br/>');
    
    const importantWords = ['React', 'Node.js', 'JavaScript', 'Python', 'MongoDB', 'API', 'HTTP', 'CSS', 'HTML', 'JWT', 'Important', 'Note', 'Warning', 'Tip', 'Best Practice', 'Error', 'Bug', 'Solution', 'Fix'];
    importantWords.forEach(word => {
      const regex = new RegExp(`\\b(${word})\\b`, 'gi');
      formattedText = formattedText.replace(regex, '<span class="ai-highlight">$1</span>');
    });
    
    return formattedText;
  };

  const escapeHtml = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  const sendMessage = async () => {
    if (!question.trim()) {
      toast.error("Please enter a question");
      return;
    }

    try {
      setLoading(true);
      const currentQuestion = question;

      const userMessage = {
        type: "user",
        text: currentQuestion,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setQuestion("");

      const response = await API.post("/doubts/ask-ai", {
        question: currentQuestion,
      });

      const aiMessage = {
        type: "ai",
        text: response.data.answer || "No response from AI",
        formattedText: formatAIResponse(response.data.answer || "No response from AI"),
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      toast.success("Response received!");
    } catch (error) {
      console.log("AI ERROR:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "AI response failed");

      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          text: "Unable to generate AI response right now. Please try again.",
          formattedText: "Unable to generate AI response right now. Please try again.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const exportChat = () => {
    if (messages.length === 0) {
      toast.error("No messages to export");
      return;
    }
    
    const currentSession = sessions.find(s => s.id === currentSessionId);
    const exportData = {
      sessionId: currentSessionId,
      sessionTitle: currentSession?.title || "Chat Session",
      exportedAt: new Date().toISOString(),
      messages: messages.map(m => ({ type: m.type, text: m.text, timestamp: m.timestamp })),
      totalMessages: messages.length,
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = "data:application/json;charset=utf-8,"+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `ai_chat_${currentSession?.title?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'chat'}_${new Date().toISOString().slice(0,19)}.json`;
    
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
    
    toast.success("Chat exported!");
  };

  const togglePinSession = (sessionId, e) => {
    e.stopPropagation();
    const updatedSessions = sessions.map(session => {
      if (session.id === sessionId) {
        return { ...session, pinned: !session.pinned };
      }
      return session;
    });
    
    const sortedSessions = [...updatedSessions].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.lastUpdated) - new Date(a.lastUpdated);
    });
    
    setSessions(sortedSessions);
    const storageKey = `aiChatSessions_${user?._id || user?.email}`;
    localStorage.setItem(storageKey, JSON.stringify(sortedSessions));
    toast.success(updatedSessions.find(s => s.id === sessionId)?.pinned ? "Chat pinned!" : "Chat unpinned!");
  };

  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const suggestedQuestions = [
    "How to optimize React re-renders?",
    "Explain closures in JavaScript",
    "Best practices for MongoDB indexing",
    "JWT vs Sessions - which to use?",
  ];

  const currentSession = sessions.find(s => s.id === currentSessionId);
  const pinnedSessions = sessions.filter(s => s.pinned);
  const unpinnedSessions = sessions.filter(s => !s.pinned);

  if (!user) {
    return (
      <div className="ai-chat-loading-screen">
        <div className="ai-chat-loading-spinner"></div>
        <p>Loading your chats...</p>
      </div>
    );
  }

  return (
    <div className="ai-chat-container">
      {/* Sidebar Overlay for Mobile */}
      {showSidebar && <div className="ai-chat-sidebar-overlay" onClick={() => setShowSidebar(false)} />}
      
      {/* Sidebar - Starts directly below navbar */}
      <div ref={sidebarRef} className={`ai-chat-sidebar ${showSidebar ? 'open' : ''}`}>
        {/* User Info - Top section */}
        <div className="ai-chat-sidebar-user">
          <div className="ai-chat-user-avatar">
            <FiUser size={18} />
          </div>
          <div className="ai-chat-user-details">
            <p className="ai-chat-welcome-text">Welcome back,</p>
            <p className="ai-chat-user-name">{user?.name?.split(' ')[0] || "Developer"}</p>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="ai-chat-sidebar-newchat">
          <button onClick={createNewChat} className="ai-chat-new-chat-btn">
            <FiPlus size={18} />
            New Chat
          </button>
        </div>
        
        {/* Chat Lists */}
        <div className="ai-chat-sidebar-content">
          {pinnedSessions.length > 0 && (
            <>
              <h3 className="ai-chat-sidebar-title">
                <FiStar size={12} />
                PINNED CHATS
              </h3>
              {pinnedSessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => switchSession(session.id)}
                  className={`ai-chat-session-item ${session.id === currentSessionId ? 'active' : ''}`}
                >
                  <div className="ai-chat-session-icon">
                    {getSessionIcon(session)}
                  </div>
                  <div className="ai-chat-session-info">
                    <p className="ai-chat-session-title">{session.title}</p>
                    <div className="ai-chat-session-meta">
                      <FiClock size={10} />
                      <span>{getRelativeTime(session.lastUpdated)}</span>
                      <span className="ai-chat-session-dot">•</span>
                      <span>{session.messages.length} msgs</span>
                    </div>
                  </div>
                  <div className="ai-chat-session-actions">
                    <button
                      onClick={(e) => togglePinSession(session.id, e)}
                      className="ai-chat-session-pin"
                      title="Unpin Chat"
                    >
                      <FiStar size={14} fill="#fbbf24" color="#fbbf24" />
                    </button>
                    <button
                      onClick={(e) => deleteSession(session.id, e)}
                      className="ai-chat-session-delete"
                      title="Delete Chat"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}

          <h3 className="ai-chat-sidebar-title">
            <FiMessageSquare size={12} />
            RECENT CHATS
          </h3>
          
          {unpinnedSessions.length === 0 && pinnedSessions.length === 0 ? (
            <div className="ai-chat-empty-state">
              <FiMessageCircle size={32} />
              <p>No chats yet</p>
              <span>Start a new conversation</span>
            </div>
          ) : (
            unpinnedSessions.map((session) => (
              <div
                key={session.id}
                onClick={() => switchSession(session.id)}
                className={`ai-chat-session-item ${session.id === currentSessionId ? 'active' : ''}`}
              >
                <div className="ai-chat-session-icon">
                  {getSessionIcon(session)}
                </div>
                <div className="ai-chat-session-info">
                  <p className="ai-chat-session-title">{session.title}</p>
                  <div className="ai-chat-session-meta">
                    <FiClock size={10} />
                    <span>{getRelativeTime(session.lastUpdated)}</span>
                    <span className="ai-chat-session-dot">•</span>
                    <span>{session.messages.length} msgs</span>
                  </div>
                </div>
                <div className="ai-chat-session-actions">
                  <button
                    onClick={(e) => togglePinSession(session.id, e)}
                    className="ai-chat-session-pin"
                    title="Pin Chat"
                  >
                    <FiStar size={14} />
                  </button>
                  <button
                    onClick={(e) => deleteSession(session.id, e)}
                    className="ai-chat-session-delete"
                    title="Delete Chat"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Footer with total chats */}
        <div className="ai-chat-sidebar-footer">
          <div className="ai-chat-stats">
            <FiMessageSquare size={12} />
            <p>{sessions.length} Total {sessions.length === 1 ? 'Chat' : 'Chats'}</p>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="ai-chat-main">
        {/* Header */}
        <div className="ai-chat-header">
          <div className="ai-chat-header-content">
            <div className="ai-chat-header-left">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="ai-chat-menu-btn"
                title="Chat History"
              >
                <FiMenu size={20} />
              </button>
              <div className="ai-chat-header-info">
                <h1>AI Assistant</h1>
                <p>{currentSession?.title || "Chat"} • {messages.length} msgs</p>
              </div>
            </div>
            
            <div className="ai-chat-header-actions">
              <button onClick={exportChat} className="ai-chat-icon-btn" title="Export Chat">
                <FiDownload size={18} />
              </button>
              <button onClick={clearCurrentChat} className="ai-chat-icon-btn" title="Clear Chat">
                <FiTrash2 size={18} />
              </button>
              <div className="ai-chat-status">
                <div className="ai-chat-status-dot"></div>
                <span>AI Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="ai-chat-messages">
          <div className="ai-chat-messages-container">
            {messages.length === 0 ? (
              <div className="ai-chat-welcome">
                <div className="ai-chat-welcome-icon">
                  <FiZap size={48} />
                </div>
                <h2>
                  Hello, {user?.name?.split(' ')[0] || "Developer"}!
                </h2>
                <p>
                  Get instant AI-powered assistance for React, Node.js, DSA, and more.
                  Your conversations are private and securely stored.
                </p>

                <div className="ai-chat-tags">
                  {["React", "Next.js", "Node.js", "MongoDB", "Tailwind", "DSA"].map((tag, i) => (
                    <span key={i} className="ai-chat-tag">{tag}</span>
                  ))}
                </div>

                <div className="ai-chat-suggestions">
                  <p>Try asking:</p>
                  <div className="ai-chat-suggestions-grid">
                    {suggestedQuestions.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => setQuestion(q)}
                        className="ai-chat-suggestion-btn"
                      >
                        <span>{q}</span>
                        <FiChevronRight size={16} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="ai-chat-messages-list">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`ai-chat-message ${msg.type === "user" ? "user" : "ai"}`}
                  >
                    <div className="ai-chat-message-bubble">
                      <div className="ai-chat-message-header">
                        <div className="ai-chat-message-avatar">
                          {msg.type === "user" ? <FiUser size={16} /> : <FiCpu size={16} />}
                        </div>
                        <div>
                          <span className="ai-chat-message-name">
                            {msg.type === "user" ? user?.name?.split(' ')[0] || "You" : "AI Assistant"}
                          </span>
                          <p className="ai-chat-message-time">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      <div className="ai-chat-message-content">
                        {msg.type === "user" ? (
                          msg.text
                        ) : (
                          <div dangerouslySetInnerHTML={{ __html: msg.formattedText || formatAIResponse(msg.text) }} />
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="ai-chat-loading">
                    <div className="ai-chat-loading-bubble">
                      <div className="ai-chat-loading-avatar">
                        <FiCpu size={20} />
                      </div>
                      <div>
                        <p className="ai-chat-loading-name">AI Assistant</p>
                        <div className="ai-chat-loading-dots">
                          <div></div>
                          <div></div>
                          <div></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="ai-chat-input-area">
          <div className="ai-chat-input-container">
            <textarea
              ref={textareaRef}
              rows={1}
              placeholder="Ask any coding question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (!loading && question.trim()) {
                    sendMessage();
                  }
                }
              }}
              className="ai-chat-input"
            />
            
            <button
              onClick={sendMessage}
              disabled={loading || !question.trim()}
              className="ai-chat-send-btn"
            >
              <FiSend size={18} />
              <span className="ai-chat-send-text">Send</span>
            </button>
          </div>
          <p className="ai-chat-input-hint">
            <kbd>Enter</kbd> to send, <kbd>Shift + Enter</kbd> for new line
          </p>
        </div>
      </div>

      <style jsx>{`
        .ai-chat-container {
          display: flex;
          height: 100vh;
          width: 100vw;
          background: linear-gradient(135deg, #0f172a 0%, #020617 50%, #0f172a 100%);
          overflow: hidden;
          position: relative;
        }

        .ai-chat-loading-screen {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #020617 50%, #0f172a 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
        }

        .ai-chat-loading-spinner {
          width: 48px;
          height: 48px;
          border: 3px solid rgba(6, 182, 212, 0.3);
          border-top-color: #06b6d4;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .ai-chat-loading-screen p {
          color: #64748b;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Sidebar Styles */
        .ai-chat-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: 300px;
          background: rgba(15, 23, 42, 0.98);
          backdrop-filter: blur(20px);
          border-right: 1px solid rgba(51, 65, 85, 0.5);
          transform: translateX(-100%);
          transition: transform 0.3s ease;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .ai-chat-sidebar.open {
          transform: translateX(0);
        }

        .ai-chat-sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          z-index: 999;
          backdrop-filter: blur(4px);
        }

        /* User Info Section */
        .ai-chat-sidebar-user {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px;
          border-bottom: 1px solid rgba(51, 65, 85, 0.5);
          background: linear-gradient(135deg, rgba(6, 182, 212, 0.08), rgba(59, 130, 246, 0.05));
        }

        .ai-chat-sidebar-user .ai-chat-user-avatar {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #06b6d4, #3b82f6);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(6, 182, 212, 0.3);
        }

        .ai-chat-sidebar-user .ai-chat-user-details {
          flex: 1;
        }

        .ai-chat-sidebar-user .ai-chat-welcome-text {
          font-size: 11px;
          color: #64748b;
          margin: 0;
        }

        .ai-chat-sidebar-user .ai-chat-user-name {
          font-size: 16px;
          font-weight: 700;
          color: white;
          margin: 0;
        }

        /* New Chat Button */
        .ai-chat-sidebar-newchat {
          padding: 16px;
          border-bottom: 1px solid rgba(51, 65, 85, 0.5);
        }

        .ai-chat-new-chat-btn {
          width: 100%;
          padding: 12px 16px;
          background: linear-gradient(135deg, #06b6d4, #3b82f6);
          border: none;
          border-radius: 12px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s;
        }

        .ai-chat-new-chat-btn:hover {
          transform: scale(1.02);
          box-shadow: 0 4px 15px rgba(6, 182, 212, 0.3);
        }

        /* Chat Content Area */
        .ai-chat-sidebar-content {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
        }

        .ai-chat-sidebar-title {
          font-size: 11px;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 16px 0 12px 0;
          padding-left: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .ai-chat-sidebar-title:first-of-type {
          margin-top: 0;
        }

        /* Empty State */
        .ai-chat-empty-state {
          text-align: center;
          color: #64748b;
          padding: 48px 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .ai-chat-empty-state svg {
          opacity: 0.5;
        }

        .ai-chat-empty-state p {
          font-size: 14px;
          margin: 0;
        }

        .ai-chat-empty-state span {
          font-size: 12px;
          opacity: 0.7;
        }

        /* Session Items */
        .ai-chat-session-item {
          padding: 12px;
          border-radius: 12px;
          cursor: pointer;
          margin-bottom: 8px;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 12px;
          border: 1px solid transparent;
        }

        .ai-chat-session-item:hover {
          background: rgba(6, 182, 212, 0.1);
          border-color: rgba(6, 182, 212, 0.3);
        }

        .ai-chat-session-item.active {
          background: linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(59, 130, 246, 0.2));
          border-color: rgba(6, 182, 212, 0.3);
        }

        .ai-chat-session-icon {
          width: 32px;
          height: 32px;
          background: rgba(6, 182, 212, 0.1);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #06b6d4;
          flex-shrink: 0;
        }

        .ai-chat-session-info {
          flex: 1;
          min-width: 0;
        }

        .ai-chat-session-title {
          font-size: 13px;
          font-weight: 500;
          color: #e2e8f0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin: 0 0 4px 0;
        }

        .ai-chat-session-meta {
          font-size: 10px;
          color: #64748b;
          display: flex;
          align-items: center;
          gap: 4px;
          flex-wrap: wrap;
        }

        .ai-chat-session-meta svg {
          opacity: 0.7;
        }

        .ai-chat-session-dot {
          opacity: 0.5;
        }

        /* Session Actions */
        .ai-chat-session-actions {
          display: flex;
          gap: 4px;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .ai-chat-session-item:hover .ai-chat-session-actions {
          opacity: 1;
        }

        .ai-chat-session-pin,
        .ai-chat-session-delete {
          padding: 6px;
          background: transparent;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          color: #64748b;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ai-chat-session-pin:hover {
          color: #fbbf24;
          background: rgba(251, 191, 36, 0.1);
        }

        .ai-chat-session-delete:hover {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
        }

        /* Footer */
        .ai-chat-sidebar-footer {
          padding: 16px 20px;
          border-top: 1px solid rgba(51, 65, 85, 0.5);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .ai-chat-stats {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 12px;
          color: #64748b;
          padding: 8px;
        }

        .ai-chat-stats p {
          margin: 0;
        }

        /* Main Chat Area Styles */
        .ai-chat-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          width: 100%;
        }

        .ai-chat-header {
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(51, 65, 85, 0.5);
          padding: 12px 16px;
        }

        .ai-chat-header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1200px;
          margin: 0 auto;
          gap: 12px;
          flex-wrap: wrap;
        }

        .ai-chat-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
          min-width: 0;
        }

        .ai-chat-menu-btn {
          padding: 8px;
          background: rgba(6, 182, 212, 0.1);
          border: 1px solid rgba(6, 182, 212, 0.3);
          border-radius: 10px;
          cursor: pointer;
          color: #06b6d4;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .ai-chat-menu-btn:hover {
          background: rgba(6, 182, 212, 0.2);
          transform: scale(1.05);
        }

        .ai-chat-header-info {
          flex: 1;
          min-width: 0;
        }

        .ai-chat-header-info h1 {
          font-size: 18px;
          font-weight: bold;
          background: linear-gradient(135deg, white, #67e8f9);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
        }

        .ai-chat-header-info p {
          font-size: 11px;
          color: #64748b;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .ai-chat-header-actions {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .ai-chat-icon-btn {
          padding: 8px;
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid rgba(51, 65, 85, 0.5);
          border-radius: 8px;
          cursor: pointer;
          color: #94a3b8;
          transition: all 0.2s;
        }

        .ai-chat-icon-btn:hover {
          background: rgba(6, 182, 212, 0.2);
          border-color: rgba(6, 182, 212, 0.3);
          color: #06b6d4;
        }

        .ai-chat-status {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-radius: 20px;
        }

        .ai-chat-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10b981;
          animation: pulse 2s infinite;
        }

        .ai-chat-status span {
          font-size: 11px;
          color: #34d399;
        }

        /* Messages Area */
        .ai-chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          scrollbar-width: thin;
        }

        .ai-chat-messages-container {
          max-width: 900px;
          margin: 0 auto;
        }

        /* Welcome Screen */
        .ai-chat-welcome {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          text-align: center;
          padding: 20px;
        }

        .ai-chat-welcome-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(59, 130, 246, 0.1));
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          border: 1px solid rgba(6, 182, 212, 0.3);
          animation: float 3s ease-in-out infinite;
        }

        .ai-chat-welcome h2 {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 12px;
          color: white;
        }

        .ai-chat-welcome p {
          color: #94a3b8;
          font-size: 14px;
          max-width: 500px;
          margin-bottom: 24px;
        }

        .ai-chat-tags {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px;
          margin-bottom: 32px;
        }

        .ai-chat-tag {
          padding: 5px 12px;
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid rgba(51, 65, 85, 0.5);
          border-radius: 20px;
          font-size: 11px;
          color: #cbd5e1;
          transition: all 0.2s;
        }

        .ai-chat-tag:hover {
          border-color: #06b6d4;
          color: #06b6d4;
        }

        .ai-chat-suggestions {
          width: 100%;
          max-width: 500px;
        }

        .ai-chat-suggestions p {
          font-size: 13px;
          color: #64748b;
          margin-bottom: 12px;
          text-align: center;
        }

        .ai-chat-suggestions-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
        }

        .ai-chat-suggestion-btn {
          text-align: left;
          padding: 10px 12px;
          background: rgba(30, 41, 59, 0.3);
          border: 1px solid rgba(51, 65, 85, 0.5);
          border-radius: 12px;
          font-size: 13px;
          color: #cbd5e1;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.2s;
        }

        .ai-chat-suggestion-btn:hover {
          background: rgba(6, 182, 212, 0.1);
          border-color: rgba(6, 182, 212, 0.3);
        }

        /* Message Styles */
        .ai-chat-messages-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .ai-chat-message {
          display: flex;
          animation: fadeInUp 0.3s ease-out;
        }

        .ai-chat-message.user {
          justify-content: flex-end;
        }

        .ai-chat-message.ai {
          justify-content: flex-start;
        }

        .ai-chat-message-bubble {
          max-width: 90%;
          padding: 12px 16px;
          border-radius: 18px;
        }

        .ai-chat-message.user .ai-chat-message-bubble {
          background: linear-gradient(135deg, #06b6d4, #3b82f6);
          border-bottom-right-radius: 4px;
          box-shadow: 0 2px 10px rgba(6, 182, 212, 0.2);
        }

        .ai-chat-message.ai .ai-chat-message-bubble {
          background: rgba(30, 41, 59, 0.6);
          border: 1px solid rgba(51, 65, 85, 0.5);
          border-bottom-left-radius: 4px;
        }

        .ai-chat-message-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .ai-chat-message-avatar {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ai-chat-message.user .ai-chat-message-avatar {
          background: rgba(255, 255, 255, 0.2);
        }

        .ai-chat-message.ai .ai-chat-message-avatar {
          background: rgba(6, 182, 212, 0.2);
        }

        .ai-chat-message-name {
          font-size: 13px;
          font-weight: 700;
        }

        .ai-chat-message.user .ai-chat-message-name {
          color: white;
        }

        .ai-chat-message.ai .ai-chat-message-name {
          color: #e2e8f0;
        }

        .ai-chat-message-time {
          font-size: 9px;
          margin: 2px 0 0 0;
          opacity: 0.6;
        }

        .ai-chat-message-content {
          font-size: 14px;
          line-height: 1.5;
          white-space: pre-wrap;
          word-break: break-word;
        }

        /* AI Response Formatting */
        .ai-list-item {
          margin: 6px 0;
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }

        .ai-list-number {
          color: #06b6d4;
          font-size: 14px;
          font-weight: 600;
        }

        .ai-bullet {
          margin: 5px 0;
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }

        .ai-bullet-icon {
          color: #06b6d4;
          font-size: 12px;
        }

        .ai-inline-code {
          background: rgba(6, 182, 212, 0.1);
          padding: 2px 5px;
          border-radius: 5px;
          font-family: monospace;
          color: #67e8f9;
          font-size: 12px;
        }

        .ai-code-block {
          background: #0f172a;
          border: 1px solid rgba(6, 182, 212, 0.3);
          border-radius: 10px;
          padding: 12px;
          margin: 10px 0;
          overflow-x: auto;
          font-family: monospace;
          font-size: 12px;
        }

        .ai-heading-1 {
          font-size: 20px;
          color: #a78bfa;
          border-left: 3px solid #a78bfa;
          padding-left: 10px;
          margin: 10px 0;
        }

        .ai-heading-2 {
          font-size: 18px;
          color: #c084fc;
          border-left: 3px solid #c084fc;
          padding-left: 10px;
          margin: 8px 0;
        }

        .ai-heading-3 {
          font-size: 16px;
          color: #e879f9;
          padding-left: 10px;
          margin: 6px 0;
        }

        .ai-bold {
          color: #fbbf24;
          font-weight: 700;
        }

        .ai-highlight {
          background: linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(59, 130, 246, 0.2));
          padding: 2px 4px;
          border-radius: 4px;
          font-weight: 600;
          color: #67e8f9;
        }

        /* Loading Animation */
        .ai-chat-loading {
          display: flex;
          justify-content: flex-start;
          animation: fadeInUp 0.3s ease-out;
        }

        .ai-chat-loading-bubble {
          padding: 12px 16px;
          background: rgba(30, 41, 59, 0.6);
          border: 1px solid rgba(51, 65, 85, 0.5);
          border-radius: 18px;
          border-bottom-left-radius: 4px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .ai-chat-loading-avatar {
          width: 36px;
          height: 36px;
          background: rgba(6, 182, 212, 0.2);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ai-chat-loading-name {
          font-size: 13px;
          font-weight: 700;
          margin: 0;
          color: #e2e8f0;
        }

        .ai-chat-loading-dots {
          display: flex;
          gap: 5px;
          margin-top: 5px;
        }

        .ai-chat-loading-dots div {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #06b6d4;
          animation: bounce 1s infinite;
        }

        .ai-chat-loading-dots div:nth-child(2) {
          animation-delay: 0.1s;
        }

        .ai-chat-loading-dots div:nth-child(3) {
          animation-delay: 0.2s;
        }

        /* Input Area */
        .ai-chat-input-area {
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(12px);
          border-top: 1px solid rgba(51, 65, 85, 0.5);
          padding: 12px 16px;
        }

        .ai-chat-input-container {
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid rgba(51, 65, 85, 0.5);
          border-radius: 14px;
          padding: 4px 6px 4px 14px;
          transition: all 0.2s;
        }

        .ai-chat-input-container:focus-within {
          border-color: #06b6d4;
          box-shadow: 0 0 0 2px rgba(6, 182, 212, 0.1);
        }

        .ai-chat-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          padding: 10px 0;
          font-size: 14px;
          color: #e2e8f0;
          resize: none;
          font-family: inherit;
        }

        .ai-chat-input::placeholder {
          color: #64748b;
        }

        .ai-chat-send-btn {
          padding: 8px 16px;
          background: linear-gradient(135deg, #06b6d4, #3b82f6);
          border: none;
          border-radius: 10px;
          cursor: pointer;
          color: white;
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 600;
          font-size: 13px;
          transition: all 0.2s;
        }

        .ai-chat-send-btn:hover:not(:disabled) {
          transform: scale(1.02);
          box-shadow: 0 2px 10px rgba(6, 182, 212, 0.3);
        }

        .ai-chat-send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .ai-chat-send-text {
          display: none;
        }

        .ai-chat-input-hint {
          font-size: 10px;
          color: #64748b;
          text-align: center;
          margin-top: 8px;
        }

        .ai-chat-input-hint kbd {
          padding: 2px 5px;
          background: rgba(51, 65, 85, 0.5);
          border-radius: 4px;
          font-family: monospace;
          font-size: 9px;
        }

        /* Animations */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        /* Scrollbar */
        .ai-chat-messages::-webkit-scrollbar,
        .ai-chat-sidebar-content::-webkit-scrollbar {
          width: 4px;
        }
        
        .ai-chat-messages::-webkit-scrollbar-track,
        .ai-chat-sidebar-content::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .ai-chat-messages::-webkit-scrollbar-thumb,
        .ai-chat-sidebar-content::-webkit-scrollbar-thumb {
          background: rgba(6, 182, 212, 0.2);
          border-radius: 10px;
        }

        /* Desktop Styles */
        @media (min-width: 769px) {
          .ai-chat-sidebar {
            transform: translateX(0);
            position: relative;
            width: 280px;
          }
          
          .ai-chat-menu-btn {
            display: none;
          }
          
          .ai-chat-sidebar-overlay {
            display: none;
          }
          
          .ai-chat-send-text {
            display: inline;
          }
          
          .ai-chat-send-btn {
            padding: 8px 20px;
          }
        }

        /* Tablet Styles */
        @media (min-width: 481px) and (max-width: 768px) {
          .ai-chat-suggestions-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .ai-chat-welcome h2 {
            font-size: 28px;
          }
          
          .ai-chat-message-bubble {
            max-width: 85%;
          }
        }

        /* Mobile Styles */
        @media (max-width: 480px) {
          .ai-chat-header {
            padding: 10px 12px;
          }
          
          .ai-chat-header-info h1 {
            font-size: 16px;
          }
          
          .ai-chat-header-info p {
            font-size: 9px;
          }
          
          .ai-chat-icon-btn {
            padding: 6px;
          }
          
          .ai-chat-status span {
            display: none;
          }
          
          .ai-chat-status {
            padding: 6px 8px;
          }
          
          .ai-chat-welcome-icon {
            width: 64px;
            height: 64px;
          }
          
          .ai-chat-welcome h2 {
            font-size: 20px;
          }
          
          .ai-chat-welcome p {
            font-size: 13px;
          }
          
          .ai-chat-message-bubble {
            max-width: 95%;
            padding: 10px 14px;
          }
          
          .ai-chat-message-content {
            font-size: 13px;
          }
          
          .ai-chat-input {
            font-size: 13px;
          }
          
          .ai-chat-send-btn {
            padding: 8px 12px;
          }
          
          .ai-chat-send-text {
            display: none;
          }
          
          .ai-chat-suggestions-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default AIChat;