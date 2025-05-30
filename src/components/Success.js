import "./Success.css";
import { Link } from "react-router-dom";

function Success(){


    return(
<div className="success">
    <p>Dziękujemy za zakupy! </p>
    <p> Twoja zamówienie zostało opłacone i niedługo zostanie wysłane!  </p>
    <Link to="/">
 <button className="back-main">Wróć na stronę główną</button>
</Link>
</div>

    )
}

export default Success;