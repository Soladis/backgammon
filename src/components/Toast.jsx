import React from "react";

const toastStyle = {
  position: "fixed",
  top: "20px",
  right: "20px",
  backgroundColor: "#333",
  color: "white",
  padding: "12px 20px",
  borderRadius: "8px",
  zIndex: 9999,
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  fontSize: "16px",
};

function Toast({ message }) {
  if (!message) return null;
  return <div style={toastStyle}>{message}</div>;
}

export default Toast;
