import "./SingleProductPage.css"
import fishpic from '../assets/placeholder.png';


 function SingleProductPage() {

  return (
<div className="SingleProduct">

<div className="ProductImage">
<img src={fishpic} alt="ProductImage"/>
</div>

    <div className="ProductInfo">
<span className="ProductName">Super wędka</span>
<span className="ProductBrand">Super firma</span>
<span className="ProductPrice">129.99 zł</span>
<button className="AddToCart">Dodaj do koszyka</button>
    </div>

    <div className="ExtendedInfo">

    <div className="ProductDescription">
        Opis
    </div>

    <div className="Specification">
    Specyfikacja
    </div>
    </div>

</div>
  )
}

export default SingleProductPage
