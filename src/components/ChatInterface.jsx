import { useState, useRef, useEffect } from 'react';

const INITIAL_MESSAGES = [
  {
    id: '1',
    sender: 'assistant',
    text: "Hello! I am your niche-domain AI research assistant. I can analyze and search your indexed documents to answer questions.\n\nWhat would you like to explore in the knowledge base today?",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    sources: []
  }
];


export default function ChatInterface({ activeFile, user, currentSessionId, onNewSessionCreated }) {
  // 1. Base URL ko variable mein store karein
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Fetch messages when a session is selected from the sidebar
  useEffect(() => {
    if (currentSessionId) {
      loadMessagesForSession(currentSessionId);
    } else {
      setMessages(INITIAL_MESSAGES);
    }
  }, [currentSessionId]);

  const loadMessagesForSession = async (sessionId) => {
    try {
      // 2. Localhost ki jagah baseUrl use karein
      const response = await fetch(`${baseUrl}/api/ChatHistory/messages/${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          const formattedMessages = data.map(msg => ({
            id: msg.id.toString(),
            sender: msg.sender,
            text: msg.text,
            timestamp: msg.timestamp,
            sources: []
          }));
          setMessages(formattedMessages);
        } else {
          setMessages(INITIAL_MESSAGES);
        }
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const currentInput = inputValue.trim();

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: currentInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sources: []
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    const payload = {
      question: currentInput,
      userId: user?.id,
      sessionId: currentSessionId ? parseInt(currentSessionId) : null,
      activeFile: activeFile ? activeFile.name : null
    };

    try {
      // 3. Yahan bhi Localhost ki jagah baseUrl use karein
      const response = await fetch(`${baseUrl}/api/Chat/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        
        // If this was a new chat, update the sidebar
        if (!currentSessionId && data.sessionId) {
          onNewSessionCreated(data.sessionId);
        }

        const botMsg = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: data.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sources: []
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        const botMsg = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: "Server rejected the request.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sources: []
        };
        setMessages((prev) => [...prev, botMsg]);
      }
    } catch (error) {
      const botMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: "Connection error: Failed to reach the server backend.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: []
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestionText) => {
    setInputValue(suggestionText);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[450px] bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <div>
            <h3 className="text-xs font-semibold text-slate-800">
              {activeFile ? activeFile.name : 'Knowledge Base Chat'}
            </h3>
            <p className="text-[10px] text-slate-400">
              {activeFile ? 'Active Document Context' : 'Searching full knowledge base'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded border border-indigo-100">
            LLM: Gemini Flash 3.5
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div key={msg.id} className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-xs ${
                isUser ? 'bg-slate-800 text-white' : 'bg-indigo-600 text-white'
              }`}>
                {isUser ? 'ME' : 'AI'}
              </div>

              <div className="space-y-1.5 text-left">
                <div className={`rounded-2xl p-4 shadow-2xs ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
                }`}>
                  <p className="text-xs leading-relaxed whitespace-pre-line">{msg.text}</p>
                </div>

                <p className={`text-[9px] text-slate-400 px-1 ${isUser ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp}
                </p>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex gap-3 max-w-[80%] mr-auto">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
              AI
            </div>
            <div className="space-y-1.5 text-left">
              <div className="rounded-2xl p-3 bg-white border border-slate-200/80 rounded-tl-none flex items-center gap-2">
                <span className="text-xs text-slate-400">Retrieving & generating</span>
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {messages.length <= 2 && !currentSessionId && (
        <div className="px-6 py-2 bg-slate-50 border-t border-slate-200/60">
          <div className="flex flex-wrap gap-2 justify-start items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Suggestions:</span>
            {[
              "Summarize the uploaded document",
              "What are the main requirements?",
              "List key findings within the file"
            ].map((sug, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSuggestionClick(sug)}
                className="text-[10px] bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 px-2.5 py-1 rounded-full cursor-pointer transition-colors shadow-2xs"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSend} className="bg-white border-t border-slate-200 p-4">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder={activeFile ? `Ask about "${activeFile.name}"...` : "Ask a question about your files..."}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isTyping}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="p-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}