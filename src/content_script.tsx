import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Readability } from "@mozilla/readability";
import TurndownService from "turndown";
import ReactMarkdown from "react-markdown";

const ReadingMode = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [content, setContent] = React.useState("");
  const [header, setHeader] = React.useState("");
  const [showMarkdown, setShowMarkdown] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [copiedMarkdown, setCopiedMarkdown] = React.useState(false);
  const [isTranslating, setIsTranslating] = React.useState(false);
  const renderedContentRef = React.useRef<HTMLDivElement>(null);

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

          const header = `---
pubDatetime: ${article.publishedTime.substring(0, 10)}
tags: []
source: ${window.location.href}
author: ${article.byline}
title: ${article.title}
description: ${article.excerpt}
---`;

          setHeader(header);

          const markdown = `# ${article.title}` + "\n\n" + turndownService.turndown(article.content);
          setContent(markdown);
          setIsOpen(!isOpen);
          sendResponse({ success: true });
        }
      }
    });
  }, [isOpen]);

  const handleCopy = async () => {
    try {
      if (renderedContentRef.current) {
        await navigator.clipboard.writeText(renderedContentRef.current.innerText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleCopyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMarkdown(true);
      setTimeout(() => setCopiedMarkdown(false), 2000);
    } catch (err) {
      console.error("Failed to copy markdown:", err);
    }
  };

  const handleTranslate = async () => {
    setIsTranslating(true);
    try {
      // Retrieve API key from storage
      chrome.storage.sync.get(["apiKey"], async (result) => {
        const apiKey = result.apiKey;
        if (!apiKey) {
          alert("API Key not set. Please set it in the extension options.");
          setIsTranslating(false);
          return;
        }

        const response = await fetch("https://aidehub.top/v1/workflows/run", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: {
              input_text: content,
              language: "简体中文",
            },
            response_mode: "blocking",
            user: "chrome-extension",
          }),
        });

        if (!response.ok || !response.body) {
          throw new Error("Network response was not ok");
        }

        const responseData = await response.json();
        const translatedText = responseData.data.outputs.final;
        setContent(translatedText);
      });
    } catch (error) {
      console.error("Translation failed:", error);
      setContent(content);
    } finally {
      setIsTranslating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-7xl h-[90vh] flex flex-col p-0 bg-base-100">
        <div className="sticky top-0 flex justify-between items-center px-4 py-2 bg-base-200 border-b">
          <h3 className="font-bold text-lg">Markdown View</h3>
          <div className="flex items-center gap-2">
            <button className={`btn btn-sm ${copiedMarkdown ? "btn-success" : "btn-ghost"}`} onClick={handleCopyMarkdown}>
              {copiedMarkdown ? "Copied!" : "Copy Markdown"}
            </button>
            <button className={`btn btn-sm ${copied ? "btn-success" : "btn-ghost"}`} onClick={handleCopy}>
              {copied ? "Copied!" : "Copy Content"}
            </button>
            <button className={`btn btn-sm ${showMarkdown ? "btn-primary" : "btn-ghost"}`} onClick={() => setShowMarkdown(!showMarkdown)}>
              {showMarkdown ? "Hide Markdown" : "Show Markdown"}
            </button>
            <button className={`btn btn-sm ${isTranslating ? "btn-disabled" : "btn-ghost"}`} onClick={handleTranslate} disabled={isTranslating}>
              {isTranslating ? "Translating..." : "Translate"}
            </button>
            <button className="btn btn-square btn-ghost" onClick={() => setIsOpen(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {showMarkdown && (
            <div className="w-1/2 p-4 border-r">
              <textarea
                className="textarea textarea-bordered w-full h-full font-mono"
                value={header + "\n\n" + content}
                onChange={(e) => {
                  const [newHeader, ...newContent] = e.target.value.split("\n\n");
                  setHeader(newHeader);
                  setContent(newContent.join("\n\n"));
                }}
              />
            </div>
          )}
          <div ref={renderedContentRef} className={`${showMarkdown ? "w-1/2" : "w-full"} p-4 overflow-y-auto prose lg:prose-xl max-w-none`}>
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
