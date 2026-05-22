import apiClient, { getApiBaseURL } from "./apiClient";
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const notificationRequestConfig = (overrides = {}) => ({
  serviceName: 'notification-service',
  ...overrides,
});

const createStompClient = () => {
  const wsURL = `${getApiBaseURL().replace(/\/$/, '')}/api/v1/notifications/ws`;
  const stompClient = Stomp.over(() => new SockJS(wsURL));
  stompClient.debug = () => {};
  stompClient.reconnect_delay = 5000;
  return stompClient;
};

export const fetchNotificationsByCompanyId = async (companyId) => {
  const res = await apiClient.get(
    `/api/v1/notifications/company/${companyId}`,
    notificationRequestConfig({ quietOn503: true })
  );
  return res.data;
};

export const markNotificationAsRead = async (notiId) => {
  const res = await apiClient.put(`/api/v1/notifications/${notiId}/read`);
  return res.data;
};

export const connectNotificationWebSocket = (companyId, onNotificationReceived) => {
  const stompClient = createStompClient();

  stompClient.connect({}, () => {
    stompClient.subscribe(`/topic/company/${companyId}/notifications`, (message) => {
      const newNoti = JSON.parse(message.body);
      onNotificationReceived(newNoti);
    });
  });

  return stompClient;
};

export const fetchChatHistory = async (roomId) => {
  const res = await apiClient.get(
    `/api/v1/notifications/chat/history/${roomId}`,
    notificationRequestConfig({ quietOn503: true })
  );
  return res.data;
};

export const fetchCandidateChatRooms = async (candidateId) => {
  const res = await apiClient.get(
    `/api/v1/notifications/chat/rooms/candidate/${candidateId}`,
    notificationRequestConfig({ quietOn503: true })
  );
  return res.data;
};

export const fetchCompanyChatRooms = async (companyId) => {
  const res = await apiClient.get(
    `/api/v1/notifications/chat/rooms/company/${companyId}`,
    notificationRequestConfig({ quietOn503: true })
  );
  return res.data;
};

export const markChatAsRead = async (roomId, userId) => {
  const res = await apiClient.post(`/api/v1/notifications/chat/read/${roomId}/${userId}`);
  return res.data;
};

export const connectChatWebSocket = (topic, onMessageReceived) => {
  const stompClient = createStompClient();

  stompClient.connect({}, () => {
    stompClient.subscribe(topic, (payload) => {
      onMessageReceived(JSON.parse(payload.body));
    });
  });

  return stompClient;
};
