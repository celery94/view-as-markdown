import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

const ReadingMode = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [content, setContent] = React.useState("");

  React.useEffect(() => {
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
      if (msg.type === "TOGGLE_READING_MODE") {
        const mainContent =
          document.querySelector("main, article, .content") || document.body;
        setContent(mainContent.innerHTML);
        setIsOpen(!isOpen);
        sendResponse({ success: true });
      }
    });
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center">
      <div className="bg-white p-5 rounded max-w-4xl max-h-[90vh] overflow-y-auto relative">
        <button
          className="absolute right-2 top-2 border-none bg-transparent text-2xl cursor-pointer"
          onClick={() => setIsOpen(false)}
        >
          ×
        </button>
        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
};

// Create container and render component
const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
root.render(<ReadingMode />);
