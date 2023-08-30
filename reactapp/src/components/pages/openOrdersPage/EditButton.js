import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

const EditButton = ({ readyHandler }) => {
  return (
    <div className="row7-buttons">
        <button type="button" id="edit" onClick={readyHandler}>
          <FontAwesomeIcon icon={faEdit} />
          &nbsp;Edit
        </button>
      </div>
  );
};

export default EditButton;