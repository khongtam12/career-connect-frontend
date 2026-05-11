import { create } from "zustand";
import { persist } from "zustand/middleware";

// giả sử bạn có API
import { getCurrentUser, logoutAccount } from "../service/authService";

export const useUserStore = create(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            loading: false,
            error: null,

            // Auth Dialog state
            isAuthDialogOpen: false,
            isDialogClosable: true,
            authDialogCallback: null,

            // Set user (internal)
            setUser: (user) =>
                set({
                    user,
                    isAuthenticated: !!user,
                }),

            // Clear user
            clearUser: () =>
                set({
                    user: null,
                    isAuthenticated: false,
                }),

            // Fetch user từ BE (dùng khi reload hoặc OAuth redirect)
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

                    if (
                        err.response?.status === 401 ||
                        err.response?.status === 403
                    ) {
                        set({
                            user: null,
                            isAuthenticated: false,
                        });
                    }

                    set({ loading: false });

                    return null;
                }
            },
            //  Login success handler (dùng sau khi login API thành công)
            handleLoginSuccess: async () => {
                try {
                    set({ loading: true, error: null });

                    // Xóa dữ liệu cũ trước khi fetch mới
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
                        isAuthenticated: false
                    });
                    throw err;
                }
            },

            // Logout
            logout: async () => {
                try {
                    set({ loading: true });
                    await logoutAccount();
                } catch (err) {
                    console.error("Logout error:", err);
                } finally {
                    // Luôn luôn xóa local state dù BE logout lỗi hay không
                    set({
                        user: null,
                        isAuthenticated: false,
                        loading: false,
                    });
                    localStorage.removeItem("user-storage"); // Xóa cứng để đảm bảo sạch sẽ
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

            //  chỉ persist những gì cần thiết
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);