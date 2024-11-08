import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Readability } from "@mozilla/readability";
import TurndownService from "turndown";
import ReactMarkdown from "react-markdown";

const ReadingMode = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [content, setContent] = React.useState("");

  React.useEffect(() => {
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
      if (msg.type === "TOGGLE_READING_MODE") {
        const documentClone = document.cloneNode(true) as Document;
        const reader = new Readability(documentClone);
        const article = reader.parse();
        if (article) {
          const turndownService = new TurndownService();
          const markdown = turndownService.turndown(article.content);
          setContent(markdown);
          setIsOpen(!isOpen);
          sendResponse({ success: true });
        }
      }
    });
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center">
      <div className="bg-white p-5 rounded max-w-7xl max-h-[90vh] overflow-y-auto relative">
        <button className="absolute right-2 top-2 border-none bg-transparent text-2xl cursor-pointer" onClick={() => setIsOpen(false)}>
          ×
        </button>
        <div className="flex">
          <div className="w-1/2 p-2 prose">
            <pre>{content}</pre>
          </div>
          <div className="w-1/2 p-2 overflow-y-auto">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};

// Create container and render component
const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
root.render(<ReadingMode />);
