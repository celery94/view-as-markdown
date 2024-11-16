import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

const Popup = () => {
  const toggleReadingMode = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tab = tabs[0];
      if (tab.id) {
        chrome.tabs.sendMessage(
          tab.id,
          {
            type: "TOGGLE_READING_MODE",
          },
          (response) => {
            if (response.success) {
              window.close();
            }
          }
        );
      }
    });
  };

  useEffect(() => {
    toggleReadingMode();
  }, []);

  return (
    <div id="view-as-markdown-extension">
      {/* Remove the button if it's no longer needed */}
      {/* <button onClick={toggleReadingMode}>Reading Mode</button> */}
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
