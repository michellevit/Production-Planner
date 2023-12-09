import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesUp, faAnglesDown } from "@fortawesome/free-solid-svg-icons";
import "./MinimizeCardButton.css";

const MinimizeCardButton = ({ minimized, toggleMinimize }) => {
  return (
    <div>
        <button className="minButton" onClick={toggleMinimize}>
          <FontAwesomeIcon icon={minimized ? faAnglesDown : faAnglesUp} />
        </button>
    </div>
  );
};

export default MinimizeCardButton;
