import { useState, useEffect } from 'react';
import UploadSection from './UploadSection';
import ChatInterface from './ChatInterface';
import Footer from './Footer';
import ConfirmModal from './ConfirmModal';

export default function DashboardLayout({ user, onLogout }) {

  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [activeTab, setActiveTab] = useState('upload'); 
  const [recentChats, setRecentChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [deleteModalConfig, setDeleteModalConfig] = useState({ isOpen: false, chatId: null });

  // Fetch sessions when the component loads
  useEffect(() => {
    if (user && user.id) {
      fetchSessions();
    }
  }, [user]);

  const fetchSessions = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/ChatHistory/sessions/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setRecentChats(data);
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  };

  const handleUploadComplete = (newFile) => {
    setActiveFile(newFile);
    setSelectedChatId(null);
    setTimeout(() => {
      setActiveTab('chat');
    }, 1000);
  };

  const handleSelectRecentChat = (chat) => {
    setSelectedChatId(chat.id);
    const matchingFile = uploadedFiles.find(f => f.name === chat.activeFile) || null;
    setActiveFile(matchingFile);
    setActiveTab('chat');
  };

  const handleNewChat = () => {
    setSelectedChatId(null);
    setActiveFile(null);
    setActiveTab('upload');
  };

 const handleDeleteClick = (chatId, e) => {
    e.stopPropagation();
    setDeleteModalConfig({ isOpen: true, chatId: chatId });
  };

  const executeDeleteChat = async () => {
    const chatId = deleteModalConfig.chatId;
    if (!chatId) return;

    try {
      const response = await fetch(`${baseUrl}/api/ChatHistory/${chatId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setRecentChats(prev => prev.filter(c => c.id !== chatId));
        
        if (selectedChatId === chatId) {
          setSelectedChatId(null);
          setActiveFile(null);
          setActiveTab('upload');
        }
      } else {
        alert("Failed to delete the chat. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
    } finally {
  
      setDeleteModalConfig({ isOpen: false, chatId: null });
    }
  };

  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 text-slate-800 font-sans">
      
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shrink-0">
        <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
    <svg className="w-6 h-6" fill="none" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
      <g stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" opacity="0.6">
        <line x1="3" y1="7" x2="21" y2="7" />
        <line x1="3" y1="12" x2="15" y2="12" />
      </g>
      <circle cx="14" cy="14" r="8" fill="none" stroke="currentColor" strokeWidth={2.6} />
      <line x1="20" y1="20" x2="25.5" y2="25.5" stroke="currentColor" strokeWidth={3.2} strokeLinecap="round" />
    </svg>
  </div>
  <div>
    <h2 className="text-sm font-bold text-white tracking-wide leading-none">Docket</h2>
    <span className="text-[10px] text-slate-500 font-medium">Read less. Know more.</span>
  </div>
</div>

        <div className="p-4">
          <button
            type="button"
            onClick={handleNewChat}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-xs rounded-lg transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-indigo-600/20 hover:scale-[1.01]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span>New Vector Chat</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 space-y-1">
          <div className="px-3 mb-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Recent Sessions</span>
          </div>
          {recentChats.map((chat) => {
            const isSelected = selectedChatId === chat.id;
            return (
              <div key={chat.id} className="relative group flex items-center">
                <button
                  type="button"
                  onClick={() => handleSelectRecentChat(chat)}
                  className={`w-full text-left p-2.5 pr-8 rounded-lg transition-colors flex items-start gap-2.5 cursor-pointer text-xs ${
                    isSelected
                      ? 'bg-slate-800 text-white font-medium'
                      : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                  }`}
                >
                  <svg className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-indigo-400' : 'text-slate-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <div className="truncate flex-1">
                    <p className="truncate font-semibold">{chat.title}</p>
                    <div className="flex justify-between items-center text-[9px] text-slate-500 mt-0.5">
                      <span className="truncate max-w-[100px]">{chat.activeFile || "Database Query"}</span>
                      <span>{chat.date}</span>
                    </div>
                  </div>
                </button>
                
                {/* Delete Button (Visible on Hover) */}
                <button
                  type="button"
                  onClick={(e) => handleDeleteClick(chat.id, e)}
                  title="Delete Chat"
                  className="absolute right-2 opacity-0 group-hover:opacity-100 p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-md transition-all cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
              {getUserInitials(user?.name)}
            </div>
            <div className="truncate text-left">
              <p className="text-xs font-semibold text-white truncate">{user?.name || 'John Doe'}</p>
              <p className="text-[9px] text-slate-500 truncate">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
          
          <button
            type="button"
            onClick={onLogout}
            title="Log Out"
            className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-800">Workspace Dashboard</h2>
            {activeFile && (
              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-100 font-bold flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                Active File Context: {activeFile.name}
              </span>
            )}
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/50">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'upload'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span>Upload New Document</span>
            </button>
            
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-slate-50">
          <div className="min-h-full flex flex-col">
            
            {/* Main Content Area */}
            <div className="flex-1">
              {activeTab === 'upload' ? (
                <UploadSection
                  onUploadComplete={handleUploadComplete}
                  uploadedFiles={uploadedFiles}
                  setUploadedFiles={setUploadedFiles}
                />
              ) : (
                <div className="h-full p-6">
                  <ChatInterface 
                    activeFile={activeFile} 
                    user={user} 
                    currentSessionId={selectedChatId} 
                    onNewSessionCreated={(newId) => {
                      setSelectedChatId(newId);
                      fetchSessions();
                    }}
                  />
                </div>
              )}
            </div>

            <Footer
              onPrivacyClick={() => alert("Privacy Policy page will be added soon.")} 
              onTermsClick={() => alert("Terms of Service page will be added soon.")}
            />

          </div>
        </div>
        <ConfirmModal 
        isOpen={deleteModalConfig.isOpen}
        onClose={() => setDeleteModalConfig({ isOpen: false, chatId: null })}
        onConfirm={executeDeleteChat}
        title="Delete Session"
        message="Are you sure you want to permanently delete this document session? This action cannot be undone and will erase all AI interactions."
      />
      </main>

      
    </div>
  );
}