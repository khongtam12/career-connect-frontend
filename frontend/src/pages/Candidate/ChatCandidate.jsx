import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Send, Search, MoreVertical, MessageSquare, Phone, Video, Info, User, Check, CheckCheck } from 'lucide-react';
import { useUserStore } from "../../stores/useUserStore";
import { useNotificationStore } from "../../stores/useNotificationStore";
import { fetchChatHistory, fetchCandidateChatRooms, markChatAsRead, connectChatWebSocket } from "../../service/notificationService";
import { getMyApplications } from "../../service/applicationService";
import { getJobById } from "../../service/jobService";

export default function ChatCandidate() {
  const user = useUserStore((s) => s.user);
  const setUnreadChatCount = useNotificationStore((s) => s.setUnreadChatCount);
  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [stompClient, setStompClient] = useState(null);
  const [loading, setLoading] = useState(true);

  const selectedConversation = useMemo(() =>
    conversations.find(c => c.id === selectedId),
    [conversations, selectedId]
  );

  const scrollContainerRef = useRef(null);
  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation?.messages, selectedId]);

  // Update global unread count
  useEffect(() => {
    const totalUnread = conversations.reduce((sum, conv) => sum + (conv.unreadCountCandidate || 0), 0);
    setUnreadChatCount(totalUnread);
  }, [conversations, setUnreadChatCount]);

  const filteredConversations = conversations.filter(c =>
    c.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => new Date(b.lastUpdate) - new Date(a.lastUpdate));

  // 1. Fetch Rooms & Connect WebSocket
  useEffect(() => {
    if (!user?.userId) return;

    const loadRooms = async () => {
      try {
        // Lấy danh sách phòng chat đã có tin nhắn
        let chatRooms = [];
        try {
          chatRooms = await fetchCandidateChatRooms(user.userId) || [];
          console.log("ds phong chat candidate", chatRooms)
        } catch (e) {
          console.warn("Could not fetch chat rooms:", e);
        }

        // Lấy danh sách các công việc đã ứng tuyển
        let applicationsList = [];
        try {
          const appResponse = await getMyApplications();
          console.log("ds phong cong viec ut", appResponse);

          // API trả về ApiResponse { status, message, data: [...] }
          applicationsList = appResponse?.data || appResponse || [];
          if (!Array.isArray(applicationsList)) applicationsList = [];
        } catch (e) {
          console.warn("Could not fetch applications:", e);
        }

        // Lấy thông tin chi tiết từng job song song
        const appsWithJobDetails = await Promise.all(
          applicationsList.map(async (app) => {
            try {
              const jobRes = await getJobById(app.jobId);
              console.log("jobRes", jobRes);
              // jobRes có thể là { data: jobObject } hoặc trực tiếp jobObject
              const job = jobRes?.data || jobRes;
              return {
                ...app,
                jobTitle: job?.title || 'Vị trí ứng tuyển',
                companyName: job?.company?.name || 'Công ty',
                companyLogo: job?.company?.logo || job?.logo || null,
              };
            } catch {
              return {
                ...app,
                jobTitle: 'Vị trí ứng tuyển',
                companyName: 'Công ty',
                companyLogo: null,
              };
            }
          })
        );

        // Mỗi cặp (candidateId + companyId) = 1 phòng chat, tránh trùng nhiều job cùng công ty
        const seenRoomIds = new Set();
        const mergedRooms = [];

        appsWithJobDetails.forEach(app => {
          const roomId = `${user.userId}_${app.companyId}`;
          if (seenRoomIds.has(roomId)) return;
          seenRoomIds.add(roomId);

          const existingRoom = chatRooms.find(r => r.id === roomId);
          if (existingRoom) {
            mergedRooms.push({
              ...existingRoom,
              jobTitle: app.jobTitle,
              companyName: app.companyName || existingRoom.companyName,
              companyLogo: app.companyLogo || existingRoom.companyLogo,
              messages: []
            });
          } else {
            mergedRooms.push({
              id: roomId,
              candidateId: user.userId,
              companyId: app.companyId,
              companyName: app.companyName,
              companyLogo: app.companyLogo,
              jobTitle: app.jobTitle,
              lastMessage: 'Chưa có tin nhắn nào',
              lastUpdate: app.appliedAt,
              unreadCountCandidate: 0,
              messages: []
            });
          }
        });

        // Thêm những phòng chat cũ không nằm trong danh sách ứng tuyển
        chatRooms.forEach(cr => {
          if (!mergedRooms.find(m => m.id === cr.id)) {
            mergedRooms.push({ ...cr, messages: [] });
          }
        });

        const sortedRooms = mergedRooms.sort((a, b) => new Date(b.lastUpdate) - new Date(a.lastUpdate));

        if (sortedRooms.length > 0) {
          const firstRoom = sortedRooms[0];
          try {
            const history = await fetchChatHistory(firstRoom.id);
            firstRoom.messages = history;
          } catch (e) {
            console.error("Failed to fetch initial history", e);
          }
          setSelectedId(firstRoom.id);
        }

        setConversations(sortedRooms);
      } catch (err) {
        console.error("Failed to load chat rooms", err);
      } finally {
        setLoading(false);
      }
    };

    loadRooms();

    const topic = `/topic/chat/${user.userId}`;
    const client = connectChatWebSocket(topic, (newMessage) => {
      console.log('📩 Received message via WebSocket:', newMessage);
      setConversations(prev => prev.map(conv => {
        if (conv.id === newMessage.roomId) {
          const alreadyExists = (conv.messages || []).some(m =>
            m.id === newMessage.id ||
            (m._tempId && m.content === newMessage.content && m.senderId === newMessage.senderId)
          );
          if (alreadyExists) {
            return {
              ...conv,
              messages: (conv.messages || []).map(m =>
                (m._tempId && m.content === newMessage.content && m.senderId === newMessage.senderId)
                  ? newMessage : m
              ),
              lastMessage: newMessage.content,
              lastUpdate: newMessage.timestamp
            };
          }
          return {
            ...conv,
            messages: [...(conv.messages || []), newMessage],
            lastMessage: newMessage.content,
            lastUpdate: newMessage.timestamp,
            unreadCountCandidate: conv.id === selectedId ? 0 : (conv.unreadCountCandidate || 0) + 1
          };
        }
        return conv;
      }));
    });

    setStompClient(client);
    return () => {
      if (client) client.disconnect();
    };
  }, [user?.userId]);

  // 2. Fetch History when selected room changes
  useEffect(() => {
    if (selectedId && user?.userId) {
      const loadHistory = async () => {
        try {
          const history = await fetchChatHistory(selectedId);
          setConversations(prev => prev.map(c => {
            if (c.id === selectedId) {
              return { ...c, messages: history };
            }
            return c;
          }));
          // Mark as read
          await markChatAsRead(selectedId, user.userId);
        } catch (err) {
          console.error("Failed to load chat history", err);
        }
      };
      loadHistory();
    }
  }, [selectedId, user?.userId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (stompClient && message.trim() && selectedConversation) {
      const chatMessage = {
        roomId: selectedConversation.id,
        senderId: user.userId,
        receiverId: selectedConversation.companyId,
        senderName: user.fullName || user.username,
        companyName: selectedConversation.companyName,
        companyLogo: selectedConversation.companyLogo,
        content: message,
        type: 'TEXT'
      };

      // Optimistic update - hiện tin nhắn ngay lập tức trên UI
      const optimisticMessage = {
        ...chatMessage,
        _tempId: Date.now(),
        timestamp: new Date().toISOString(),
        isRead: false
      };

      setConversations(prev => prev.map(conv => {
        if (conv.id === selectedConversation.id) {
          return {
            ...conv,
            messages: [...(conv.messages || []), optimisticMessage],
            lastMessage: message,
            lastUpdate: new Date().toISOString()
          };
        }
        return conv;
      }));

      stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
      setMessage('');
    }
  };

  console.log("conversation", filteredConversations);
  console.log("selectedConversation", selectedConversation);
  console.log("stompClient", stompClient);
  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar - Conversation List */}
      <div className="w-1/4 min-w-[320px] bg-white border-r border-gray-200 flex flex-col shadow-sm">
        <div className="p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <MessageSquare className="text-emerald-500" size={24} />
              Tin nhắn
              {conversations.some(c => c.unreadCountCandidate > 0) && (
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span>
              )}
            </h2>
            <div className="bg-emerald-50 p-2 rounded-full text-emerald-600 hover:bg-emerald-100 cursor-pointer transition-colors">
              <MoreVertical size={20} />
            </div>
          </div>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Tìm theo công ty, vị trí..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white focus:border-emerald-500 transition-all text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
          {filteredConversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => {
                setSelectedId(conv.id);
                // Xóa bold khi click vào phòng chat
                setConversations(prev => prev.map(c =>
                  c.id === conv.id ? { ...c, unreadCountCandidate: 0 } : c
                ));
              }}
              className={`p-4 flex items-center gap-3 cursor-pointer transition-all border-l-4 ${selectedId === conv.id
                ? 'bg-emerald-50 border-emerald-500'
                : 'hover:bg-gray-50 border-transparent'
                }`}
            >
              <div className="relative flex-shrink-0">
                <img
                  src={conv.companyLogo}
                  alt={conv.companyName}
                  className="w-12 h-12 rounded-xl object-contain bg-white border border-gray-100 shadow-sm"
                  onError={(e) => e.target.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeplpRN1hSAQoBqsMoIHnQwfn4zC8yFJldEjYoL8Mi8g&s=10'}
                />
                <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 ${conv.unreadCountCandidate > 0 ? 'bg-red-500' : 'bg-emerald-500'} border-2 border-white rounded-full`}></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-0.5">
                  <h3 className="font-bold text-gray-900 truncate text-[15px]">{conv.companyName}</h3>
                  <span className="text-[11px] text-gray-400 font-medium">
                    {conv.lastUpdate ? new Date(conv.lastUpdate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </div>
                <p className="text-xs text-emerald-600 font-semibold mb-1 truncate">{conv.jobTitle || 'Nhà tuyển dụng'}</p>
                <p className={`text-xs truncate ${conv.unreadCountCandidate > 0 ? 'text-gray-900 font-bold' : 'text-gray-500'}`}>
                  {conv.lastMessage}
                </p>
              </div>
              {conv.unreadCountCandidate > 0 && (
                <div className="bg-emerald-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-lg shadow-emerald-200">
                  {conv.unreadCountCandidate}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Window */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={selectedConversation.companyLogo}
                    alt={selectedConversation.companyName}
                    className="w-11 h-11 rounded-xl object-contain bg-white border border-gray-100"
                    onError={(e) => e.target.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeplpRN1hSAQoBqsMoIHnQwfn4zC8yFJldEjYoL8Mi8g&s=10'}
                  />
                  {selectedConversation.online && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 text-lg leading-tight">{selectedConversation.companyName}</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] text-gray-500">{selectedConversation.jobTitle}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span className={`text-[11px] font-bold uppercase ${selectedConversation.online ? 'text-emerald-500' : 'text-gray-400'}`}>
                      {selectedConversation.online ? 'Đang hoạt động' : 'Ngoại tuyến'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">
                  <Phone size={20} />
                </button>
                <button className="p-2.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">
                  <Video size={20} />
                </button>
                <button className="p-2.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">
                  <Info size={20} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-gray-50/30"
            >
              <div className="flex justify-center my-4">
                <span className="px-3 py-1 bg-gray-100 rounded-full text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Bắt đầu cuộc trò chuyện
                </span>
              </div>

              {selectedConversation.messages.map((msg) => (
                <div
                  key={msg.id || Math.random()}
                  className={`flex ${msg.senderId === user.userId ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[70%] ${msg.senderId === user.userId ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-white font-bold text-xs ${msg.senderId === user.userId ? 'bg-indigo-500' : 'bg-emerald-500'
                      }`}>
                      {msg.senderId === user.userId ? <User size={14} /> : (
                        <img src={selectedConversation.companyLogo} className="w-6 h-6 object-contain rounded" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <div
                        className={`px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed shadow-sm
                          break-words whitespace-pre-wrap max-w-full overflow-hidden ${msg.senderId === user.userId
                            ? 'bg-emerald-600 text-white rounded-tr-none'
                            : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                          }`}
                      >
                        {msg.content}
                      </div>
                      <div className={`flex items-center gap-1.5 px-1 ${msg.senderId === user.userId ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-[10px] text-gray-400 font-medium">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {msg.senderId === user.userId && (
                          msg.isRead ? <CheckCheck size={12} className="text-emerald-500" /> : <Check size={12} className="text-gray-300" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 bg-white border-t border-gray-100">
              <form
                onSubmit={handleSendMessage}
                className="flex items-center gap-3 bg-gray-50 p-2 rounded-2xl border border-gray-100 focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-500/5 transition-all"
              >
                <button type="button" className="p-2 text-gray-400 hover:text-emerald-500 transition-colors">
                  <MoreVertical size={20} />
                </button>
                <input
                  type="text"
                  placeholder="Nhập nội dung tin nhắn..."
                  className="flex-1 bg-transparent border-none outline-none focus:outline-none focus:ring-0 focus:border-none shadow-none text-[18px] placeholder:text-[16px] text-gray-700 px-2 py-1 "
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className={`p-2.5 rounded-xl transition-all ${message.trim()
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700 active:scale-95'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-gray-50/50">
            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <MessageSquare size={40} className="text-emerald-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Chào mừng đến với Career Connect Chat</h2>
            <p className="text-gray-500 max-w-sm leading-relaxed">
              Hãy chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu trao đổi với nhà tuyển dụng.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
