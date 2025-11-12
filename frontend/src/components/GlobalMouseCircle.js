import React, { useState, useEffect } from "react";

export default function GlobalMouseCircle() {
  const [circlePos, setCirclePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCirclePos({ x: e.clientX, y: e.clientY });
    };

    // Attach listener to the whole window
    window.addEventListener("mousemove", handleMouseMove);

    // Clean up
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: circlePos.y - 15,
        left: circlePos.x - 15,
        width: 30,
        height: 30,
        borderRadius: "50%",
        backgroundColor: "rgba(0, 123, 255, 0.5)",
        pointerEvents: "none",
        transition: "top 0.05s, left 0.05s",
        zIndex: 9999,
      }}
    ></div>
  );
}
