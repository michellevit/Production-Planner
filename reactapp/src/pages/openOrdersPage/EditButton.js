import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

const EditButton = ({ editHandler }) => {
  return (
    <div className="row6-buttons">
        <button type="button" id="edit" onClick={editHandler}>
          <FontAwesomeIcon icon={faEdit} />
          &nbsp;Edit
        </button>
      </div>
  );
};

export default EditButton;