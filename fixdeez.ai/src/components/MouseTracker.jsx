import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom"; // Needed for createPortal if you're using it

const MouseTracker = ({ children, offset = { x: 0, y: 0 } }) => {
  const element = useRef({});

  useEffect(() => {
    function handler(e) {
      if (element.current) {
        const x = e.clientX + offset.x,
          y = e.clientY + offset.y;
        element.current.style.transform = `translate(${x}px, ${y}px)`;
        element.current.style.visibility = "visible";
      }
    }
    document.addEventListener("mousemove", handler);
    return () => document.removeEventListener("mousemove", handler);
  }, [offset.x, offset.y]);

  return createPortal(
    <div className="mouse-tracker" ref={element}>
      {children}
    </div>,
    document.body
  );
};

export default MouseTracker;
