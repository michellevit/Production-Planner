import React, { useState, useEffect } from "react";
import axios from "axios";
import "./LastUpdate.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare, faCircle } from "@fortawesome/free-solid-svg-icons";

const LastUpdate = () => {
  // States to manage last update data and icon color
  const [lastDate, setLastDate] = useState("Fetching last update...");
  const [weekDay, setWeekDay] = useState(null);
  const [isActive, setIsActive] = useState(true);

  // Days of the week
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  useEffect(() => {
    let eventSource;

    const fetchLastUpdate = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/last-update`);
        if (response.data && response.data.last_updated) {
          formatDate(response.data.last_updated);
        } else {
          setLastDate("No data available");
          setIsActive(false);
        }
      } catch (error) {
        console.error("Failed to fetch last update:", error);
        setLastDate("Fetching last update failed");
        setIsActive(false);
      }
    };

    fetchLastUpdate();

    const connectEventSource = () => {
      eventSource = new EventSource(`${process.env.REACT_APP_BACKEND_URL}/last-update-stream/`);

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        formatDate(data.last_updated);
        checkLastActiveChange(data.last_active);
        if (data.message === "No update in over 5 minutes") {
          setIsActive(false);
        }
      };

      eventSource.onerror = (error) => {
        console.error("EventSource failed:", error);
        eventSource.close();
        setIsActive(false);
        setTimeout(connectEventSource, 120000);
      };

      return eventSource;
    };

    eventSource = connectEventSource();

    const interval = setInterval(checkIfActive, 60000);

    return () => {
      if (eventSource) {
        eventSource.close();
      }
      clearInterval(interval);
    };
  }, []);

  const checkIfActive = () => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/last-update`)
      .then(response => {
        if (response.data && response.data.last_active) {
          checkLastActiveChange(response.data.last_active);
        }
      })
      .catch(error => {
        console.error("Failed to fetch last update:", error);
        setIsActive(false);
      });
  };

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
      setLastDate(formattedDate);
      const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
      setWeekDay(dayOfWeek);
    }
  };

  const checkLastActiveChange = (lastActive) => {
    if (lastActive) {
      const lastActiveDate = new Date(lastActive);
      const currentDateTime = new Date();
      const timeDifference = currentDateTime - lastActiveDate;
      const timeDifferenceMinutes = timeDifference / (1000 * 60);
      setIsActive(timeDifferenceMinutes <= 2);
    }
  };

  const squareStyle = (index) => {
    if (weekDay === "Saturday" || weekDay === "Sunday") {
      return { color: "#b9d2dd" };
    } else if (index === days.indexOf(weekDay)) {
      return { color: "#004596" };
    } else {
      return { color: "#b9d2dd" };
    }
  };

  // Render the component
  return (
    <div className="last-update-container">
      <div className="last-update-message-container">
        <h2>Last Update</h2>
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
          {lastDate ? (
            <>
              {lastDate}{" "}
              <FontAwesomeIcon
                icon={faCircle}
                className="circle-icon"
                style={{ color: isActive ? "green" : "grey" }}
              />
            </>
          ) : (
            "Connection to QuickBooks is closed - no current data."
          )}
        </div>
      </div>
    </div>
  );
};

export default LastUpdate;
