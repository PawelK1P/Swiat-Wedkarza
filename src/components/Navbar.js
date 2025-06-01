import React, { useState } from 'react';
import icon from '../assets/ikona.png';
import { Link, useNavigate } from 'react-router-dom'; // import komponentu Link i useNavigate (służy do obsługi routingu, dzięki któremu można się przenosić między stronami)
function Navbar() {
  const [searchName, setSearchName] = useState("");
  const navigate = useNavigate();

  const handleEnter = () => {
    navigate(`/ProductPage?searchedItem=${encodeURIComponent(searchName)}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter')
      handleEnter();
  };

  return (
    <header>
      {/*Pierwszy pasek*/}
      <div className="top-bar">
        {/*Logo sklepu*/}
        <Link to="/">
        <div className="logo">
          <span><img src={icon} alt="Fish icon"/></span>
          <div>
            <h1>Świat Wędkarza</h1>
            <p>Z nami złowisz dużą rybę</p>
          </div>
        </div>
        </Link>
      {/*Wyszukiwarka*/}
        <div className="search">
          <input
            type="text"
            onChange={(e) => setSearchName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Wpisz czego szukasz" />
          <Link to={`/ProductPage?searchedItem=${encodeURIComponent(searchName)}`}>
            <button>Szukaj</button>
          </Link>
        </div>

      {/*Nawigacja podstron*/}
      <nav className="user-nav">
          <Link to="/Products">Zarządzanie katalogiem</Link>
          <Link to="/ProductPage">Lista produktów</Link>
          <Link to="/ShoppingCart">
            Koszyk
          </Link>
        <Link to="/Account">Konto</Link>
        </nav>
      </div>
    {/*Nawigacja kategorii*/}
    <nav className="categories-nav">
        <ul>
          {/*lista kategorii*/}
          {categories.map((category) => ( 
            <li key={category.name}> {/*osobna kategoria*/}
              <a href={`/ProductPage?openedCategory=${encodeURIComponent(category.product)}`}>{category.name}</a> {/*załącznik kategorii*/}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
{/*Kategorie*/}
//parametr product musi się nazywać tak samo jak Category w bazie danych
const categories = [
  { name: "Odzież", product: "Odzież"},
  { name: "Kołowrotki", product: "Kołowrotki"},
  { name: "Przynęty", product: "Przynęty"},
  { name: "Wędki", product: "Wędki"},
  { name: "Żyłki", product: "Żyłki"},
  { name: "Haczyki", product: "Haczyki"},
]

export default Navbar

