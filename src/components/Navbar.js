import React, { useState } from 'react';
import icon from '../assets/ikona.png';
import { Link } from 'react-router-dom'; // import komponentu Link (służy do obsługi routingu, dzięki któremu można się przenosić między stronami)
function Navbar() {
  const [showOptions, setShowOptions] = useState(false); // Stan do zarządzania widocznością opcji

  const handleMouseEnter = () => {
    setShowOptions(true);
  };

  const handleMouseLeave = () => {
    setShowOptions(false);
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
          <input type="text" placeholder="Wpisz czego szukasz" />
          <button>Szukaj</button>
        </div>

      {/*Nawigacja podstron*/}
      <nav className="user-nav">
          <a href="#">Pomoc</a>
          <a href="#">Kontakt </a>
          <Link to="/ShoppingCart">
            Koszyk
          </Link>


          {/* Konto z rozwijanym menu */}
          <div 
            onMouseEnter={handleMouseEnter} 
            onMouseLeave={handleMouseLeave}
            style={{ position: 'relative' }} // Umożliwia pozycjonowanie selecta
          >
            <Link to="/Account">Konto</Link>
          </div>
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
  { name: "Odzież", product: "Ubrania"},
  { name: "Kołowrotki", product: "Kołowrotka"},
  { name: "Przynęty", product: "Przynęta"},
  { name: "Wędki", product: "Wędka"},
  { name: "Żyłki", prodcut: "Żyłka"},
  { name: "Haczyki", product: "Haczyk"},
]

export default Navbar

