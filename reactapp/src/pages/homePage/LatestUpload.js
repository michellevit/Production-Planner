import React, { useState, useEffect } from "react";
import axios from "axios";
import "./LatestUpload.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare } from "@fortawesome/free-solid-svg-icons";

const LatestUpload = () => {
  const [lastDate, setLastDate] = useState(null);
  const [lastTime, setLastTime] = useState(null);
  const [weekDay, setWeekDay] = useState(null);

  useEffect(() => {
    fetchLastUpdate();
  }, []);

  const fetchLastUpdate = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/last-update/");
      const formatted_date = response.data.last_updated;
      formatDate(formatted_date);
    } catch (error) {
      console.error("Error fetching last update:", error);
    }
  };

  const formatDate = (formatted_date) => {
    const date = new Date(formatted_date);
    const options = { weekday: "long", month: "long", day: "numeric" };
    const timeOptions = { hour: "numeric", minute: "2-digit", hour12: true };
    const datePart = date.toLocaleDateString("en-US", options);
    const timePart = date.toLocaleTimeString("en-US", timeOptions);
    const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
    setLastDate(datePart);
    setLastTime(timePart);
    setWeekDay(dayOfWeek);
  };

  const renderDayOfWeekIcons = () => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const currentIndex = days.indexOf(weekDay);
      return days.map((day, index) => (
      <FontAwesomeIcon
        key={index}
        icon={faSquare}
        style={{
          color: currentIndex === index ? "black" : "grey",
          margin: "5px",
        }}
      />
    ));
  };

  return (
    <div className="latest-upload-container">
      <div className="latest-upload-message-container">
        <h2>Most Recent Update</h2>
        <div className="upload-data">
        <div className="day-of-week-icons">
            {weekDay === "Saturday" || weekDay === "Sunday" ? (
              <FontAwesomeIcon key="weekend" icon={faSquare} style={{ color: "grey" }} />
            ) : (
              renderDayOfWeekIcons()
            )}
          </div>
            {!lastDate ? (
              "No data has been fetched from QuickBooks yet."
            ) : (
              <>
                {lastDate}
                <br />
                <b>{lastTime}</b>
              </>
            )}
        </div>
      </div>
    </div>
  );
};

export default LatestUpload;
