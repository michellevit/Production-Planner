import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesUp, faAnglesDown } from "@fortawesome/free-solid-svg-icons";
import "./MinimizeCardButton.css";

const MinimizeCardButton = ( {minimized, setMinimized}) => {
  const toggleIcon = () => {
    setMinimized(!minimized);
  };
  return (
    <div>
        <button className="minButton" onClick={toggleIcon}>
          <FontAwesomeIcon icon={minimized ? faAnglesDown : faAnglesUp} />
        </button>
    </div>
  );
};

export default MinimizeCardButton;
