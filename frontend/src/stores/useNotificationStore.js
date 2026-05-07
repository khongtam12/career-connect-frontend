import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useNotificationStore = create(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,

      // Khi fetch từ backend (lúc mount hoặc reload)
      setNotifications: (notis) => {
        const unread = notis.filter(n => !n.read).length;
        set({ notifications: notis, unreadCount: unread });
      },

      // Khi nhận thông báo mới từ WebSocket
      addNotification: (noti) => set((state) => ({
        notifications: [noti, ...state.notifications],
        unreadCount: state.unreadCount + 1
      })),

      // Đánh dấu 1 thông báo đã đọc
      markAsReadLocally: (id) => set((state) => ({
        notifications: state.notifications.map(n =>
          n.id === id ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      })),

      // Đánh dấu tất cả đã đọc
      markAllAsRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, read: true })),
        unreadCount: 0
      })),

      // Flag báo có ứng viên mới (để CVManagement biết cần refetch)
      hasNewCandidate: false,
      setHasNewCandidate: (val) => set({ hasNewCandidate: val }),
    }),
    {
      name: 'notification-storage',
      // Chỉ persist những gì cần thiết để thông báo không mất khi reload
      partialize: (state) => ({
        notifications: state.notifications,
        unreadCount: state.unreadCount,
      }),
    }
  )
);
