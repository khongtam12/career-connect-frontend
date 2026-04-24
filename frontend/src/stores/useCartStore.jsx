import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
    persist(
        (set) => ({
            quantities: {}, // Single-item cart { packageId: 1 }
            selectedDurations: {}, // Selected duration for the current package

            // Only keep one package in the cart for each checkout flow
            addToCart: (id, _qty, duration) => {
                set(() => ({
                    quantities: {
                        [id]: 1
                    },
                    selectedDurations: {
                        [id]: duration
                    }
                }));
            },

            // Quantity is fixed at 1, keep the API stable for the current UI
            updateCartQuantity: (id) => {
                set((state) => {
                    if (!state.quantities[id]) return state;
                    return {
                        quantities: {
                            ...state.quantities,
                            [id]: 1
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
