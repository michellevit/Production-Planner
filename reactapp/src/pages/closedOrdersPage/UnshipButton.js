import React, { useState } from "react";
import "./UnshipButton.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import UnshipModal from "./UnshipModal";

const UnshipButton = ({
  order,
  handleUnship,
}) => {
  const [showUnshipModal, setShowUnshipModal] = useState(false);
  const handleClickUnshipButton = () => {
    setShowUnshipModal(true);
  };
  const handleConfirmUnship = () => {
    setShowUnshipModal(false);
    handleUnship(order.id);
  };
  const handleCancelUnship = () => {
    setShowUnshipModal(false);
  };
  return (
    <div>
      Yes
      <button 
      id="unship-order-button" 
      onClick={handleClickUnshipButton}
      type="button"
      >
        <FontAwesomeIcon icon={faRotateLeft} />
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
