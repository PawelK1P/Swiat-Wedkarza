import fishpic from '../assets/placeholder.png';
{/*Sekcja z kategoriami*/}
function Categories() {
  return (
    <section className="categories">
      <h2>Popularne kategorie</h2>
      <div className="category-grid">
        {categories.map((category) => (
          <a key={category.name} href={`/ProductPage?openedCategory=${encodeURIComponent(category.product)}`} className="category">
            <img src={fishpic} alt={category.name} width={50} height={50} />
            <span>{category.name}</span>
          </a>
        ))}
      </div>
    </section>
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

export default Categories

