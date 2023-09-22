import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox } from "@fortawesome/free-solid-svg-icons";

const ReadyButton = ({ readyHandler }) => {
  return (
    <div className="row6-buttons">
        <button type="button" id="ready" onClick={readyHandler}>
          <FontAwesomeIcon icon={faBox} />
          &nbsp;Ready
        </button>
    </div>
  );
};

export default ReadyButton;
