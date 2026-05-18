import apiClient from "./apiClient";

/**
 * Tạo một kết nối SSE (Server-Sent Events) tới AI Chat Stream.
 * @param {string} requestMessage - Câu hỏi hoặc yêu cầu từ người dùng
 * @param {string} chatId - ID của cuộc trò chuyện (thường là userId hoặc guest-chat)
 * @returns {EventSource}
 */
export const createChatStream = (requestMessage, chatId, userId) => {
  // Lấy chính xác baseURL từ apiClient và loại bỏ dấu / ở cuối nếu có để tránh tạo ra double slash (//)
  const rawBaseURL = apiClient.defaults.baseURL || "http://localhost:8080";
  const baseURL = rawBaseURL.endsWith("/") ? rawBaseURL.slice(0, -1) : rawBaseURL;

  let url = `${baseURL}/api/v1/job/chat/stream?request=${encodeURIComponent(
    requestMessage
  )}&chatId=${encodeURIComponent(chatId)}`;

  if (userId) {
    url += `&userId=${encodeURIComponent(userId)}`;
  }

  return new EventSource(url);
};
