import React, { useState, useRef } from "react";

const FunctionBubble = ({ functionName, explanation, color }) => {
  const [isOpen, setIsOpen] = useState(false);
  const bubbleRef = useRef(null); // Ref to access the bubble DOM element
  const [dropdownWidth, setDropdownWidth] = useState(0); // State to hold dropdown width

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen && bubbleRef.current) {
      const bubbleWidth = bubbleRef.current.getBoundingClientRect().width; // Get bubble width
      setDropdownWidth(bubbleWidth); // Set dropdown width
    }
  };

  return (
    <div>
      <div
        className="function-bubble"
        onClick={toggleDropdown}
        ref={bubbleRef} // Attach ref to the bubble
        style={{ backgroundColor: color }} // Set the background color from the prop
      >
        {functionName}
        {isOpen && (
          <div
            className={`dropdown ${isOpen ? "show" : ""}`}
            style={{
              width: `${dropdownWidth}px`, // Set dropdown width
              position: "relative",
              top: "100%", // Position below the bubble
              zIndex: 1, // Ensure it appears above other elements
            }}
          >
            <p style={{ whiteSpace: "pre-wrap" }}>{explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FunctionBubble;
