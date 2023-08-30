import "./BoxList.css";
// Import Components
import Box from "./Box";

const BoxList = ({
  boxes,
  setBoxes,
  setFormDisplay,
  buttonDisplay,
  setButtonDisplay,
  boxFormConfirmStatus,
  handleBoxFormConfirmButtonStatus,
  setBoxFormConfirmStatus,
  boxFormConfirmHandler,
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
              boxFormConfirmStatus={boxFormConfirmStatus}
              setBoxFormConfirmStatus={setBoxFormConfirmStatus}
              boxFormConfirmHandler={boxFormConfirmHandler}
              readyStatus={readyStatus}
            />
          </div>
        ))}
      </ul>
    </div>
  );
};
export default BoxList;


