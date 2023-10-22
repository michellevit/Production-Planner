import React, { useState } from "react";
import UnquoteModal from "./UnquoteModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

const QuoteFlag = ({ handleUnquote, order }) => {
  const [showUnquoteModal, setShowUnquoteModal] = useState(false);
  const handleClickUnquoteButton = () => {
    setShowUnquoteModal(true);
  };
  const handleConfirmUnquote = () => {
    setShowUnquoteModal(false);
    handleUnquote(order);
  };
  const handleCancelUnquote = () => {
    setShowUnquoteModal(false);
  };
  return (
    <div>
      <UnquoteModal
        showUnquoteModal={showUnquoteModal}
        handleConfirmUnquote={handleConfirmUnquote}
        handleCancelUnquote={handleCancelUnquote}
        order={order}
      />
      <div style={{ fontSize: "smaller", color: "red" }}>
        *Quote{" "}
        <FontAwesomeIcon
          icon={faRightFromBracket}
          onClick={handleClickUnquoteButton}
          style={{ cursor: "pointer" }}
        />
      </div>
    </div>
  );
};

export default QuoteFlag;
