import React from "react";
import "../../styles/DropDownOption.css";

const DropDownOption = ({ activeButton, onSelect }) => {
     const options = activeButton === "Login"
    ? ["Student", "Teaching Staff", "Non-Teaching Staff", "Officer", "Admin"]
    : ["Student", "Teaching Staff", "Non-Teaching Staff", "Officer", "Admin"];
  return (
    <div className="dropdown">
      <h3>{activeButton} as:</h3>
      <ul>
        <li onClick={() => onSelect("Student")}>Student</li>
        <li onClick={() => onSelect("Teaching Staff")}>Teaching Staff</li>
        <li onClick={() => onSelect("Non-Teaching Staff")}>Non-Teaching Staff</li>
        <li onClick={() => onSelect("Officer")}>Officer</li>
        <li onClick={() => onSelect("Admin")}>Admin</li>
      </ul>
    </div>
  );
};

export default DropDownOption;
