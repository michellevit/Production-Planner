import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { parseISO } from "date-fns";
import EditShipDateIcon from "./EditShipDateIcon";
import EditShipDateModal from "./EditShipDateModal";

const EditShipDateButton = ({ order, editShipDate }) => {
  const [showEditShipDateModal, setShowEditShipDateModal] = useState(false);
  const [newDate, setNewDate] = useState("");
  const handleClickEditShipDate = () => {
    setShowEditShipDateModal(true);
  };
  const handleConfirmEditShipDate = () => {
    setShowEditShipDateModal(false);
    editShipDate(order, newDate);
  };
  const handleCancelEditShipDate = () => {
    setShowEditShipDateModal(false);
  };
  return (
    <div>
      {order.ship_date}
      <DatePicker
        customInput={<EditShipDateIcon />}
        selected={new Date(parseISO(order.ship_date))}
        onChange={(date) => {
            handleClickEditShipDate();
            setNewDate(date);
          }}
        timeZone="Vancouver"
      />
      <EditShipDateModal
        show={showEditShipDateModal}
        handleConfirmEditShipDate={handleConfirmEditShipDate}
        handleCancelEditShipDate={handleCancelEditShipDate}
        order={order}
      />
    </div>
  );
};

export default EditShipDateButton;
