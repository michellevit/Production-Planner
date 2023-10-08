import React, { useState } from "react";
import "./AddOrder.css";
import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";

const AddOrder = () => {
  const [shipDate, setShipDate] = useState("");
  return (
    <div className="add-order-container">
      <h2>Add Order</h2>
      <form>
        <table className="add-order-table">
          <tbody>
            <tr>
              <td>Order Number: </td>
              <td>
                <input type="text"></input>
              </td>
            </tr>
            <tr>
              <td>Customer Name</td>
              <td>
                <input type="text"></input>
              </td>
            </tr>
            <tr>
              <td>Ship Date</td>
              <td>
              <DatePicker
                      placeholderText=""
                      selected={shipDate}
                      onChange={(date) => {
                        setShipDate(date);
                      }}
                      isClearable
                      timeZone="Vancouver"
                    />
              </td>
            </tr>
            <tr>
              <td>Items</td>
              <td className="items-row">
              <input type="text" id="add-item"></input>
              <input type="text" id="add-item-qty"></input>
              <button id="add-line-item-button"><FontAwesomeIcon icon={faAdd} /></button>
              </td>
            </tr>
            <tr>
              <td>Notes</td>
              <td>
              <input type="text" id="add-note"></input>
              <button id="add-note-button"><FontAwesomeIcon icon={faAdd} /></button>
              </td>
            </tr>
            <tr>
              <td>Quote</td>
              <td>
              <input type="checkbox" id="add-quote"></input>
              </td>
            </tr>
          </tbody>
        </table>
        <button id="submit-new-order-button">Submit</button>
      </form>
    </div>
  );
};

export default AddOrder;

