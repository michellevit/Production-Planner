import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { parseISO } from "date-fns";
import EditShipDateIcon from "./EditShipDateIcon";
import EditShipDateModal from "./EditShipDateModal";
import "./EditShipDateButton.css";

const EditShipDateButton = ({
  order,
  currentDate,
  editShipDate,
  editDelayDate,
  editDelayTBD,
}) => {
  const [showEditShipDateModal, setShowEditShipDateModal] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [nextStep, setNextStep] = useState("");
  const [tbdStatus, setTBDStatus] = useState(false);

  const [shipDateText, setShipDateText] = useState("");
  const [defaultDate, setDefaultDate] = useState(currentDate);

  useEffect(() => {
    console.log("useEffect");
    if (isFading) {
      setShowEditShipDateModal(true);
    } else {
      setShowEditShipDateModal(false);
    }
    handleShipDateText();
    setTBDStatus(order.delay_tbd);
  }, [isFading, order]);

  const handleShipDateText = () => {
    console.log("handleShipDateText");
    let tempDate = "";
    if (
      order.ship_date !== null &&
      order.delay_date === null &&
      order.delay_tbd === false
    ) {
      tempDate = new Date(parseISO(order.ship_date));
      setShipDateText(order.ship_date);
      setDefaultDate(tempDate);
    } else if (order.delay_date !== null && order.delay_tbd === false) {
      setShipDateText("Delayed: " + order.delay_date);
      tempDate = new Date(parseISO(order.delay_date));
      setDefaultDate(tempDate);
    } else if (order.delay_tbd === true) {
      setShipDateText("Delayed: TBD");
      tempDate = new Date();
      setDefaultDate(tempDate);
    }
  };
  const handleClickEditShipDate = (inputDate) => {
    console.log("handleClickEditShipDate");
    setNewDate(inputDate);
    console.log("newDate: ", inputDate);
    setNextStep("callEditShipDateFunction");
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = inputDate.toLocaleDateString(undefined, options);
    console.log("formattedDate: ", formattedDate);
    setModalMessage(
      `Are you sure you want to change the ship date for SO#${order.order_number} to ${formattedDate}?`
    );
    setShowEditShipDateModal(true);
    setIsFading(true);
  };
  const handleClickEditDelayDate = (inputDate) => {
    console.log("handleClickEditDelayDate");
    setNewDate(inputDate);
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = inputDate.toLocaleDateString(undefined, options);
    setModalMessage(
      `Are you sure you want to set the delay date for SO#${order.order_number} to ${formattedDate}?`
    );
    setNextStep("callEditDelayDateFunction");
    setShowEditShipDateModal(true);
    setIsFading(true);
  };
  const handleClickEditTBDStatus = () => {
    console.log("handleClickEditTBDStatus");
    if (!tbdStatus === true) {
      setModalMessage(
        `Are you sure you want to the delay date for SO#${order.order_number} to TBD?`
      );
    } else if (!tbdStatus === false && order.ship_date === null) {
      setModalMessage(
        `Please add a ship date or delay date to remove the TBD status`
      );
    } else if (!tbdStatus === false && order.ship_date !== null) {
      setModalMessage(
        `Are you sure you want to rmeove the TBD status of SO#${order.order_number} and set the ship date to ${order.ship_date}?`
      );
    }

    setTBDStatus(!tbdStatus);
    setNextStep("callEditDelayTBDFunction");
    setShowEditShipDateModal(true);
    setIsFading(true);
  };

  const handleConfirmEditShipDate = () => {
    console.log("handleConfirmEditShipDate");
    setShowEditShipDateModal(false);
    setModalMessage("");
    setIsFading(false);
    console.log("newDate: ", newDate);
    console.log("tbdStatus: ", tbdStatus);
    console.log("Next Step: ", nextStep);
    if (nextStep === "callEditShipDateFunction") {
      editShipDate(order, newDate);
    } else if (nextStep === "callEditDelayDateFunction") {
      editDelayDate(order, newDate);
    } else if (nextStep === "callEditDelayTBDFunction") {
      editDelayTBD(order, tbdStatus);
    }
    setNextStep("");
  };
  const handleCancelEditShipDate = () => {
    setShowEditShipDateModal(false);
    setModalMessage("");
    setIsFading(false);
  };

  return (
    <div>
      <div
        className={
          (order.delay_date === null && order.delay_tbd === false)
            ? ""
            : "red-delay-text"
        }
      >
        {shipDateText}
      </div>
      <div className="edit-ship-date-div">
        Edit Ship Date:
        <DatePicker
          customInput={<EditShipDateIcon />}
          selected={defaultDate}
          onChange={(date) => {
            handleClickEditShipDate(date);
          }}
          timeZone="Vancouver"
        />
      </div>
      {!order.shipped && (
        <div className="edit-ship-date-div">
          Edit Delay Date:
          <DatePicker
            customInput={<EditShipDateIcon />}
            selected={defaultDate}
            onChange={(date) => {
              handleClickEditDelayDate(date);
            }}
            timeZone="Vancouver"
          />
        </div>
      )}
      {!order.shipped && (
        <div className="edit-ship-date-div">
          Delay TBD:
          <input
            type="checkbox"
            id="delay-tbd-checkbox"
            checked={tbdStatus}
            onChange={handleClickEditTBDStatus}
          ></input>
        </div>
      )}
      <EditShipDateModal
        showEditShipDateModal={showEditShipDateModal}
        modalMessage={modalMessage}
        handleConfirmEditShipDate={handleConfirmEditShipDate}
        handleCancelEditShipDate={handleCancelEditShipDate}
      />
    </div>
  );
};

export default EditShipDateButton;
