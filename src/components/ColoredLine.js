import React from "react";

const ColoredLine = ({ color, height }) => (
  <hr
    style={{
      backgroundColor: color,
      border: "0px",
      height: height
    }}
  />
);

export default ColoredLine;
