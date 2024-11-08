import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

// Reading mode dialog component
const ReadingMode = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [content, setContent] = React.useState("");

  React.useEffect(() => {
    // Handle messages from popup
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
      if (msg.type === "TOGGLE_READING_MODE") {
        // Get main content
        const mainContent = document.querySelector("main, article, .content") || document.body;
        setContent(mainContent.innerHTML);
        setIsOpen(!isOpen);
        sendResponse({ success: true });
      }
    });
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="reading-mode-overlay">
      <div className="reading-mode-dialog">
        <button className="close-btn" onClick={() => setIsOpen(false)}>
          ×
        </button>
        <div className="reading-content" dangerouslySetInnerHTML={{ __html: content }} />
      </div>
      <style>{`
        .reading-mode-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.75);
          z-index: 9999;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .reading-mode-dialog {
          background: white;
          padding: 20px;
          border-radius: 8px;
          max-width: 800px;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
        }
        .close-btn {
          position: absolute;
          right: 10px;
          top: 10px;
          border: none;
          background: none;
          font-size: 24px;
          cursor: pointer;
        }
        .reading-content {
          font-size: 18px;
          line-height: 1.6;
          color: #333;
        }
      `}</style>
    </div>
  );
};

// Create container and render component
const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
root.render(<ReadingMode />);
