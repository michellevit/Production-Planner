import React, { useState, useEffect } from "react";
import "./LatestUpload.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare } from "@fortawesome/free-solid-svg-icons";

const LatestUpload = () => {
  const [lastDate, setLastDate] = useState(null);
  const [weekDay, setWeekDay] = useState(null);
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const [eventSource, setEventSource] = useState(null);

  const connectEventSource = () => {
    const newEventSource = new EventSource("http://localhost:8000/latest-upload-stream/");
    newEventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      formatDate(data.last_updated);
    };

    newEventSource.onerror = (error) => {
      console.error("EventSource failed:", error);
      newEventSource.close();
      // Retry connection after 120 seconds
      setTimeout(() => connectEventSource(), 120000);
    };
    setEventSource(newEventSource);
  };
  useEffect(() => {
    connectEventSource();
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  const formatDate = (formatted_date) => {
    if (formatted_date) {
      const date = new Date(formatted_date);
      const options = {
        timeZone: "America/Vancouver",
        weekday: "long",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true, 
      };
      const formattedDate = date.toLocaleDateString("en-US", options);
      setLastDate(formattedDate)
      const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
      setWeekDay(dayOfWeek);
    }
  };

  const renderDayOfWeekIcons = () => {
    const squareStyle = (index) => {
      if (weekDay === "Saturday" || weekDay === "Sunday") {
        return { color: "#b9d2dd" };
      } else if (index === days.indexOf(weekDay)) {
        return { color: "#004596" };
      } else {
        return { color: "#b9d2dd" };
      }
    };

    return (
      <div className="latest-upload-container">
        <div className="latest-upload-message-container">
          <h2>Most Recent Update</h2>
          <div className="upload-data">
            <div className="day-of-week-icons">
              {days.map((day, index) => (
                <FontAwesomeIcon
                  key={index}
                  icon={faSquare}
                  style={{
                    ...squareStyle(index),
                    margin: "5px",
                  }}
                />
              ))}
            </div>
            {!lastDate ? (
              "No data has been fetched from QuickBooks yet."
            ) : (
              <>
                {lastDate}
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="latest-upload-container">
      {renderDayOfWeekIcons()}
    </div>
  );
};

export default LatestUpload;
