import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
    persist(
        (set, get) => ({
            quantities: {}, // Global cart quantities { packageId: qty }
            selectedDurations: {}, // Global selected durations { packageId: durationText }

            // Add item to cart with specific quantity and duration
            addToCart: (id, qty, duration) => {
                set((state) => ({
                    quantities: {
                        ...state.quantities,
                        [id]: (state.quantities[id] || 0) + qty
                    },
                    selectedDurations: {
                        ...state.selectedDurations,
                        [id]: duration
                    }
                }));
            },

            // Update quantity of an item already in the cart
            updateCartQuantity: (id, delta) => {
                set((state) => {
                    const currentQty = state.quantities[id] || 0;
                    const newQty = Math.max(1, currentQty + delta);
                    return {
                        quantities: {
                            ...state.quantities,
                            [id]: newQty
                        }
                    };
                });
            },

            // Remove an item entirely from the cart
            removeFromCart: (id) => {
                set((state) => {
                    const newQuantities = { ...state.quantities };
                    const newDurations = { ...state.selectedDurations };
                    delete newQuantities[id];
                    delete newDurations[id];
                    return {
                        quantities: newQuantities,
                        selectedDurations: newDurations
                    };
                });
            },

            // Clear the entire cart
            clearCart: () => {
                set({
                    quantities: {},
                    selectedDurations: {}
                });
            }
        }),
        {
            name: 'employer-cart-storage', // Key in localStorage
        }
    )
);
