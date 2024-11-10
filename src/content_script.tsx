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
    <div className="modal modal-open">
      <div className="modal-box max-w-7xl h-[90vh] flex flex-col p-0 bg-base-100">
        <div className="sticky top-0 flex justify-between items-center px-4 py-2 bg-base-200 border-b">
          <h3 className="font-bold text-lg">Markdown View</h3>
          <button className="btn btn-square btn-ghost" onClick={() => setIsOpen(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-1/2 p-4 border-r">
            <textarea className="textarea textarea-bordered w-full h-full font-mono" value={content} onChange={(e) => setContent(e.target.value)} />
          </div>
          <div className="w-1/2 p-4 overflow-y-auto prose lg:prose-xl max-w-none">
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
