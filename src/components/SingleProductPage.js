import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';  // upewnij się, że ścieżka jest poprawna
import fishpic from '../assets/placeholder.png';
import "./SingleProductPage.css";
import { useCart } from "./CartContext";

function SingleProductPage() {
   const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const {addToCart} = useCart();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const docRef = doc(db, 'Products', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProduct(docSnap.data());
        } else {
          alert("Produkt nie istnieje");
          navigate('/'); // przekierowanie np. do strony głównej
        }
      } catch (error) {
        console.error("Błąd przy pobieraniu produktu:", error);
      }
    }
    fetchProduct();
  }, [id, navigate]);

  if (!product) return null;  // tutaj usunięto komunikat ładowania

  return (
    <div className="SingleProduct">
      <div className="ProductImage">
        <img src={product.imageURL} alt={product.Name || "ProductImage"} />
      </div>

      <div className="ProductInfo">
        <span className="ProductName">Name: {product.Name}</span>
        <span className="ProductBrand">Brand: {product.Brand}</span>
        <span className="ProductPrice">Price: {product.price.toFixed(2)} zł</span>
        <span className="ProductAmount">Amount: {product.amount}</span>
        <button className="AddToCart" onClick={() => addToCart(product)}>Dodaj do koszyka</button>
      </div>
        <div className="ProductDescription">
          {product.description || "Brak opisu produktu."}
        </div>

    </div>
  );
}

export default SingleProductPage;
