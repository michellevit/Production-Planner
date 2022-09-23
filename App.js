import React from "react";
import "./App.css";
import * as XLSX from "xlsx";

function App() {
  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, { type: "buffer" });
        const wsname = wb.SheetNames[1];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, {
          header: 1,
          defval: "",
        });
        resolve(data);
        const customerArray = [];
        const wsRange = XLSX.utils.decode_range(ws["!ref"]);
        const endRow = wsRange.e.r;
        for (let x = 0; x < endRow; x++) {
          var customer = data[x][1];
          const forbiddenArray = ["", "Type", "Date", "Num", "Sales Order"];
          if (forbiddenArray.includes(customer) === false) {
            var totalCheck = false;
            for (let z = 0; z < customerArray.length; z++) {
              if (customer === "Total " + customerArray[z]) {
                totalCheck = true;
              }
            }
            if (totalCheck === false) {
              customerArray.push(customer);
            }
          }
        }
        console.log("Customer Array: ", customerArray);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
    promise.then((d) => {
      console.log("Data: ", d);
    });
  };

  return (
    <div>
      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files[0];
          readExcel(file);
        }}
      />
    </div>
  );
}

export default App;
