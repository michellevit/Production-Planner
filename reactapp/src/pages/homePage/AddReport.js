import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import "./AddReport.css";
import ErrorModal from "../../components/ErrorModal";

const AddReport = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [uploads, setUploads] = useState([]);
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
      setErrorMessage("Please select a file.");
      setShowErrorModal(true);
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile);
    const fileExtensionName = selectedFile.name.split(".").pop();
    if (fileExtensionName.toLowerCase() !== "xlsx") {
      setErrorMessage(
        `The uploaded file is incompatible.\nUploaded file type: .${fileExtensionName}\nCorrect file type: .xlsx`
      );
      setShowErrorModal(true);
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
        setRefreshReports(true);
      } else {
        setErrorMessage("There was an error uploading your file - please check the following:\n1. The file is a QuickBooks 'Orders by Item' report\n2. The order report was saved to an accessible folder");
        setShowErrorModal(true);
        console.error("File upload failed.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div className="add-order-report-container">
      <div className="file-upload-form">
        <h2>Upload Order Report</h2>
        <ErrorModal
          showErrorModal={showErrorModal}
          setShowErrorModal={setShowErrorModal}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
        <form id="add-order-report" onSubmit={handleSubmitOrderReport} encType="multipart/form-data">
          <input type="file" onChange={handleFileChange} />
          <button type="submit">
            <FontAwesomeIcon icon={faAdd} />
          </button>
        </form>
      </div>
      <div className="previous-uploads-table">
        <h2>Previous Uploads</h2>
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
