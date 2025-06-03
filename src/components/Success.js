import "./Success.css";
import { Link, useLocation} from "react-router-dom";

function Success(){

    const location = useLocation(); 
    const {purchasedItems} = location.state;

    return(
<div className="success">
    <p>Dziękujemy za zakupy! </p>
    <p> Twoja zamówienie zostało opłacone i niedługo zostanie wysłane!  </p>
    <Link to="/">
 <button className="back-main">Wróć na stronę główną</button>
</Link>
 <h3>Zakupione produkty:</h3>
 <div className="success-summary">
      <ul>
        {purchasedItems.map((item) => (
          <li key={item.id}>
              {item.Name} - {item.price.toFixed(2)} zł ({item.quantity} sztuk)
          </li>
        ))}
      </ul>
      </div>
</div>

    )
}

export default Success;
