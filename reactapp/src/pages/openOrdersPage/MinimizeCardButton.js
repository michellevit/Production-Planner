import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesUp, faAnglesDown } from "@fortawesome/free-solid-svg-icons";

const MinimizeCardButton = ({ minimized, toggleMinimize }) => {
  return (
    <div>
        <button id="minmax-button" onClick={toggleMinimize}>
          <FontAwesomeIcon icon={minimized ? faAnglesDown : faAnglesUp} />
        </button>
    </div>
  );
};

export default MinimizeCardButton;
