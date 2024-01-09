import React from "react";
import "./LatestUpload.css";

const AddReport = () => {
  const uploads = 0;
  return (
    <div className="latest-upload-container">
      <div className="latest-upload-table">
        <h2>Most Recent Update</h2>
        {uploads === 0 ? (
          <p className="no-data-message">No data has been fetched from QuickBooks yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>File Name</th>
                <th>Upload Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                  <td></td>
                  <td></td>
                </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AddReport;
