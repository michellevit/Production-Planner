import axios from "axios";
import React from "react";
import "./SuggestedDims.css";

const SuggestedDims = ({ suggestedBoxes, setBoxes, setMatchingDims, order }) => {
  const handleSetSuggestedDims = () => {
    setMatchingDims(false);
    setBoxes(suggestedBoxes);
  };
  const handleRemoveSuggestedDims = async () => {
    setMatchingDims(false);
    const updatedOrder = order;
    updatedOrder.item_type_dict_hash = "0";
    try {
      await axios.put(
        `http://127.0.0.1:8000/open-orders/${order.id}/`,
        updatedOrder
      );
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };
  return (
    <div className="suggested-dims-container">
      <h3>Suggested Dimensions</h3>
      {suggestedBoxes.map((item, index) => (
        <tr className="suggested-dims-line-item" key={index}>
          <td style="font-weight: bold;">Box {index + 1}: </td>
          <td>{item.dimensions} - </td>
          <td>{item.weight}</td>
        </tr>
      ))}
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
