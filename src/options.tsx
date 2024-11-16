import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

const Options = () => {
  const [status, setStatus] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");

  useEffect(() => {
    chrome.storage.sync.get(
      {
        apiKey: "",
      },
      (items) => {
        setApiKey(items.apiKey);
      }
    );
  }, []);

  const saveOptions = () => {
    chrome.storage.sync.set(
      {
        apiKey: apiKey,
      },
      () => {
        setStatus("Options saved.");
        const id = setTimeout(() => {
          setStatus("");
        }, 1000);
        return () => clearTimeout(id);
      }
    );
  };

  return (
    <div id="view-as-markdown-extension" className="min-h-screen d-bg-base-200 flex items-center justify-center" data-theme="light">
      <div className="d-card w-96 d-bg-base-100 d-shadow-xl">
        <div className="d-card-body">
          <h2 className="d-card-title">Extension Settings</h2>

          <div className="d-form-control w-full">
            <label className="d-label">
              <span className="d-label-text">API Key</span>
            </label>
            <input type="text" value={apiKey} onChange={(event) => setApiKey(event.target.value)} className="d-input d-input-bordered w-full" placeholder="Enter your API key" />
          </div>

          {status && (
            <div className="d-alert d-alert-success">
              <span>{status}</span>
            </div>
          )}

          <div className="d-card-actions justify-end mt-4">
            <button className="d-btn d-btn-primary" onClick={saveOptions}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>
);
