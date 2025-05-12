import "./ProductPage.css"
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';


 function ProductPage() {
    
    const [products, setProducts] = useState([]);

    //pobranie produktów z bazy
    useEffect(() => {
        async function fetchData() {
        const querySnapshot = await getDocs(collection(db, 'Products'));
        const productList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        setProducts(productList);
        }

        fetchData();
    }, []);

    return (
        <div className="product">

        <aside className="filter-sidebar">
            <h2>Filtry</h2>

            <div className="Filter">
            <h3>Kategorie</h3>
            <div className="checkbox-filter">
                <label>
                <input type="checkbox" /> Odzież
                </label>
                <label>
                <input type="checkbox" /> Kołowrotki
                </label>
                <label>
                <input type="checkbox" /> Przynęty
                </label>
                <label>
                <input type="checkbox" /> Wędki
                </label>
                <label>
                <input type="checkbox" /> Żyłki
                </label>
                <label>
                <input type="checkbox" /> Haczyki
                </label>
            </div>
            </div>

            <div className="Filter">
            <h3>Cena</h3>
                <div className="Price-input">
                <label>Min (zł) </label>
                <input type="number" id="min-price" />
                </div>

                <div className="Price-input">
                <label>Maks (zł) </label>
                <input type="number" id="max-price"/>
                </div>
            </div>

            <div className="Filter">
            <h3>Firma</h3>
            <div className="checkbox-filter">
                <label>
                <input type="checkbox" /> x
                </label>
                <label>
                <input type="checkbox" /> y
                </label>
                <label>
                <input type="checkbox" /> z
                </label>
                <label>
                <input type="checkbox" /> xd
                </label>
            </div>
            </div>

            <button className="save-button">Zapisz</button>
        </aside>

        <main className="products-container">
            
            <div className="products-grid">
                
            {products.map((product) => (
                <Link to="/SingleProductPage">
                <div className="product-card" key={product.id}>

                <div className="product-image">
                    <img src={product.image} alt={product.Name} />
                </div>

                <div className="product-info">
                    <h2>{product.Brand}</h2>
                    <p className="product-name">{product.Name}</p>
                    <div className="product-price">{product.price.toFixed(2)} zł</div>
                </div>

                </div>
                </Link>
            ))}

            </div>
        </main>
        
        </div>
    );
}

export default ProductPage