import React, { useState, useEffect } from "react";
import ErrorModal from "../../components/ErrorModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import "./AddDimensions.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faClose } from "@fortawesome/free-solid-svg-icons";

const AddDimensions = () => {
  const [showErrorModal, setShowErrorModal] = useState(false);
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
        .get(`${process.env.REACT_APP_BACKEND_URL}/dimensions/`)
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
    const roundedLength = parseFloat(parseFloat(packageLength).toFixed(3));
    const roundedWidth = parseFloat(parseFloat(packageWidth).toFixed(3));
    const roundedHeight = parseFloat(parseFloat(packageHeight).toFixed(3));

    const newDimension = {
      length: roundedLength,
      width: roundedWidth,
      height: roundedHeight,
    };
    const isDuplicate = dimensions.some(
      (dimension) =>
        dimension.length === newDimension.length &&
        dimension.width === newDimension.width &&
        dimension.height === newDimension.height
    );
    if (isDuplicate) {
      setErrorMessage("Dimension with the same values already exists.");
      setShowErrorModal(true);
      return;
    }

    const formattedDimensions = `${roundedLength}" x ${roundedWidth}" x ${roundedHeight}"`;
    setPackageLength("");
    setPackageWidth("");
    setPackageHeight("");
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/dimensions/`, {
        length: parseFloat(roundedLength),
        width: parseFloat(roundedWidth),
        height: parseFloat(roundedHeight),
        package_size: formattedDimensions,
      });
      setRefreshDimensions(true);
    } catch (error) {
      console.error("Error adding dimension", error);
      setErrorMessage("Please add a length, width, and height.");
      setShowErrorModal(true);
    }
  };

  const handleDeleteDimension = async () => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/dimensions/${currentDimension.id}/`
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
      <ErrorModal
        showErrorModal={showErrorModal}
        setShowErrorModal={setShowErrorModal}
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
          autoComplete="off"
        ></input>{" "}
        x
        <input
          id="width"
          placeholder="width"
          maxLength={7}
          value={packageWidth}
          onChange={(event) => setPackageWidth(event.target.value)}
          autoComplete="off"
        ></input>{" "}
        x
        <input
          id="height"
          placeholder="height"
          maxLength={7}
          value={packageHeight}
          onChange={(event) => setPackageHeight(event.target.value)}
          autoComplete="off"
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
