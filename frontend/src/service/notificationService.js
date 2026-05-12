import apiClient from "./apiClient";
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

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
  const socket = new SockJS(`http://localhost:8080/api/v1/notifications/ws`);
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
