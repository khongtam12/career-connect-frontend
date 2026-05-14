import apiClient from "./apiClient";
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const BASE_URL = (import.meta.env.VITE_BACKEND_URL || '').replace(/\/$/, '');
const WS_URL = `${BASE_URL}/api/v1/notifications/ws`;

// 1. Fetch thông báo cũ từ Backend
export const fetchNotificationsByCompanyId = async (companyId) => {
  const res = await apiClient.get(`/api/v1/notifications/company/${companyId}`);
  return res.data;
};

// 2. Đánh dấu 1 thông báo đã đọc
export const markNotificationAsRead = async (notiId) => {
  const res = await apiClient.put(`/api/v1/notifications/${notiId}/read`);
  return res.data;
};

// 3. Mở kết nối STOMP Websocket
export const connectNotificationWebSocket = (companyId, onNotificationReceived) => {
  const socket = new SockJS(WS_URL);
  const stompClient = Stomp.over(socket);
  
  // Ẩn log STOMP cho sạch console
  stompClient.debug = () => {}; 
  
  stompClient.connect({}, () => {
    stompClient.subscribe(`/topic/company/${companyId}/notifications`, (message) => {
      const newNoti = JSON.parse(message.body);
      onNotificationReceived(newNoti);
    });
  });

  return stompClient;
};

// --- CHAT API ---
export const fetchChatHistory = async (roomId) => {
  const res = await apiClient.get(`/api/v1/notifications/chat/history/${roomId}`);
  return res.data;
};

export const fetchCandidateChatRooms = async (candidateId) => {
  const res = await apiClient.get(`/api/v1/notifications/chat/rooms/candidate/${candidateId}`);
  return res.data;
};

export const fetchCompanyChatRooms = async (companyId) => {
  const res = await apiClient.get(`/api/v1/notifications/chat/rooms/company/${companyId}`);
  return res.data;
};

export const markChatAsRead = async (roomId, userId) => {
  const res = await apiClient.post(`/api/v1/notifications/chat/read/${roomId}/${userId}`);
  return res.data;
};

// Helper kết nối Chat WebSocket qua Gateway
export const connectChatWebSocket = (topic, onMessageReceived) => {
  const socket = new SockJS(WS_URL);
  const stompClient = Stomp.over(socket);
  stompClient.debug = () => {};

  stompClient.connect({}, () => {
    stompClient.subscribe(topic, (payload) => {
      onMessageReceived(JSON.parse(payload.body));
    });
  });

  return stompClient;
};
