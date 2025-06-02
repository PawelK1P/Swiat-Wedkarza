import "./ProductPage.css";
import { Link, useSearchParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useCart } from "./CartContext";
import fishpic from '../assets/placeholder.png';

function ProductPage() {
  // Pobranie parametrów 
  const [searchParams] = useSearchParams();
  const openedCategory = searchParams.get('openedCategory') || "";
  const searchedItem = searchParams.get('searchedItem') || "";
// Stany 
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const { addToCart } = useCart(); // Funkcja dodająca produkt do koszyka

  // Pobranie danych z bazy firebase
  useEffect(() => {
    async function fetchData() {
      const querySnapshot = await getDocs(collection(db, 'Products')); // Pobranie wszystkich produktów z Firebase
      const productList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productList); // Ustawienie produktów
      setFilteredProducts(productList); // Domyślnie wszystkie produkty widoczne

      // Filtrowanie na podstawie kategorii z URL
      if (openedCategory) {
        setSelectedCategories([openedCategory]);
        setFilteredProducts(productList.filter(p => p.Category === openedCategory));
      }
      // Filtrowanie na podstawie wyszukiwanej frazy
      if (searchedItem) {
        setFilteredProducts(productList.filter(p => p.Name.toLowerCase() === searchedItem.toLowerCase()));
      }
    }
    fetchData();
  }, [openedCategory, searchedItem]);

   // Obsługa zmian wyboru marek
  const handleBrandChange = (e) => {
    const brand = e.target.value;
    if (e.target.checked) {
      setSelectedBrands([...selectedBrands, brand]); // Dodanie marki do listy
    } else {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    }
  };
// Obsługa zmian wyboru kategorii
  const handleCategoryChange = (e) => {
    const category = e.target.value;
    if (e.target.checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    }
  };

  // Zastosowanie filtrów
  const applyFilters = () => {
    let filtered = [...products];

    // Filtr po marce
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(product => selectedBrands.includes(product.Brand));
    }
    // Filtr po kategorii
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => selectedCategories.includes(product.Category));
    }
    if (minPrice) {
      filtered = filtered.filter(product => product.price >= Number.parseFloat(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter(product => product.price <= Number.parseFloat(maxPrice));
    }

    setFilteredProducts(filtered); // Zaktualizowanie widocznych produktów
  };

  // Unikalne marki i kategorie do wyświetlenia jako filtry
  const brands = [...new Set(products.map(product => product.Brand))];
  const categories = [...new Set(products.map(product => product.Category))];

  return (
    <div className="product">

      <aside className="filter-sidebar">
        <h2>Filtry</h2>

        <div className="Filter">
          <h3>Kategorie</h3>
          <div className="checkbox-filter">
            {categories.map(category => (
              <label key={category}>
                <input
                  type="checkbox"
                  value={category}
                  checked={selectedCategories.includes(category)}
                  onChange={handleCategoryChange}
                />
                {category}
              </label>
            ))}
          </div>
        </div>

        <div className="Filter">
          <h3>Cena</h3>
          <div className="Price">
            <label>Min (zł) </label>
            <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
          </div>
          <div className="Price">
            <label>Maks (zł) </label>
            <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
          </div>
        </div>

        <div className="Filter">
          <h3>Firma</h3>
          <div className="checkbox-filter">
            {brands.map(brand => (
              <label key={brand}>
                <input type="checkbox" value={brand} checked={selectedBrands.includes(brand)} onChange={handleBrandChange} />
                {brand}
              </label>
            ))}
          </div>
        </div>

        <button className="button" onClick={applyFilters}>Zapisz</button>
      </aside>

      <main className="products-container">
        <div className="products-grid">
          {filteredProducts.map(product => (
            <div className="product-card" key={product.id}>
              <Link to={`/SingleProductPage/${product.id}`}>
                <div className="product-image">
                  <img src={product.imageURL} alt={product.Name} />
                </div>

                <div className="product-info">
                  <h2>{product.Brand}</h2>
                  <p className="product-name">{product.Name}</p>
                  <div className="product-price">{product.price.toFixed(2)} zł</div>
                  <p className="product-amount">Ilość sztuk: {product.amount}</p>
                </div>
              </Link>

              <div className="Cart">
                <button className="button" onClick={() => addToCart(product)}>Dodaj do koszyka</button>
              </div>
            </div>
          ))}
        </div>
      </main>

    </div>
  );
}

export default ProductPage;