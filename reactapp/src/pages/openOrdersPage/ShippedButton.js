import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruckFast } from "@fortawesome/free-solid-svg-icons";

const ShippedButton = ({ shippedHandler }) => {
  return (
    <div className="row6-buttons">
      <button type="button" id="shipped" onClick={shippedHandler}>
        <FontAwesomeIcon icon={faTruckFast} />
        &nbsp;Shipped
      </button>
    </div>
  );
};

export default ShippedButton;


