import React, { forwardRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

const EditShipDateIcon = forwardRef((props, ref) => (
  <div ref={ref} className="custom-date-picker-input" {...props}>
    <FontAwesomeIcon icon={faEdit} />
  </div>
));

export default EditShipDateIcon;