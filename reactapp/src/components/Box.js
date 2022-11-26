import React from "react";

const Box = () => {
  return (
    <div className="box-size">
      <form>
        <select
          name="dimensions"
          className="dimensions"
          defaultValue="Dimensions"
        >
          <option value="Dimensions" disabled hidden>
            Dimensions
          </option>
          <option value="TBD">TBD</option>
        </select>
        <input type="text" className="weight" placeholder="Weight"></input>
        <button className="add">+</button>
      </form>
    </div>
  );
};

export default Box;
