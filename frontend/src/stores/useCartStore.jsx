import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
    persist(
        (set) => ({
            items: [], // [{ id, duration, quantity, price, name, image, category, jobPostLimit }]

            addToCart: (product) => {
                set((state) => {
                    const exists = state.items.some(
                        (item) => item.id === product.id && item.duration === product.duration
                    );
                    
                    if (exists) return state; // Already handled by UI being disabled, but for safety
                    
                    return { items: [...state.items, product] };
                });
            },

            removeFromCart: (id, duration) => {
                set((state) => ({
                    items: state.items.filter(
                        (item) => !(item.id === id && item.duration === duration)
                    )
                }));
            },

            clearCart: () => {
                set({ items: [] });
            }
        }),
        {
            name: 'employer-cart-storage',
        }
    )
);
