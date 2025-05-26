function Footer() {
  {/*Sekcja footer*/}
  return (
    <footer>
      <div className="footer-content">
        <section className="footer-section">
          <h3>Świat Wędkarza</h3>
          <p>Najlepszy sklep wędkarski z szerokim asortymentem sprzętu dla początkujących i profesjonalistów.</p>
          <div className="social">
            <a href="#">Facebook </a>
            <a href="#">Instagram </a>
            <a href="#">YouTube </a>
          </div>
        </section>

        <section className="footer-section">
          <h3>Kategorie</h3>
          <ul>
            {categories.map((category) => (
              <li key={category.name}>
                <a href={`/ProductPage?openedCategory=${encodeURIComponent(category.product)}`}>{category.name}</a>
              </li>
            ))}
          </ul>
        </section>

        <section className="footer-section">
          <h3>Pomoc</h3>
          <ul>
            {helpLinks.map((link) => (
              <li key={link}>
                <a href="#">{link}</a>
              </li>
            ))}
          </ul>
        </section>

        <section className="footer-section">
          <h3>Kontakt</h3>
          <p>Email: kontakt@swiatwedkarza.pl</p>
          <p>Telefon: +48 123 456 789</p>
        </section>
      </div>

      <div className="copyright">
        <p>{new Date().getFullYear()} Świat Wędkarza. Wszystkie prawa zastrzeżone.</p>
      </div>
    </footer>
  )
}

//parametr product musi się nazywać tak samo jak Category w bazie danych
const categories = [
  { name: "Odzież", product: "Ubrania"},
  { name: "Kołowrotki", product: "Kołowrotka"},
  { name: "Przynęty", product: "Przynęta"},
  { name: "Wędki", product: "Wędka"},
  { name: "Żyłki", prodcut: "Żyłka"},
  { name: "Haczyki", product: "Haczyk"},
]

const helpLinks=["Dostawa i płatność","Zwroty i reklamacje","Regulamin","Polityka prywatności","FAQ"]

export default Footer

