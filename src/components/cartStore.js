import { create } from "zustand"
import { persist } from "zustand/middleware"

//tworzenie store'a
export const useCartStore = create(
  //persist umożliwiwa trwałe przechowywanie stanu koszyka 
  persist(
    //funkcje do aktualizacji i pobierania stanu 
    (set, get) => ({
      //pusta tablica items 
      items: [],

      //dodawanie produktu do koszyka
      addItem: (product) => {
        const { items } = get()
        const existingItem = items.find((item) => item.id === product.id)

        if (existingItem) {
          set({
            items: items.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)),
          })
        } else {
          set({ items: [...items, { ...product, quantity: 1 }] })
        }
      },

      //usuwanie produktu z koszyka
      removeItem: (productId) => {
        const { items } = get()
        set({ items: items.filter((item) => item.id !== productId) })
      },

      //zwiększanie ilości 
      increaseQuantity: (productId) => {
        const { items } = get()
        set({
          items: items.map((item) => (item.id === productId ? { ...item, quantity: item.quantity + 1 } : item)),
        })
      },

      //zmniejszanie ilości 
      decreaseQuantity: (productId) => {
        const { items } = get()
        const item = items.find((item) => item.id === productId)

        if (item?.quantity === 1) {
          set({ items: items.filter((item) => item.id !== productId) })
        } else {
          set({
            items: items.map((item) => (item.id === productId ? { ...item, quantity: item.quantity - 1 } : item)),
          })
        }
      },

      //obliczanie sumy koszyka
      getCartTotal: () => {
        const { items } = get()
        return items.reduce((total, item) => total + item.price * item.quantity, 0)
      },

      //obliczanie liczby produktów w koszyku
      getItemsCount: () => {
        const { items } = get()
        return items.reduce((count, item) => count + item.quantity, 0)
      },

      //czyszczenie koszyka
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "cart-storage", //nazwa w localStorage
      getStorage: () => localStorage, //localStorage jest używany do przechowywania stanu
    },
  ),
)
