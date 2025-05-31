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
import { app } from './firebase';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { CartProvider } from './components/CartContext';
import  Products  from './components/Products';

function App() {
  const [user, setUser ] = useState(null);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (currentUser ) => {
      setUser (currentUser );
    });

    return () => unsubscribe();
  }, []);

  const location = useLocation();

  return (
    <CartProvider>
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
           <Route path="/Products" element={<Products />} />
        </Routes>
         <Categories />
      </main>
      <Footer />
    </div>
</CartProvider>
  );
}

export default App;
