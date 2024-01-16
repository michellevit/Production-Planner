import "./BoxForm.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect } from "react";
import axios from "axios";

const BoxForm = ({
  formDisplay,
  setFormDisplay,
  setBoxes,
  boxes,
  boxConfirmStatus,
  readyStatus,
  updatePackages,
  setShowErrorModal,
  setErrorMessage,
}) => {
  const [selectDimensionsData, setSelectDimensionsData] = useState([]);
  const [dimensions, setDimensions] = useState("");
  const [weight, setWeight] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchDimensions();
      setSelectDimensionsData(data);
    };

    fetchData();
    if (readyStatus) {
      setFormDisplay(false);
    } else {
      setFormDisplay(true);
    }
  }, [boxConfirmStatus, readyStatus, boxes.length, setFormDisplay]);

  const inputDimensionsHandler = (e) => {
    setDimensions(e.target.value);
  };

  function isPositiveNumberOrFloat(input) {
    const pattern = /^(0\.\d+|[0-9]\d*\.?\d*)$/;
    return pattern.test(input);
  }

  const inputWeightHandler = (e) => {
    const inputValue = e.target.value;
    if (
      inputValue.toLowerCase() === "t" ||
      inputValue.toLowerCase() === "tb" ||
      inputValue.toLowerCase() === "tbd"
    ) {
      setWeight(inputValue.toUpperCase());
    }
    else if (isPositiveNumberOrFloat(inputValue)) {
      setWeight(inputValue);
    }
    else if (inputValue === "") {
      setWeight("");
    }
  };
  const uniqueId = () => {
    const dateString = Date.now().toString(36);
    const randomness = Math.random().toString(36).substring(2);
    return dateString + randomness;
  };

  const submitBoxHandler = (e) => {
    e.preventDefault();
    setFormDisplay(true);

    if (dimensions === "") {
      setErrorMessage("Please enter a package size.");
      setShowErrorModal(true);
      return false;
    }

    if (weight === "") {
      if (dimensions !== "TBD") {
        setErrorMessage("Please enter a package weight.");
        setShowErrorModal(true);
        return false;
      }
    }
    let finalWeight = weight;
    if (weight !== "TBD" && weight !== "") {
      const formattedWeight = parseFloat(weight).toFixed(2);
      finalWeight = parseFloat(formattedWeight);
    }
    const newBox = {
      dimensions: dimensions,
      weight: finalWeight,
      id: uniqueId(),
    };
    setBoxes((prevBoxes) => [...prevBoxes, newBox]);
    updatePackages([...boxes, newBox]);
    setDimensions("");
    setWeight("");
  };

  const fetchDimensions = async () => {
    try {
      const response = await axios.get("${process.env.REACT_APP_BACKEND_URL}/dimensions/");
      return response.data;
    } catch (error) {
      console.error("Error fetching dimensions", error);
      return [];
    }
  };

  return (
    <div className="boxform-container">
      {formDisplay && (
        <form>
          <select
            name="dimensions"
            className="dimensions"
            onChange={inputDimensionsHandler}
            value={dimensions}
            id="mySelect"
          >
            <option hidden>Dimensions</option>
            <option>TBD</option>
            <option>9" x 7" x 1" &#40;Envelope&#41;</option>
            {selectDimensionsData.map((item) => (
              <option key={item.id} value={item.package_size}>
                {item.package_size}
              </option>
            ))}
          </select>
          <input
            type="text"
            className="weight"
            placeholder="lb"
            onChange={inputWeightHandler}
            value={weight}
          ></input>
          <button onClick={submitBoxHandler}>
            <FontAwesomeIcon icon={faAdd} />
          </button>
        </form>
      )}
    </div>
  );
};

export default BoxForm;
