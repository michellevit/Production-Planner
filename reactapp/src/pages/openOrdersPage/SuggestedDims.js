import axios from "axios";
import React from "react";
import "./SuggestedDims.css";

const SuggestedDims = ({ suggestedBoxes, setBoxes, setMatchingDims, order }) => {
  const handleSetSuggestedDims = async () => {
    setMatchingDims(false);
    setBoxes(suggestedBoxes);
    const updatedOrder = { ...order, packages_array: suggestedBoxes };
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/open-orders/${order.id}/`,
        updatedOrder
      );
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };
  const handleRemoveSuggestedDims = async () => {
    setMatchingDims(false);
    const updatedOrder = { ...order, packages_array: "TBD" };
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/open-orders/${order.id}/`,
        updatedOrder
      );
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };
  return (
    <div className="suggested-dims-container">
      <h3>Suggested Dimensions</h3>
      <table>
        <tbody>
      {suggestedBoxes.map((item, index) => (
        <tr className="suggested-dims-line-item" key={index}>
          <td style={{ fontWeight: 'bold' }}>Box {index + 1}: </td>
          <td>{item.dimensions} - </td>
          <td>{item.weight} lb</td>
        </tr>
      ))}
      </tbody>
      </table>
      <div className="suggested-dims-button-container">
      <button
        type="button"
        id="suggestedDimsYes"
        onClick={handleSetSuggestedDims}
      >
        Use
      </button>
      <button
        type="button"
        id="suggestedDimsNo"
        onClick={handleRemoveSuggestedDims}
      >
        Discard
      </button>
      </div>
    </div>
  );
};

export default SuggestedDims;
