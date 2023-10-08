import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import "./AddReport.css";
import FileUploadModal from "./FileUploadModal";

const AddReport = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [showFileUploadModal, setShowFileUploadModal] = useState(false);
  const [uploads, setUploads] = useState([]);
  const [fileExtension, setFileExtension] = useState("");
  const [refreshReports, setRefreshReports] = useState(false);

  useEffect(() => {
    async function fetchLast5Uploads() {
      try {
        const response = await fetch("http://127.0.0.1:8000/reports/");
        if (response.ok) {
          const data = await response.json();
          setUploads(data);
        } else {
          console.error("Failed to fetch uploads data.");
        }
      } catch (error) {
        console.error("Error fetching uploads data:", error);
      }
    }
    fetchLast5Uploads();
    if (refreshReports) {
      setRefreshReports(false);
    }
  }, [refreshReports]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmitOrderReport = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      console.log("Please select a file.");
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile);
    const fileExtensionName = selectedFile.name.split(".").pop();
    if (fileExtensionName.toLowerCase() !== "xlsx") {
      setFileExtension(fileExtensionName);
      setShowFileUploadModal(true);
      return;
    }
    const fileNameWithoutExtension = selectedFile.name.replace(/\.[^/.]+$/, "");
    formData.append("file_name", fileNameWithoutExtension);

    try {
      const response = await fetch("http://127.0.0.1:8000/reports/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("File uploaded successfully.");
        setRefreshReports(true);
      } else {
        console.error("File upload failed.");
        const errorData = await response.json();
        console.log("Validation Errors:", errorData);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div className="add-order-report-container">
      <div className="file-upload-form">
        <h2>Upload Order Report</h2>
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
      <div className="previous-uploads-table">
        <h2>Previously uploaded files</h2>
        {uploads.length === 0 ? (
          <p className="no-file-message">No files have been uploaded.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>File Name</th>
                <th>Upload Date</th>
              </tr>
            </thead>
            <tbody>
              {uploads.map((upload) => (
                <tr key={upload.id}>
                  <td>{upload.file_name}</td>
                  <td>{new Date(upload.submitted_date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AddReport;
