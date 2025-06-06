import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import "./styles.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Main from "./components/Main";
import Categories from "./components/Categories";
import Registration from "./components/Registration";
import ProductPage from "./components/ProductPage";
import Login from "./components/Login";
import Account from "./components/Account";
import ShoppingCart from "./components/ShoppingCart"
import Success from './components/Success';
import { app } from './firebase';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { CartProvider } from './components/CartContext';
import  Products  from './components/Products';
import  SingleProductPage  from './components/SingleProductPage';

function App() {
    // Stan przechowujący aktualnie zalogowanego użytkownika
  const [user, setUser ] = useState(null);

  useEffect(() => {
        // Inicjalizacja Firebase Auth i nasłuchiwanie zmian w stanie logowania użytkownika
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (currentUser ) => {
      setUser (currentUser );
    });
        // Czyszczenie nasłuchiwania
    return () => unsubscribe();
  }, []);

  const location = useLocation();

  return (
    <CartProvider> {/* Kontekst koszyka dostępny dla całej aplikacji */}
    <div className="app">
      <Navbar />
      <main>
        <Routes>
          <Route path="/Account" element={<Account user={user} />} />
          <Route path="/Registration" element={<Registration />} />
          <Route path="/" element={<Main />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/ProductPage" element={<ProductPage />} />
          <Route path="/ShoppingCart" element={<ShoppingCart />} />
          <Route path="/Success" element={<Success />} />
          <Route path="/Products" element={<Products />} />
          <Route path="/SingleProductPage/:id" element={<SingleProductPage />} />
        </Routes>
        {/* Render Categories only if not on specific routes */}
        {location.pathname !== "/Registration" && !location.pathname.startsWith("/SingleProductPage") && location.pathname !== "/Products" && location.pathname !== "/Success" && location.pathname !== "/registration" && location.pathname !== "/ProductPage" && location.pathname !== "/ShoppingCart" && location.pathname !== "/Login" && location.pathname !== "/Account" && <Categories />}
      </main>
      {/* Render Footer only if not on specific routes */}
      {location.pathname !== "/ProductPage" && location.pathname !== "/Products" && location.pathname !== "/Success" &&  location.pathname !== "/ShoppingCart" && location.pathname !== "/Account" && <Footer />}
    </div>
</CartProvider>
  );
}

export default App;
