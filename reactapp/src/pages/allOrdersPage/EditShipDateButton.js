import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { parseISO } from "date-fns";
import EditShipDateIcon from "./EditShipDateIcon";
import EditShipDateModal from "./EditShipDateModal";
import ErrorModal from "../../components/ErrorModal";

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
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
 
 
  useEffect(() => {
    if (isFading) {
      setShowEditShipDateModal(true);
    } else {
      setShowEditShipDateModal(false);
    }
    handleShipDateText();
    setTBDStatus(order.delay_tbd);
  }, [isFading, order]);

  function formatDate(inputDate) {
    const options = { day: "numeric", month: "short", year: "numeric" };
    const formattedDate = new Date(inputDate).toLocaleDateString("en-US", options);
    return formattedDate;
  }


  const handleShipDateText = () => {
    let tempDate = "";
    if (
      order.ship_date !== null &&
      order.delay_date === null &&
      order.delay_tbd === false
    ) {
      tempDate = new Date(parseISO(order.ship_date));
      const formattedDate = formatDate(tempDate);
      setShipDateText(formattedDate);
      setDefaultDate(tempDate);
    } else if (order.delay_date !== null && order.delay_tbd === false) {
      const formattedDate = formatDate(new Date(parseISO(order.delay_date)));
      setShipDateText(formattedDate);
      tempDate = new Date(parseISO(order.delay_date));
      setDefaultDate(tempDate);
    } else if (order.delay_tbd === true) {
      setShipDateText("TBD");
      tempDate = new Date();
      setDefaultDate(tempDate);
    }
  };


  const handleClickEditShipDate = (inputDate) => {
    setNewDate(inputDate);
    setNextStep("callEditShipDateFunction");
    const formattedDate = formatDate(inputDate);
    setModalMessage(
      `Are you sure you want to change the ship date for SO#${order.order_number} to ${formattedDate}?`
    );
    setShowEditShipDateModal(true);
    setIsFading(true);
  };


  const handleClickEditDelayDate = (inputDate) => {
    setNewDate(inputDate);
    const formattedDate = formatDate(inputDate)
    setModalMessage(
      `Are you sure you want to set the delay date for SO#${order.order_number} to ${formattedDate}?`
    );
    setNextStep("callEditDelayDateFunction");
    setShowEditShipDateModal(true);
    setIsFading(true);
  };


  const handleClickEditTBDStatus = () => {
    const tempTBDStatus = !tbdStatus;
    if (tempTBDStatus === true) {
      setModalMessage(
        `Are you sure you want to set the date for SO#${order.order_number} to TBD?`
      );
      setNextStep("callEditDelayTBDFunction");
      setIsFading(true);
      setShowEditShipDateModal(true);
    } else if (tempTBDStatus === false && order.ship_date === null) {
      setErrorMessage(
        `Please add a ship date or delay date to remove the TBD status`
      );
      setShowErrorModal(true);
    } else if (tempTBDStatus === false && order.ship_date !== null) {
      const formattedDate = formatDate(order.ship_date)
      setModalMessage(
        `Are you sure you want to remove the TBD status of SO#${order.order_number} and set the ship date to ${formattedDate}?`
      );
      setNextStep("callEditDelayTBDFunction");
      setIsFading(true);
      setShowEditShipDateModal(true);
    }
  };

  const handleConfirmEditShipDate = () => {
    setShowEditShipDateModal(false);
    setModalMessage("");
    setIsFading(false);
    if (nextStep === "callEditShipDateFunction") {
      editShipDate(order, newDate);
    } else if (nextStep === "callEditDelayDateFunction") {
      editDelayDate(order, newDate);
    } else if (nextStep === "callEditDelayTBDFunction") {
      editDelayTBD(order, !tbdStatus);
    }
    setNextStep("");
  };


  const handleCancelEditShipDate = () => {
    setShowEditShipDateModal(false);
    setModalMessage("");
    setNextStep("");
    setIsFading(false);
  };


  return (
    <div>
      <div
        className={
          order.delay_date === null && order.delay_tbd === false
            ? ""
            : "red-delay-date-text"
        }
      >
        {shipDateText}
        <div
          className={
            order.delay_date === null && order.delay_tbd === false
              ? ""
              : "red-delay-text"
          }
        >
          {order.delay_date !== null && "(Delayed)"}
        </div>
      </div>
      <div className="edit-ship-date-div">
        Ship Date
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
          Delay Date
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
          Delay TBD
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
      <ErrorModal
        showErrorModal={showErrorModal}
        setShowErrorModal={setShowErrorModal}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};

export default EditShipDateButton;
