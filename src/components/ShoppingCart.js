import { Link } from "react-router-dom";
import { useCartStore } from "./cartStore";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import "./ShoppingCart.css";

function ShoppingCart() {
  const { items: cartItems, removeItem, increaseQuantity, decreaseQuantity, getCartTotal } = useCartStore();
  const cartTotal = getCartTotal();

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

  const initialOptions = {
    "client-id": "ARZYS2NGS064vZSmJEIXKqqCGOArRxajPsY4kKV2M9OGGpZyW4_e1o2uolG0MO9TCRdZZrMb-CVJHSv5", 
    currency: "PLN", 
    intent: "capture",
  };

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: cartTotal.toFixed(2), 
            currency_code: "PLN",
          },
        },
      ],
    });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then((details) => {
      const name = details.payer.name.given_name;
    });
  };

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
              <div className="image">
                <img src={item.image} alt={item.Name} />
              </div>

              <div className="details">
                <h3>{item.Brand}</h3>
                <p className="name">{item.Name}</p>
                <p className="price">{item.price.toFixed(2)} zł</p>
              </div>

              <div className="actions">
                <div className="quantity">
                  <button onClick={() => decreaseQuantity(item.id)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQuantity(item.id)}>+</button>
                </div>

                <p className="total">Suma: {(item.price * item.quantity).toFixed(2)} zł</p>

                <button className="remove" onClick={() => removeItem(item.id)}>
                  Usuń
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="summary">
          <h2>Podsumowanie</h2>
          <div className="row">
            <span>Suma produktów:</span>
            <span>{cartTotal.toFixed(2)} zł</span>
          </div>
          <div className="row">
            <span>Koszt dostawy:</span>
            <span>0.00 zł</span>
          </div>
          <div className="total-row">
            <span>Razem:</span>
            <span>{cartTotal.toFixed(2)} zł</span>
          </div>

          <div className="paypal-button-container">
            <PayPalScriptProvider options={initialOptions}>
              <PayPalButtons
                createOrder={createOrder}
                onApprove={onApprove}
                onError={onError}
                style={{
                  layout: "vertical",
                  color: "gold",
                  shape: "rect",
                  label: "paypal",
                  height: 48,
                }}
              />
            </PayPalScriptProvider>
          </div>

          <Link to="/ProductPage">
            <button className="continue">Kontynuuj zakupy</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCart;