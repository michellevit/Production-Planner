import React from "react";
import Box from "./Box";

const Order = () => {
  return (
    <div className="order-component">
      <form>
        <div className="column1">
          <p className="order-date">Date</p>
          <p className="order-number">Order Number</p>
        </div>
        <div className="column2">
          <Box />
        </div>
        <div className="column3">
          <button type="button" id="picked-up">
            Picked Up
          </button>
          <button type="button" id="delete">
            Delete
          </button>
        </div>
      </form>
    </div>
  );
};

export default Order;
