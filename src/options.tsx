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
    <div id="view-as-markdown-extension" className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-96">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Extension Settings</h2>

          <div className="w-full">
            <label className="block">
              <span className="text-gray-700">API Key</span>
            </label>
            <input type="text" value={apiKey} onChange={(event) => setApiKey(event.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" placeholder="Enter your API key" />
          </div>

          {status && (
            <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
              <span>{status}</span>
            </div>
          )}

          <div className="flex justify-end mt-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" onClick={saveOptions}>
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
