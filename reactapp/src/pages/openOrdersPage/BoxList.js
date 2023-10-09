import "./BoxList.css";
// Import Components
import Box from "./Box";

const BoxList = ({
  boxes,
  setBoxes,
  readyStatus,
  updatePackages
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
              readyStatus={readyStatus}
              updatePackages={updatePackages}
            />
          </div>
        ))}
      </ul>
    </div>
  );
};
export default BoxList;


