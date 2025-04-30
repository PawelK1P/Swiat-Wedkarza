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
import SingleProductPage from './components/SingleProductPage';
import { app } from './firebase';
import { getAuth, onAuthStateChanged } from "firebase/auth";

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
    <div className="app">
      {/* Render Navbar only if not on specific routes */}
      {location.pathname !== "/Registration" && location.pathname !== "/Login" && location.pathname !== "/Account" && <Navbar user={user} />}
      <main>
        <Routes>
          <Route path="/Account" element={<Account user={user} />} />
          <Route path="/Registration" element={<Registration />} />
          <Route path="/" element={<Main />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/ProductPage" element={<ProductPage />} />
          <Route path="/SingleProductPage" element={<SingleProductPage />} />
        </Routes>
        {/* Render Categories only if not on specific routes */}
        {location.pathname !== "/Registration" && location.pathname !== "/ProductPage" && location.pathname !== "/SingleProductPage" && location.pathname !== "/Login" && location.pathname !== "/Account" && <Categories />}
      </main>
      {/* Render Footer only if not on specific routes */}
      {location.pathname !== "/Registration" && location.pathname !== "/ProductPage" && location.pathname !== "/Login" && location.pathname !== "/Account" && <Footer />}
    </div>
  );
}

export default App;