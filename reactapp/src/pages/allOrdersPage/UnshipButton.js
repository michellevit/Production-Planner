import React, { useState } from "react";
import "./UnshipButton.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import UnshipModal from "./UnshipModal";

const UnshipButton = ({ order, handleUnship }) => {
  const [showUnshipModal, setShowUnshipModal] = useState(false);
  const handleClickUnshipButton = () => {
    setShowUnshipModal(true);
  };
  const handleConfirmUnship = () => {
    setShowUnshipModal(false);
    handleUnship(order);
  };
  const handleCancelUnship = () => {
    setShowUnshipModal(false);
  };
  return (
    <div id="unship-button-div">
      <button
        id="unship-order-button"
        onClick={handleClickUnshipButton}
        type="button"
      >
        <FontAwesomeIcon icon={faRotateLeft} className="unship-icon"/>
      </button>
      <UnshipModal
        show={showUnshipModal}
        handleConfirmUnship={handleConfirmUnship}
        handleCancelUnship={handleCancelUnship}
        order={order}
      />
    </div>
  );
};

export default UnshipButton;
