import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox, faStar } from "@fortawesome/free-solid-svg-icons";

const ReadyButton = ({ readyHandler, order }) => {
  return (
    <div className="row6-buttons">
        <button type="button" id="ready" onClick={readyHandler}>
          {order.quote ? <FontAwesomeIcon icon={faStar} /> : <FontAwesomeIcon icon={faBox} />}
          &nbsp;{order.quote ? "Quoted" : "Ready"}
        </button>
    </div>
  );
};

export default ReadyButton;
