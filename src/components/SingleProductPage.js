import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';  // upewnij się, że ścieżka jest poprawna
import fishpic from '../assets/placeholder.png';
import "./SingleProductPage.css";

function SingleProductPage() {
   const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

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
        <img src={fishpic} alt={product.Name || "ProductImage"} />
      </div>

      <div className="ProductInfo">
        <span className="ProductName">{product.Name}</span>
        <span className="ProductBrand">{product.Brand}</span>
        <span className="ProductPrice">{product.price.toFixed(2)} zł</span>
        <button className="AddToCart">Dodaj do koszyka</button>
      </div>

      <div className="ExtendedInfo">
        <div className="ProductDescription">
          {product.description || "Brak opisu produktu."}
        </div>
      </div>

    </div>
  );
}

export default SingleProductPage;
