import odziez from '../assets/odziez.jpg';
import kolowrotek from '../assets/kolowrotek.jpg';
import przyneta from '../assets/przyneta.jpg';
import wedka from '../assets/wedka.jpg';
import zylka from '../assets/zylka.jpg';
import haczyk from '../assets/haczyk.jpg';
{/*Sekcja z kategoriami*/}
function Categories() {
  return (
    <section className="categories">
      <h2>Popularne kategorie</h2>
      <div className="category-grid">
        {categories.map((category) => (
          <a key={category.name} href={`/ProductPage?openedCategory=${encodeURIComponent(category.product)}`} className="category">
            <img src={category.image} alt={category.name} width={50} height={50} />
            <span>{category.name}</span>
          </a>
        ))}
      </div>
    </section>
  )
}

//parametr product musi się nazywać tak samo jak Category w bazie danych
const categories = [
  { name: "Odzież", product: "Odzież", image: odziez},
  { name: "Kołowrotki", product: "Kołowrotki", image: kolowrotek},
  { name: "Przynęty", product: "Przynęty", image: przyneta},
  { name: "Wędki", product: "Wędki", image: wedka},
  { name: "Żyłki", prodcut: "Żyłki", image: zylka},
  { name: "Haczyki", product: "Haczyki", image: haczyk},
]

export default Categories

