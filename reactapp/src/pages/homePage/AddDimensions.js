import React, { useState, useEffect } from "react";
import HomeErrorModal from "./HomeErrorModal";
import "./AddDimensions.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faArrowUp,
  faArrowDown,
  faClose,
} from "@fortawesome/free-solid-svg-icons";

const AddDimensions = () => {
  const [showHomeErrorModal, setShowHomeErrorModal] = useState(false);
  const [fileExtension, setFileExtension] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [dimensions, setDimensions] = useState([]);
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [refreshDimensions, setRefreshDimensions] = useState(false);

  useEffect(() => {
    const fetchDimensions = () => {
      axios
        .get("http://127.0.0.1:8000/dimensions/")
        .then((response) => {
          setDimensions(response.data);
        })
        .catch((error) => {
          console.error("Error getting data", error);
        });
    };
    fetchDimensions();
    if (refreshDimensions) {
      setRefreshDimensions(false);
    }
  }, [refreshDimensions]);

  const handleSubmitDimensions = async (event) => {
    event.preventDefault();
    const formattedDimensions = `${length} x ${width} x ${height}`;
    console.log(formattedDimensions);
    setLength("");
    setWidth("");
    setHeight("");
    try {
      await axios.post("http://127.0.0.1:8000/dimensions/", {
        package_size: formattedDimensions,
      });
      setRefreshDimensions(true);
    } catch (error) {
      console.error("Error adding dimension", error);
      setErrorMessage("There was an error submitting your dimensions.");
      setShowHomeErrorModal(true);
    }
  };
  const handleLengthChange = (event) => {
    let inputValue = event.target.value;
    inputValue = inputValue.replace(/["'a-zA-Z]+/g, "");
    inputValue = `${inputValue}"`;
    setLength(inputValue);
  };
  const handleWidthChange = (event) => {
    let inputValue = event.target.value;
    inputValue = inputValue.replace(/["'a-zA-Z]+/g, "");
    inputValue = `${inputValue}"`;
    setWidth(inputValue);
  };
  const handleHeightChange = (event) => {
    let inputValue = event.target.value;
    inputValue = inputValue.replace(/["'a-zA-Z]+/g, "");
    inputValue = `${inputValue}"`;
    setHeight(inputValue);
  };
  const handleMoveUp = async (dimensionId) => {
    const dimensionIndex = dimensions.findIndex(
      (dimension) => dimension.id === dimensionId
    );
    if (dimensionIndex > 0) {
      const updatedDimensions = [...dimensions];
      const dimensionToMove = updatedDimensions[dimensionIndex];
      const dimensionToReplace = updatedDimensions[dimensionIndex - 1];
      [dimensionToMove.index_position, dimensionToReplace.index_position] = [
        dimensionToReplace.index_position,
        dimensionToMove.index_position,
      ];
      dimensionToMove.index_position = -1;

      try {
        await axios.put(
          `http://127.0.0.1:8000/dimensions/${dimensionToMove.id}/`,
          {
            index_position: dimensionToMove.index_position,
          }
        );

        await axios.put(
          `http://127.0.0.1:8000/dimensions/${dimensionToReplace.id}/`,
          {
            index_position: dimensionToReplace.index_position,
          }
        );
        setDimensions(updatedDimensions);
        setRefreshDimensions(true);
      } catch (error) {
        console.error("Error moving dimension up", error);
      }
    }
  };
  const handleMoveDown = async (dimensionId) => {
    const dimensionIndex = dimensions.findIndex(
      (dimension) => dimension.id === dimensionId
    );

    if (dimensionIndex < dimensions.length - 1) {
      const updatedDimensions = [...dimensions];
      const dimensionToMove = updatedDimensions[dimensionIndex];
      const dimensionToReplace = updatedDimensions[dimensionIndex + 1];
      [dimensionToMove.index_position, dimensionToReplace.index_position] = [
        dimensionToReplace.index_position,
        dimensionToMove.index_position,
      ];
      dimensionToMove.index_position = -1;
      try {
        await axios.put(
          `http://127.0.0.1:8000/dimensions/${dimensionToMove.id}/`,
          {
            index_position: dimensionToMove.index_position,
          }
        );

        await axios.put(
          `http://127.0.0.1:8000/dimensions/${dimensionToReplace.id}/`,
          {
            index_position: dimensionToReplace.index_position,
          }
        );
        setDimensions(updatedDimensions);
        setRefreshDimensions(true);
      } catch (error) {
        console.error("Error moving dimension down", error);
      }
    }
  };
  const handleDelete = async (dimensionId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/dimensions/${dimensionId}/`);
      const updatedDimensions = dimensions.filter(
        (dimension) => dimension.id !== dimensionId
      );
      updatedDimensions.forEach((dimension, index) => {
        dimension.index_position = index + 1;
      });
      await Promise.all(
        updatedDimensions.map((dimension) =>
          axios.put(`http://127.0.0.1:8000/dimensions/${dimension.id}/`, {
            index_position: dimension.index_position,
          })
        )
      );
      setDimensions(updatedDimensions);
      setRefreshDimensions(true);
    } catch (error) {
      console.error("Error deleting dimension", error);
    }
  };

  return (
    <div className="add-dimensions-container">
      <div className="add-dimensions-form"></div>
      <h2>Add Dimensions</h2>
      <HomeErrorModal
        showHomeErrorModal={showHomeErrorModal}
        setShowHomeErrorModal={setShowHomeErrorModal}
        setFileExtension={setFileExtension}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
      <form onSubmit={handleSubmitDimensions}>
        <input
          id="length"
          placeholder="length"
          maxLength={7}
          value={length}
          onChange={handleLengthChange}
        ></input>{" "}
        x
        <input
          id="width"
          placeholder="width"
          maxLength={7}
          value={width}
          onChange={handleWidthChange}
        ></input>{" "}
        x
        <input
          id="height"
          placeholder="height"
          maxLength={7}
          value={height}
          onChange={handleHeightChange}
        ></input>
        <button type="submit">
          <FontAwesomeIcon icon={faAdd} />
        </button>
      </form>
      <div className="existing-dimensions-table">
        <h2>Submitted Dimensions</h2>
        {dimensions.length === 0 ? (
          <p className="no-dimensions-message">
            No dimensions have been entered.
          </p>
        ) : (
          <table>
            <tbody>
              {dimensions.map((dimension) => (
                <tr key={dimension.id}>
                  <td id="package-size">{dimension.package_size}</td>
                  <td>
                    <button id="move-up" onClick={() => handleMoveUp(dimension.id)}>
                      <FontAwesomeIcon icon={faArrowUp} />
                    </button>
                    <button id="move-down" onClick={() => handleMoveDown(dimension.id)}>
                      <FontAwesomeIcon icon={faArrowDown} />
                    </button>
                    <button id="delete" onClick={() => handleDelete(dimension.id)}>
                      <FontAwesomeIcon icon={faClose} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AddDimensions;
