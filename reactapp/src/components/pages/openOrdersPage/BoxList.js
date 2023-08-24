import "./BoxList.css";
// Import Components
import Box from "./Box";

const BoxList = ({
  boxes,
  setBoxes,
  setFormDisplay,
  buttonDisplay,
  setButtonDisplay,
  confirmStatus,
  handleConfirmButtonStatus,
  setConfirmStatus,
  confirmHandler,
  readyStatus
}) => {
  return (
    <div className="boxlist-container">
      <ul className="boxlist">
        {boxes.map((box) => (
          <div key={box.id} className="box-container">
            <Box
              box={box}
              boxes={boxes}
              setBoxes={setBoxes}
              setFormDisplay={setFormDisplay}
              buttonDisplay={buttonDisplay}
              setButtonDisplay={setButtonDisplay}
              confirmStatus={confirmStatus}
              setConfirmStatus={setConfirmStatus}
              handleConfirmButtonStatus={handleConfirmButtonStatus}
              confirmHandler={confirmHandler}
              readyStatus={readyStatus}
            />
          </div>
        ))}
      </ul>
    </div>
  );
};
export default BoxList;



