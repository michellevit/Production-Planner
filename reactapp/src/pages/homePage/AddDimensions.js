import React, { useState, useEffect } from "react";
import HomeErrorModal from "./HomeErrorModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import "./AddDimensions.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faClose } from "@fortawesome/free-solid-svg-icons";

const AddDimensions = () => {
  const [showHomeErrorModal, setShowHomeErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [dimensions, setDimensions] = useState([]);
  const [packageLength, setPackageLength] = useState("");
  const [packageWidth, setPackageWidth] = useState("");
  const [packageHeight, setPackageHeight] = useState("");
  const [refreshDimensions, setRefreshDimensions] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [currentDimension, setCurrentDimension] = useState("");

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
    console.log("Dimensions: ", dimensions);
    const newDimension = {
      length: parseInt(packageLength),
      width: parseInt(packageWidth),
      height: parseInt(packageHeight),
    };
    console.log("New Dimension: ", newDimension);
    const isDuplicate = dimensions.some(
      (dimension) =>
        dimension.length === newDimension.length &&
        dimension.width === newDimension.width &&
        dimension.height === newDimension.height
    );
    if (isDuplicate) {
      console.log("Duplicate detected!");
      setErrorMessage("Dimension with the same values already exists.");
      setShowHomeErrorModal(true);
      return;
    }
    console.log("Is Duplicate: ", isDuplicate);


    const formattedDimensions = `${packageLength}" x ${packageWidth}" x ${packageHeight}"`;
    setPackageLength("");
    setPackageWidth("");
    setPackageHeight("");
    try {
      await axios.post("http://127.0.0.1:8000/dimensions/", {
        length: packageLength,
        width: packageWidth,
        height: packageHeight,
        package_size: formattedDimensions,
      });
      setRefreshDimensions(true);
    } catch (error) {
      console.error("Error adding dimension", error);
      setErrorMessage("Please add a length, width, and height.");
      setShowHomeErrorModal(true);
    }
  };

  const handleDeleteDimension = async () => {
    try {
      await axios.delete(
        `http://127.0.0.1:8000/dimensions/${currentDimension.id}/`
      );
      setRefreshDimensions(true);
    } catch (error) {
      console.error("Error deleting dimension", error);
    }
  };

  const handleClickDeleteButton = (currentDimension) => {
    setCurrentDimension(currentDimension);
    setShowConfirmDeleteModal(true);
  };
  const handleConfirmDelete = () => {
    setShowConfirmDeleteModal(false);
    handleDeleteDimension(currentDimension.id);
    setCurrentDimension("");
  };
  const handleCancelDelete = () => {
    setShowConfirmDeleteModal(false);
    setCurrentDimension("");
  };

  return (
    <div className="add-dimensions-container">
      <ConfirmDeleteModal
        showConfirmDeleteModal={showConfirmDeleteModal}
        handleConfirmDelete={handleConfirmDelete}
        handleCancelDelete={handleCancelDelete}
        currentDimension={currentDimension}
      />
      <div className="add-dimensions-form"></div>
      <h2>Add Dimensions</h2>
      <HomeErrorModal
        showHomeErrorModal={showHomeErrorModal}
        setShowHomeErrorModal={setShowHomeErrorModal}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
      <form onSubmit={handleSubmitDimensions}>
        <input
          id="length"
          placeholder="length"
          maxLength={7}
          value={packageLength}
          onChange={(event) => setPackageLength(event.target.value)}
        ></input>{" "}
        x
        <input
          id="width"
          placeholder="width"
          maxLength={7}
          value={packageWidth}
          onChange={(event) => setPackageWidth(event.target.value)}
        ></input>{" "}
        x
        <input
          id="height"
          placeholder="height"
          maxLength={7}
          value={packageHeight}
          onChange={(event) => setPackageHeight(event.target.value)}
        ></input>
        <button type="submit" id="submit-dimensions">
          <FontAwesomeIcon icon={faAdd} />
        </button>
      </form>
      <div className="existing-dimensions-table">
        <h2>Submitted Dimensions</h2>
        <table>
          <tbody>
            <tr>
              <td id="package-size-fixed">TBD</td>
            </tr>
            <tr>
              <td id="package-size-fixed">
                9" x 7" x 1" &#40;Padded Envelope&#41;
              </td>
            </tr>
            {dimensions.map((dimension) => (
              <tr key={dimension.id}>
                <td id="package-size">{dimension.package_size}</td>
                <td>
                  <button
                    id="delete"
                    onClick={() => handleClickDeleteButton(dimension)}
                  >
                    <FontAwesomeIcon icon={faClose} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddDimensions;
