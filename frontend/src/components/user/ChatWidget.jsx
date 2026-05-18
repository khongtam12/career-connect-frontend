import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, UserCircle, Trash2 } from "lucide-react";
import Markdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../stores/useUserStore";
import { createChatStream } from "../../service/aiService";
import { toast } from "react-toastify";

const formatMessageContent = (content) => {
  if (!content) return "";
  let formatted = content;
  
  // 1. Convert raw job links like /job/123 or http://localhost:3000/job/123 into markdown links [Xem chi tiết công việc](/job/123)
  const jobUrlRegex = /(?<!\[[^\]]*\]\()(https?:\/\/[^\s/)]+)?\/job\/(\d+)/g;
  formatted = formatted.replace(jobUrlRegex, (match, host, id) => {
    return `[Xem chi tiết công việc](/job/${id})`;
  });

  // 2. Convert any other raw URL that is not in markdown format into a markdown link
  const generalUrlRegex = /(?<!\[[^\]]*\]\()((https?:\/\/)[^\s)]+)/g;
  formatted = formatted.replace(generalUrlRegex, (match) => {
    return `[${match}](${match})`;
  });

  return formatted;
};

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem("career_connect_ai_messages");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load chat history from localStorage", e);
      return [];
    }
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const { user, isAuthenticated, openAuthDialog } = useUserStore();

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 30);
  };

  // Persist messages to localStorage
  useEffect(() => {
    localStorage.setItem("career_connect_ai_messages", JSON.stringify(messages));
  }, [messages]);

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem("career_connect_ai_messages");
    toast.success("Đã xoá toàn bộ lịch sử trò chuyện thành công!");
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMsg]);
    scrollToBottom();

    const question = input;
    setInput("");
    setLoading(true);

    const aiId = crypto.randomUUID();
    setMessages((prev) => [...prev, { id: aiId, role: "ai", content: "" }]);

    try {
      // Gắn thêm ngữ cảnh nếu user chưa đăng nhập
      let finalQuestion = question;
      if (!isAuthenticated) {
        finalQuestion += " (Lưu ý hệ thống: Người dùng hiện CHƯA ĐĂNG NHẬP. Nếu người dùng muốn thực hiện ứng tuyển (apply), hãy từ chối và in ra chính xác chuỗi [REQUIRE_LOGIN] ở cuối câu để hệ thống bật form đăng nhập.)";
      }

      const chatId = user?.userId || "guest-chat";
      const userId = user?.userId || "";

      console.log("ChatWidget - User status:", { isAuthenticated, userId, chatId });

      // Sử dụng service thay vì gán cứng URL
      const eventSource = createChatStream(finalQuestion, chatId, userId);

      eventSource.onmessage = (event) => {
        const text = event.data;
        if (!text) return;

        setMessages((prev) => {
          let newMessages = [...prev];
          let aiMsgIndex = newMessages.findIndex((msg) => msg.id === aiId);
          if (aiMsgIndex !== -1) {
            let content = newMessages[aiMsgIndex].content + text;
            
            // Bắt cờ nhắc nhở đăng nhập từ AI
            if (content.includes("[REQUIRE_LOGIN]")) {
              content = content.replace("[REQUIRE_LOGIN]", "").trim();
              if (!isAuthenticated) {
                // Tự động mở form đăng nhập
                setTimeout(() => openAuthDialog(), 500);
              }
            }
            
            newMessages[aiMsgIndex] = { ...newMessages[aiMsgIndex], content };
          }
          return newMessages;
        });
        scrollToBottom();
      };

      eventSource.onerror = () => {
        eventSource.close();
        setLoading(false);
      };

      eventSource.onopen = () => {
        // console.log("Stream connected");
      };
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            scrollToBottom();
          }}
          className="fixed bottom-6 right-6 w-14 h-14 bg-emerald-600 rounded-full shadow-[0_4px_20px_rgba(16,185,129,0.35)] hover:bg-emerald-700 hover:scale-110 active:scale-95 transition-all duration-300 z-50 flex items-center justify-center cursor-pointer"
        >
          <MessageCircle className="text-white" size={24} />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 md:w-96 w-[calc(100vw-2rem)] bg-white h-[550px] rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.12)] z-50 border border-gray-100 flex flex-col overflow-hidden transition-all duration-300">
          {/* Header */}
          <div className="flex justify-between items-center p-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm">
            <div>
              <h2 className="font-semibold text-base leading-tight">Career Connect AI</h2>
              <h3 className="text-xs text-emerald-100/90 mt-0.5">Trợ lý tìm việc thông minh 24/7</h3>
            </div>
            <div className="flex items-center gap-1.5">
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  title="Xoá lịch sử chat"
                  className="hover:bg-white/10 text-white rounded-xl p-2 transition-all cursor-pointer"
                >
                  <Trash2 size={18} />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/10 text-white rounded-xl p-2 transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/50 scrollbar-thin scrollbar-thumb-gray-200">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 text-sm mt-8 px-4">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <MessageCircle size={24} />
                </div>
                <p className="font-medium text-gray-700">Chào bạn!</p>
                <p className="text-xs text-gray-400 mt-1">Tôi là Career Connect AI. Hãy hỏi tôi về tìm kiếm công việc, ứng tuyển hoặc gợi ý nghề nghiệp nhé!</p>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-3.5 rounded-2xl max-w-[85%] text-sm whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-emerald-600 text-white ml-auto rounded-br-none shadow-[0_2px_8px_rgba(16,185,129,0.2)]"
                    : "bg-white text-gray-800 border border-gray-100 mr-auto rounded-bl-none shadow-sm"
                }`}
              >
                {msg.role === "ai" && !msg.content && loading ? (
                  <div className="flex items-center gap-2 py-1 px-0.5">
                    <span className="text-xs text-gray-400 font-medium tracking-wide animate-pulse">
                      AI đang suy nghĩ
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '0.8s' }}></span>
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms', animationDuration: '0.8s' }}></span>
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms', animationDuration: '0.8s' }}></span>
                    </div>
                  </div>
                ) : (
                  <Markdown
                    components={{
                      a: ({ href, children, ...props }) => {
                        const isJobLink = href && (href.includes("/job/") || href.includes("/jobs/"));
                        
                        const handleClick = (e) => {
                          e.preventDefault();
                          if (isJobLink) {
                            let targetUrl = href;
                            
                            if (!isAuthenticated) {
                              openAuthDialog({
                                closable: true,
                                onSuccess: () => {
                                  navigate(targetUrl);
                                }
                              });
                            } else {
                              navigate(targetUrl);
                            }
                          } else {
                            if (href.startsWith("http")) {
                              window.open(href, "_blank", "noopener,noreferrer");
                            } else {
                              navigate(href);
                            }
                          }
                        };

                        return (
                          <a
                            href={href}
                            onClick={handleClick}
                            className="text-blue-600 hover:text-blue-800 underline font-semibold cursor-pointer break-all"
                            {...props}
                          >
                            {children}
                          </a>
                        );
                      }
                    }}
                  >
                    {formatMessageContent(msg.content)}
                  </Markdown>
                )}
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>

          {/* Input bar */}
          <div className="p-3 border-t border-gray-100 flex gap-2 bg-white items-center">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all bg-gray-50/50 focus:bg-white"
              placeholder="Nhập yêu cầu tìm việc..."
              disabled={loading}
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="bg-emerald-600 text-white p-2.5 rounded-xl hover:bg-emerald-700 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-all shadow-[0_2px_8px_rgba(16,185,129,0.25)] hover:scale-105 active:scale-95 duration-200 cursor-pointer"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
