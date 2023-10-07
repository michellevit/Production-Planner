import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import "./AddReport.css";
import FileUploadModal from "./FileUploadModal";


const AddReport = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [showFileUploadModal, setShowFileUploadModal] = useState(false);
  const [fileExtension, setFileExtension] = useState("");
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmitOrderReport = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      console.log("Please select a file.");
      return;
    }
    console.log(selectedFile);
    const formData = new FormData();
    console.log(formData);
    formData.append("file", selectedFile);
    console.log(formData);
    const fileExtensionName = selectedFile.name.split(".").pop();
    if (fileExtensionName.toLowerCase() !== "xlsx") {
      setFileExtension(fileExtensionName);
      setShowFileUploadModal(true);
      return;
    }

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("File uploaded successfully.");
      } else {
        console.error("File upload failed.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div className="add-order-report-container">
      <FileUploadModal
            showFileUploadModal={showFileUploadModal}
            setShowFileUploadModal={setShowFileUploadModal}
            fileExtension={fileExtension}
            setFileExtension={setFileExtension}
          />
      <form id="add-order-report" onSubmit={handleSubmitOrderReport}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">
          <FontAwesomeIcon icon={faAdd} />
        </button>
      </form>
    </div>
  );
};

export default AddReport;