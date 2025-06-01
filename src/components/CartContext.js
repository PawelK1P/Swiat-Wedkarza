import { createContext, useContext, useState } from "react"
// Tworzenie kontekstu koszyka — będzie udostępniany wszystkim komponentom w aplikacji
const CartContext = createContext()
// Komponent dostarczający kontekst 
export function CartProvider({ children }) {
  // Stan koszyka — tablica produktów z ich ilością
  const [cartItems, setCartItems] = useState([])
 // Funkcja dodająca produkt do koszyka
  const addToCart = (product) => {
    const existingItem = cartItems.find((item) => item.id === product.id)

    if (existingItem) {
      setCartItems(cartItems.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }])
    }
    alert("Produkt został dodany do koszyka")
  }
  // Funkcja usuwająca produkt z koszyka
  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
    alert("Produkt został usunięty z koszyka")
  }
  // Zwiększa ilość konkretnego produktu
  const increaseQuantity = (id) => {
    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item)))
  }
  // Zmniejsza ilość konkretnego produktu 
  const decreaseQuantity = (id) => {
    setCartItems(
      cartItems.map((item) => (item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item)),
    )
  }
// Oblicza całkowitą cenę koszyka
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }
  // Udostępnienie funkcji i stanu wszystkim komponentom korzystającym z tego kontekstu
  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
