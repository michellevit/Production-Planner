import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruckFast } from "@fortawesome/free-solid-svg-icons";

const ShippedButton = () => {
  return (
    <div className="row7-buttons">
      <button type="button" id="shipped">
        <FontAwesomeIcon icon={faTruckFast} />
        &nbsp;Shipped
      </button>
    </div>
  );
};

export default ShippedButton;
