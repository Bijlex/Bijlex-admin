import React from "react";
import { useMessage } from "../contexts/MessageContext";

const ExportPanel = ({ json, closeDialog, exerciseName }) => {
  // Function to download JSON data
  const { addDialog, removeDialog } = useMessage();
  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(json)], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = exerciseName + ".json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };
  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(json)).then(
      () => {
        addDialog({
          type: "message",
          messageType: "success", // can be 'default', 'success', or 'error'
          message: "Json Copied!",
          duration: 3000, // duration in milliseconds
        });
      },
      (err) => {
        console.error("Failed to copy: ", err);
      }
    );
  };
  return (
    <div
      style={{
        position: "absolute",
        top: "10%",
        left: "10%",
        padding: "20px",
        width: "80%",
        border: "1px solid black",
        backgroundColor: "white",
        zIndex: 1000,
      }}
    >
      <button
        style={{
          position: "absolute",
          top: "-5%",
          left: "98%",
          padding: "20px",
          border: "1px solid black",
          color: "white",
          backgroundColor: "red",
          zIndex: 1000,
        }}
        onClick={closeDialog}
      >
        X
      </button>
      <h1>{exerciseName}</h1>
      <h2 style={{ marginTop: "10px" }}>Custom Data:</h2>
      <pre
        style={{
          height: "50vh",
          overflowY: "auto",
          overflowX: "hidden",
          border: "1px solid black",
        }}
      >
        {JSON.stringify(json, null, 2)}
      </pre>
      <button
        style={{ marginTop: "2vh", backgroundColor: "black", color: "white" }}
        onClick={downloadJson}
      >
        Download JSON
      </button>
      <button
        style={{ marginLeft: "10px", backgroundColor: "black", color: "white" }}
        onClick={copyToClipboard}
      >
        📋 Copy Data
      </button>
    </div>
  );
};

export default ExportPanel;
