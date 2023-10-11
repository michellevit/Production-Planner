import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { parseISO } from "date-fns";
import EditShipDateIcon from "./EditShipDateIcon";
import EditShipDateModal from "./EditShipDateModal";

const EditShipDateButton = ({ order, editShipDate, fadingRows }) => {
  const [showEditShipDateModal, setShowEditShipDateModal] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [newDate, setNewDate] = useState("");
  useEffect(() => {
    if (isFading) {
      setShowEditShipDateModal(true);
    } else {
      setShowEditShipDateModal(false);
    }
  }, [isFading]);
  const handleClickEditShipDate = () => {
    setShowEditShipDateModal(true);
    setIsFading(true);
  };
  const handleConfirmEditShipDate = () => {
    setShowEditShipDateModal(false);
    setIsFading(false);
    editShipDate(order, newDate);
  };
  const handleCancelEditShipDate = () => {
    setShowEditShipDateModal(false);
    setIsFading(false);
  };
  return (
    <div>
      {order.delay_tbd ? "" : order.ship_date}
      {order.delay_tbd ? (
        ""
      ) : (
        <DatePicker
          customInput={<EditShipDateIcon />}
          selected={new Date(parseISO(order.ship_date))}
          onChange={(date) => {
            handleClickEditShipDate();
            setNewDate(date);
          }}
          timeZone="Vancouver"
        />
      )}
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
