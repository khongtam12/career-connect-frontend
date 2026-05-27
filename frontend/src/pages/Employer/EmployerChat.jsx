import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Send, Search, MoreVertical, MessageSquare, Phone, Video, Info, User, Check, CheckCheck } from 'lucide-react';
import { useUserStore } from "../../stores/useUserStore";
import { useNotificationStore } from "../../stores/useNotificationStore";
import { fetchChatHistory, fetchCompanyChatRooms, markChatAsRead, connectChatWebSocket } from "../../service/notificationService";
import { isServiceUnavailableError } from "../../service/apiClient";
import { getCandidatesForEmployer } from "../../service/applicationService";
import { getCandidateInfo } from "../../service/userService";

export default function EmployerChat() {
  const [searchParams] = useSearchParams();
  const candidateIdQuery = searchParams.get('candidateId');
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

  const messagesEndRef = useRef(null);
  const selectedIdRef = useRef(selectedId);

  useEffect(() => {
    selectedIdRef.current = selectedId;
  }, [selectedId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation?.messages, selectedId]);

  // Update global unread count
  useEffect(() => {
    const totalUnread = conversations.reduce((sum, conv) => sum + (conv.unreadCountEmployer || 0), 0);
    setUnreadChatCount(totalUnread);
  }, [conversations, setUnreadChatCount]);

  const filteredConversations = conversations.filter(c =>
    c.candidateName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => new Date(b.lastUpdate) - new Date(a.lastUpdate));

  // 1. Fetch Rooms & Connect WebSocket
  useEffect(() => {
    if (!user?.companyId) return;

    const loadRooms = async () => {
      try {
        // Lấy danh sách phòng chat đã có tin nhắn từ MongoDB
        let chatRooms = [];
        try {
          chatRooms = await fetchCompanyChatRooms(user.companyId) || [];
        } catch (e) {
          if (!isServiceUnavailableError(e)) {
            console.warn("Could not fetch chat rooms:", e);
          }
        }

        // Lấy danh sách ứng viên đã ứng tuyển vào công ty
        let candidatesList = [];
        try {
          const candidatesResponse = await getCandidatesForEmployer();
          console.log("getCandidatesForEmployer", candidatesResponse)
          // API trả về ApiResponse { status, message, data: [...] }
          candidatesList = candidatesResponse?.data || candidatesResponse || [];
          if (!Array.isArray(candidatesList)) candidatesList = [];
        } catch (e) {
          console.warn("Could not fetch candidates:", e);
        }

        // Mỗi cặp (candidateId + companyId) = 1 phòng chat
        const seenRoomIds = new Set();
        const mergedRooms = [];

        candidatesList.forEach(candidate => {
          const roomId = `${candidate.candidateId}_${user.companyId}`;
          if (seenRoomIds.has(roomId)) return;
          seenRoomIds.add(roomId);

          const existingRoom = chatRooms.find(r => r.id === roomId);
          if (existingRoom) {
            mergedRooms.push({
              ...existingRoom,
              candidateName: existingRoom.candidateName || candidate.fullName || 'Ứng viên',
              candidateId: candidate.candidateId,
              jobTitle: candidate.jobName || existingRoom.jobTitle || 'Tin tuyển dụng',
              messages: []
            });
          } else {
            mergedRooms.push({
              id: roomId,
              candidateId: candidate.candidateId,
              companyId: user.companyId,
              candidateName: candidate.fullName || 'Ứng viên',
              jobTitle: candidate.jobName || 'Tin tuyển dụng',
              lastMessage: 'Chưa có tin nhắn nào',
              lastUpdate: candidate.appliedAt,
              unreadCountEmployer: 0,
              messages: []
            });
          }
        });

        // Thêm những phòng chat cũ không nằm trong danh sách ứng viên
        chatRooms.forEach(cr => {
          if (!mergedRooms.find(m => m.id === cr.id)) {
            mergedRooms.push({ ...cr, messages: [] });
          }
        });

        // Fetch avatar của từng candidate từ user-service
        const roomsWithAvatar = await Promise.all(
          mergedRooms.map(async (room) => {
            if (room.candidateId) {
              try {
                const candidateInfo = await getCandidateInfo(room.candidateId);
                return { ...room, candidateAvatar: candidateInfo?.avatar || null };
              } catch {
                return room;
              }
            }
            return room;
          })
        );

        const sortedRooms = roomsWithAvatar.sort((a, b) => new Date(b.lastUpdate) - new Date(a.lastUpdate));

        // Fetch history cho phòng đầu tiên luôn để đảm bảo hiện tin nhắn ngay lập tức
        if (sortedRooms.length > 0) {
          let roomToSelect = sortedRooms[0];
          
          if (candidateIdQuery) {
            const targetRoomId = `${candidateIdQuery}_${user.companyId}`;
            const foundRoom = sortedRooms.find(r => r.id === targetRoomId);
            if (foundRoom) {
              roomToSelect = foundRoom;
            }
          }

          try {
            const history = await fetchChatHistory(roomToSelect.id);
            roomToSelect.messages = history;
          } catch (e) {
            console.error("Failed to fetch initial history", e);
          }
          setSelectedId(roomToSelect.id);
        }

        setConversations(sortedRooms);
      } catch (err) {
        console.error("Failed to load chat rooms", err);
      } finally {
        setLoading(false);
      }
    };

    loadRooms();

    const topic = `/topic/chat/${user.companyId}`;
    const client = connectChatWebSocket(topic, (newMessage) => {
      console.log('📩 Employer received message:', newMessage);
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
            unreadCountEmployer: conv.id === selectedIdRef.current ? 0 : (conv.unreadCountEmployer || 0) + 1
          };
        }
        return conv;
      }));
    });

    setStompClient(client);
    return () => {
      if (client) client.disconnect();
    };
  }, [user?.companyId, candidateIdQuery]);

  // 2. Fetch History when selected room changes
  useEffect(() => {
    if (selectedId && user?.companyId) {
      const loadHistory = async () => {
        try {
          const history = await fetchChatHistory(selectedId);
          setConversations(prev => prev.map(c => {
            if (c.id === selectedId) {
              return { ...c, messages: history };
            }
            return c;
          }));
          await markChatAsRead(selectedId, user.companyId);
        } catch (err) {
          if (isServiceUnavailableError(err)) {
            return;
          }
          console.error("Failed to load chat history", err);
        }
      };
      loadHistory();
    }
  }, [selectedId, user?.companyId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (stompClient && message.trim() && selectedConversation) {
      const chatMessage = {
        roomId: selectedConversation.id,
        senderId: user.companyId,
        receiverId: selectedConversation.candidateId,
        senderName: user.companyName,
        companyName: user.companyName,
        content: message,
        type: 'TEXT'
      };

      // Optimistic update - hiện tin nhắn ngay lập tức
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

  if (loading) return <div className="h-full flex items-center justify-center">Đang tải...</div>;

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar - Candidate List */}
      <div className="w-1/4 min-w-[320px] bg-white border-r border-gray-200 flex flex-col shadow-sm">
        <div className="p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <MessageSquare className="text-purple-600" size={24} />
              Tin nhắn ứng viên
              {conversations.some(c => c.unreadCountEmployer > 0) && (
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span>
              )}
            </h1>
          </div>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Tìm tên ứng viên..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:bg-white focus:border-purple-500 transition-all text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => {
                setSelectedId(conv.id);
                // Xóa bold khi click vào phòng chat
                setConversations(prev => prev.map(c =>
                  c.id === conv.id ? { ...c, unreadCountEmployer: 0 } : c
                ));
              }}
              className={`p-4 flex items-center gap-3 cursor-pointer transition-all border-l-4 ${selectedId === conv.id
                ? 'bg-purple-50 border-purple-500'
                : 'hover:bg-gray-50 border-transparent'
                }`}
            >
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-purple-100 flex items-center justify-center text-purple-600 font-bold border border-purple-200">
                  {conv.candidateAvatar
                    ? <img src={conv.candidateAvatar} alt={conv.candidateName} className="w-full h-full object-cover" />
                    : (conv.candidateName?.charAt(0) || <User size={24} />)
                  }
                </div>
                <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 ${conv.unreadCountEmployer > 0 ? 'bg-red-500' : 'bg-emerald-500'} border-2 border-white rounded-full`}></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-0.5">
                  <h3 className="font-bold text-gray-900 truncate text-[15px]">{conv.candidateName || 'Ứng viên'}</h3>
                  <span className="text-[11px] text-gray-400 font-medium">
                    {conv.lastUpdate ? new Date(conv.lastUpdate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </div>
                <p className="text-xs text-purple-600 font-semibold mb-1 truncate">{conv.jobTitle || 'Tin tuyển dụng'}</p>
                <p className={`text-xs truncate ${conv.unreadCountEmployer > 0 ? 'text-gray-900 font-bold' : 'text-gray-500'}`}>
                  {conv.lastMessage}
                </p>
              </div>
              {conv.unreadCountEmployer > 0 && (
                <div className="bg-purple-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-lg shadow-purple-200">
                  {conv.unreadCountEmployer}
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Main Chat Window */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedConversation ? (
          <>
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl overflow-hidden bg-purple-100 flex items-center justify-center text-purple-600 font-bold border border-purple-200">
                  {selectedConversation.candidateAvatar
                    ? <img src={selectedConversation.candidateAvatar} alt={selectedConversation.candidateName} className="w-full h-full object-cover" />
                    : (selectedConversation.candidateName?.charAt(0) || <User size={20} />)
                  }
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 text-lg leading-tight">{selectedConversation.candidateName || 'Ứng viên'}</h2>
                  <span className="text-[13px] text-gray-500">{selectedConversation.jobTitle || 'Tin tuyển dụng'}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all">
                  <Phone size={20} />
                </button>
                <button className="p-2.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all">
                  <Video size={20} />
                </button>
                <button className="p-2.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all">
                  <Info size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30">
              {selectedConversation.messages.map((msg) => (
                <div
                  key={msg.id || Math.random()}
                  className={`flex ${msg.senderId === user.companyId ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[70%] ${msg.senderId === user.companyId ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center text-white font-bold text-xs ${msg.senderId === user.companyId ? 'bg-purple-600' : 'bg-emerald-500'
                      }`}>
                      {msg.senderId === user.companyId ? (
                        <User size={14} />
                      ) : (
                        selectedConversation.candidateAvatar ? (
                          <img src={selectedConversation.candidateAvatar} alt="avatar" className="w-full h-full object-cover" />
                        ) : <span>{selectedConversation.candidateName?.charAt(0)}</span>
                      )}
                    </div>
                    <div className="space-y-1">
                      <div
                        className={`px-4 py-2.5 rounded-2xl text-[14px] shadow-sm
                          break-words whitespace-pre-wrap max-w-full overflow-hidden ${msg.senderId === user.companyId
                            ? 'bg-purple-600 text-white rounded-tr-none'
                            : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                          }`}
                      >
                        {msg.content}
                      </div>
                      <div className={`flex items-center gap-1.5 px-1 ${msg.senderId === user.companyId ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-[10px] text-gray-400 font-medium">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t border-gray-100">
              <form
                onSubmit={handleSendMessage}
                className="flex items-center gap-3 bg-gray-50 p-2 rounded-2xl border border-gray-100 focus-within:border-purple-500 focus-within:bg-white transition-all"
              >
                <button type="button" className="p-2 text-gray-400 hover:text-purple-500">
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
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <MessageSquare size={40} className="text-purple-200 mb-6" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Quản lý trò chuyện với ứng viên</h2>
            <p className="text-gray-500 max-w-sm">
              Chọn một ứng viên từ danh sách để bắt đầu trao đổi chi tiết về công việc.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
