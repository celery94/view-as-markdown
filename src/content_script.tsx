import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Readability } from "@mozilla/readability";
import TurndownService from "turndown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
          const turndownService = new TurndownService({
            headingStyle: "atx",
            hr: "---",
            bulletListMarker: "-",
            codeBlockStyle: "fenced",
            fence: "```",
            emDelimiter: "*",
            strongDelimiter: "**",
            linkStyle: "inlined",
            linkReferenceStyle: "full",
          });
          const markdown = `# ${article.title}` + "\n\n" + turndownService.turndown(article.content);
          setContent(markdown);
          setIsOpen(!isOpen);
          sendResponse({ success: true });
        }
      }
    });
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-999 flex w-full justify-center items-center">
      <button className="absolute right-2 top-2 border-none text-2xl cursor-pointer" onClick={() => setIsOpen(false)}>
        ×
      </button>
      <div className="bg-white p-5 rounded w-4/5 max-h-[90vh] overflow-y-auto relative">
        <div className="flex">
          <div className="w-1/2 p-2">
            <textarea className="w-full h-full border p-2" value={content} onChange={(e) => setContent(e.target.value)} />
          </div>
          <div className="w-1/2 p-2 overflow-y-auto prose lg:prose-xl">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
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
