import { create } from "zustand";
import { persist } from "zustand/middleware";

import { getCurrentUser, logoutAccount } from "../service/authService";

export const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      isAuthDialogOpen: false,
      isDialogClosable: true,
      authDialogCallback: null,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      clearUser: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),

      fetchUser: async () => {
        try {
          set({ loading: true });

          const userData = await getCurrentUser();

          if (userData) {
            set({
              user: userData,
              isAuthenticated: true,
              loading: false,
            });

            return userData;
          }

          set({
            user: null,
            isAuthenticated: false,
            loading: false,
          });

          return null;
        } catch (err) {
          if (err.response?.status === 401 || err.response?.status === 403) {
            set({
              user: null,
              isAuthenticated: false,
            });
          }

          set({ loading: false });

          return null;
        }
      },

      handleLoginSuccess: async () => {
        try {
          set({ loading: true, error: null });

          set({ user: null, isAuthenticated: false });

          const userData = await getCurrentUser();

          if (userData) {
            set({
              user: userData,
              isAuthenticated: true,
              loading: false,
            });
            return userData;
          }
        } catch (err) {
          set({
            error: "Không lấy được thông tin người dùng",
            loading: false,
            isAuthenticated: false,
          });
          throw err;
        }
      },

      logout: async () => {
        try {
          set({ loading: true });
          await logoutAccount();
        } catch (err) {
          console.error("Logout error:", err);
        } finally {
          set({
            user: null,
            isAuthenticated: false,
            loading: false,
          });
          localStorage.removeItem("user-storage");
          localStorage.removeItem("career_connect_ai_messages");
        }
      },

      openAuthDialog: (options = { closable: true, onSuccess: null }) => {
        set({
          isAuthDialogOpen: true,
          isDialogClosable: options.closable ?? true,
          authDialogCallback: options.onSuccess ?? null,
        });
      },

      closeAuthDialog: () => set({ isAuthDialogOpen: false, authDialogCallback: null }),
    }),
    {
      name: "user-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
