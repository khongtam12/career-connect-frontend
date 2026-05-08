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
                    set({ loading: true, error: null });

                    const user = await getCurrentUser();

                    set({
                        user,
                        isAuthenticated: !!user,
                        loading: false,
                    });

                    return user;
                } catch (err) {
                    set({
                        user: null,
                        isAuthenticated: false,
                        loading: false,
                    });

                    return null;
                }
            },

            //  Login success handler (dùng sau khi login API thành công)
            handleLoginSuccess: async () => {
                try {
                    set({ loading: true, error: null });

                    const user = await getCurrentUser();

                    set({
                        user,
                        isAuthenticated: !!user,
                        loading: false,
                    });


                    return user;
                } catch (err) {
                    set({
                        error: "Không lấy được thông tin người dùng",
                        loading: false,
                    });
                    throw err;
                }
            },

            // Logout
            logout: async () => {
                try {
                    set({ loading: true });

                    await logoutAccount(); // BE clear cookie

                } catch (err) {
                    console.error("Logout error:", err);
                } finally {
                    set({
                        user: null,
                        isAuthenticated: false,
                        loading: false,
                    });
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