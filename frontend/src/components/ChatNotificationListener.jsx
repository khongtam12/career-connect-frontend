import { useEffect } from 'react';
import { useUserStore } from '../stores/useUserStore';
import { useNotificationStore } from '../stores/useNotificationStore';
import { fetchCandidateChatRooms, fetchCompanyChatRooms, connectChatWebSocket } from '../service/notificationService';
import { isServiceUnavailableError } from '../service/apiClient';

const ChatNotificationListener = () => {
  const { user, isAuthenticated } = useUserStore();
  const { setUnreadChatCount } = useNotificationStore();

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    // 1. Fetch initial unread count
    const loadUnreadCount = async () => {
      try {
        let rooms = [];
        if (user.role === 'CANDIDATE') {
          rooms = await fetchCandidateChatRooms(user.userId);
          const total = rooms.reduce((sum, r) => sum + (r.unreadCountCandidate || 0), 0);
          setUnreadChatCount(total);
        } else if (user.companyId) {
          rooms = await fetchCompanyChatRooms(user.companyId);
          const total = rooms.reduce((sum, r) => sum + (r.unreadCountEmployer || 0), 0);
          setUnreadChatCount(total);
        }
      } catch (err) {
        if (isServiceUnavailableError(err)) {
          setUnreadChatCount(0);
          return;
        }
        console.error("Failed to fetch initial chat unread count", err);
      }
    };

    loadUnreadCount();

    const topic = user.role === 'CANDIDATE'
      ? `/topic/chat/${user.userId}`
      : (user.role === 'EMPLOYER' ? `/topic/chat/${user.companyId}` : null);

    if (!topic) return;

    const client = connectChatWebSocket(topic, () => {
      // Mỗi khi có tin nhắn mới, ta fetch lại để có con số chính xác nhất
      loadUnreadCount();
    });

    return () => {
      if (client) client.disconnect();
    };
  }, [isAuthenticated, user?.userId, user?.companyId, setUnreadChatCount]);

  return null;
};

export default ChatNotificationListener;
