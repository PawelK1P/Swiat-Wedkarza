import { Link, useNavigate } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import "./ShoppingCart.css";
import { useCart } from "./CartContext"
import { useState } from "react";


function ShoppingCart() {
  const navigate = useNavigate();
    // Hook z kontekstu koszyka – zawiera dane i funkcje do zarządzania koszykiem
const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity, getTotalPrice, clearCart } = useCart()
  // Lokalny stan dla formularza danych do wysyłki
const [formData, setFormData] = useState({
  address: "",
  phone: "",
  postalCode: "",
  email: "",
});
  // Funkcja walidująca poprawność danych z formularza
const isFormValid = () => {
  const { address, phone, postalCode, email } = formData;
  const phoneRegex = /^[0-9]{9}$/;
  const postalCodeRegex = /^[0-9]{2}-[0-9]{3}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return (
    address.trim() !== "" &&
    phoneRegex.test(phone) &&
    postalCodeRegex.test(postalCode) &&
    emailRegex.test(email)
  );
};
  // Jeśli koszyk jest pusty – pokaż komunikat i przycisk powrotu do sklepu
  if (cartItems.length === 0) {
    return (
      <div className="empty">
        <h2>Twój koszyk jest pusty</h2>
        <p>Dodaj produkty do koszyka, aby kontynuować zakupy.</p>
        <Link to="/ProductPage">
          <button className="shop-button">Wróć do sklepu</button>
        </Link>
      </div>
    );
  }
  // Konfiguracja PayPal (Client ID i inne opcje)
  const initialOptions = {
    "client-id": "", 
    currency: "PLN", 
    intent: "capture",
  };
  // Tworzenie zamówienia w PayPal
  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: getTotalPrice().toFixed(2), 
            currency_code: "PLN",
          },
        },
      ],
    });
  };

  // Po pomyślnym zatwierdzeniu płatności – przejdź do strony sukcesu i wyczyść koszyk
  const onApprove = (data, actions) => {
    return actions.order.capture().then((details) => {
        navigate("/Success", { state: { purchasedItems: cartItems}})    
        clearCart()
    });
  };
  // Obsługa błędu PayPal
  const onError = (err) => {
    console.error("PayPal error", err);
    alert("Wystąpił błąd podczas przetwarzania płatności. Spróbuj ponownie.");
  };



  return (
    <div className="cart">
      <h1>Koszyk</h1>

      <div className="container">
        <div className="items">
          {cartItems.map((item) => (
            <div className="item" key={item.id}>
              <Link to={`/SingleProductPage/${item.id}`} className="link-container">
              <div className="image">
                <img src={item.imageURL} alt={item.Name} />
              </div>
              
              <div className="details">
                <h3>{item.Brand}</h3>
                <p className="name">{item.Name}</p>
                <p className="price">{item.price.toFixed(2)} zł</p>
              </div>
              </Link>

              <div className="actions">
                <div className="quantity">
                  <button onClick={() => decreaseQuantity(item.id)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQuantity(item.id)}>+</button>
                </div>

                <p className="total">Suma: {(item.price * item.quantity).toFixed(2)} zł</p>

                <button className="remove" onClick={() => removeFromCart(item.id)}>
                  Usuń
                </button>
              </div>
            </div>
          ))}
          <div className="checkout-form">
  <h3>Dane do wysyłki</h3>

  <input
    type="text"
    name="address"
    placeholder="Adres"
    required
    className="full-width"
    value={formData.address}
    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
  />

  <div className="two-small">
    <input
      type="text"
      name="phone"
      placeholder="Numer telefonu (9 cyfr)"
      required
      value={formData.phone}
      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
    />
    <input
      type="text"
      name="postalCode"
      placeholder="Kod pocztowy (00-000)"
      required
      value={formData.postalCode}
      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
    />
  </div>
  <input
    type="email"
    name="email"
    placeholder="Adres e-mail"
    required
    className="full-width"
    value={formData.email}
    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
  />
  </div>
        </div>
      

        <div className="summary">
          <h2>Podsumowanie</h2>
          <div className="row">
            <span>Suma produktów:</span>
            <span>{getTotalPrice().toFixed(2)} zł</span>
          </div>
          <div className="row">
            <span>Koszt dostawy:</span>
            <span>Darmowa</span>
          </div>
          <div className="total-row">
            <span>Razem:</span>
            <span>{getTotalPrice().toFixed(2)} zł</span>
          </div>

           <PayPalScriptProvider options={initialOptions}>
  {!isFormValid() && (
    <p style={{ color: "red"}}>
      Upewnij się, że wszystkie pole są wypełnione poprawnie.
    </p>
  )}
  <PayPalButtons
    createOrder={createOrder}
    onApprove={onApprove}
    onError={onError}
    disabled={!isFormValid()}
  />
</PayPalScriptProvider>



          <Link to="/ProductPage">
            <button className="continue">Kontynuuj zakupy</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCart;
