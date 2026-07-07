"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  ArrowPathIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

const SUGGESTED_PROMPTS = [
  "How can I reduce S3 storage costs?",
  "Which EC2 instances are idle or oversized?",
  "List the top 3 highest-priority alerts.",
  "What is my total potential monthly savings?",
];

const parseInline = (text) => {
  if (!text) return "";

  let parts = [{ type: "text", content: text }];

  
  parts = parts.flatMap((part) => {
    if (part.type !== "text") return part;
    const splitParts = part.content.split(/\*\*([^*]+)\*\*/g);
    return splitParts.map((subText, idx) => ({
      type: idx % 2 === 1 ? "bold" : "text",
      content: subText,
    }));
  });

  
  parts = parts.flatMap((part) => {
    if (part.type !== "text") return part;
    const splitParts = part.content.split(/`([^`]+)`/g);
    return splitParts.map((subText, idx) => ({
      type: idx % 2 === 1 ? "code" : "text",
      content: subText,
    }));
  });


  parts = parts.flatMap((part) => {
    if (part.type !== "text") return part;
    const splitParts = part.content.split(/\*([^*]+)\*/g);
    return splitParts.map((subText, idx) => ({
      type: idx % 2 === 1 ? "italic" : "text",
      content: subText,
    }));
  });

  return parts.map((part, idx) => {
    if (part.type === "bold") {
      return (
        <strong key={idx} className="font-extrabold text-[#111844]">
          {part.content}
        </strong>
      );
    }
    if (part.type === "italic") {
      return (
        <em key={idx} className="italic text-gray-800">
          {part.content}
        </em>
      );
    }
    if (part.type === "code") {
      return (
        <code
          key={idx}
          className="bg-purple-50 text-[#792CA2] font-mono px-1.5 py-0.5 rounded text-[10px] border border-purple-100/50"
        >
          {part.content}
        </code>
      );
    }
    return part.content;
  });
};

const renderHtmlTable = (tableObj, key) => {
  const { headers, alignments, rows } = tableObj;
  
  return (
    <div key={`table-${key}`} className="my-3 overflow-x-auto rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm max-w-full">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-800 text-[10px] md:text-[11px] text-left">
        {headers && (
          <thead className="bg-gray-50 dark:bg-slate-900/60 font-bold text-gray-700 dark:text-gray-300">
            <tr>
              {headers.map((header, colIdx) => {
                const align = alignments?.[colIdx] || "left";
                return (
                  <th
                    key={colIdx}
                    className="px-3 py-2 whitespace-nowrap font-extrabold"
                    style={{ textAlign: align }}
                  >
                    {parseInline(header)}
                  </th>
                );
              })}
            </tr>
          </thead>
        )}
        <tbody className="divide-y divide-gray-150 dark:divide-slate-800 bg-[#ffffff] dark:bg-[#111844]/20 text-gray-600 dark:text-slate-350">
          {rows.map((row, rowIdx) => (
            <tr key={rowIdx} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors">
              {row.map((cell, colIdx) => {
                const align = alignments?.[colIdx] || "left";
                return (
                  <td
                    key={colIdx}
                    className="px-3 py-2 font-medium"
                    style={{ textAlign: align }}
                  >
                    {parseInline(cell)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const formatMessage = (text) => {
  if (!text) return "";


  let cleanedText = text;
  cleanedText = cleanedText.replace(/```/g, "___TRIPLE_BACKTICK___");
  cleanedText = cleanedText.replace(/`/g, "");
  cleanedText = cleanedText.replace(/___TRIPLE_BACKTICK___/g, "```");

  
  const parts = cleanedText.split(/```/g);

  return parts.map((part, idx) => {
    
    if (idx % 2 === 1) {
      const lines = part.split("\n");
      const firstLine = lines[0].trim();
      // Check if the first line is a language identifier
      const isLang = /^[a-zA-Z0-9_-]+$/.test(firstLine);
      const codeContent = isLang ? lines.slice(1).join("\n") : part;
      const lang = isLang ? firstLine : "";

      return (
        <pre
          key={`code-block-${idx}`}
          className="bg-slate-900 text-slate-100 font-mono p-3 my-2 rounded-xl text-[10px] overflow-x-auto border border-slate-800 shadow-inner"
        >
          {lang && (
            <div className="text-[9px] text-slate-400 font-sans font-bold uppercase tracking-wider mb-1.5 pb-1 border-b border-slate-800">
              {lang}
            </div>
          )}
          <code className="whitespace-pre">{codeContent.trim()}</code>
        </pre>
      );
    }

    
    const lines = part.split("\n");
    const renderedElements = [];
    let currentTable = null;

    const flushTable = (lineIdx) => {
      if (currentTable) {
        renderedElements.push(renderHtmlTable(currentTable, lineIdx));
        currentTable = null;
      }
    };

    for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
      const line = lines[lineIdx];
      const trimmed = line.trim();
      
      const isTableRow = trimmed.startsWith("|") && trimmed.endsWith("|") && trimmed.length > 1;
      
      if (isTableRow) {
       
        const rawCells = trimmed.split("|").map(c => c.trim());
        const cells = rawCells.slice(1, rawCells.length - 1);
        
        const isSeparator = cells.every(cell => /^[:\s-]+$/.test(cell));
        
        if (isSeparator) {
          if (currentTable) {
            currentTable.alignments = cells.map(cell => {
              const left = cell.startsWith(":");
              const right = cell.endsWith(":");
              if (left && right) return "center";
              if (right) return "right";
              return "left";
            });
          }
        } else {
          if (!currentTable) {
            currentTable = { headers: cells, alignments: null, rows: [] };
          } else {
            currentTable.rows.push(cells);
          }
        }
      } else {
        flushTable(lineIdx);
        
        if (!trimmed) continue;

   
        const headerMatch = line.match(/^(#{1,6})\s+(.*)$/);
        if (headerMatch) {
          const level = headerMatch[1].length;
          const content = headerMatch[2];
          const headingClass =
            level === 1
              ? "text-sm font-extrabold text-[#111844] dark:text-[#F9F7F7] mt-3 mb-1.5"
              : level === 2
                ? "text-xs font-bold text-[#111844] dark:text-[#F9F7F7] mt-2.5 mb-1"
                : "text-[11px] font-bold text-[#111844] dark:text-[#F9F7F7] mt-2 mb-1";
          const HeadingTag = `h${Math.min(level, 6)}`;
          renderedElements.push(
            <HeadingTag key={`h-${lineIdx}`} className={headingClass}>
              {parseInline(content)}
            </HeadingTag>
          );
          continue;
        }


        const bulletMatch = line.match(/^(\s*)[*+-]\s+(.*)$/);
        if (bulletMatch) {
          const content = bulletMatch[2];
          renderedElements.push(
            <div
              key={`li-${lineIdx}`}
              className="flex items-start gap-1.5 ml-3 my-1"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#792CA2] dark:bg-[#C084FC] mt-1.5 flex-shrink-0" />
              <span className="text-xs text-gray-600 dark:text-slate-350 leading-normal">
                {parseInline(content)}
              </span>
            </div>
          );
          continue;
        }


        const numberMatch = line.match(/^(\s*)(\d+)\.\s+(.*)$/);
        if (numberMatch) {
          const num = numberMatch[2];
          const content = numberMatch[3];
          renderedElements.push(
            <div
              key={`ol-${lineIdx}`}
              className="flex items-start gap-1.5 ml-3 my-1"
            >
              <span className="text-xs font-bold text-[#792CA2] dark:text-[#C084FC] min-w-[12px] text-right mt-0.5 flex-shrink-0">
                {num}.
              </span>
              <span className="text-xs text-gray-600 dark:text-slate-350 leading-normal">
                {parseInline(content)}
              </span>
            </div>
          );
          continue;
        }

        renderedElements.push(
          <p
            key={`p-${lineIdx}`}
            className="my-1.5 text-xs text-gray-600 dark:text-slate-350 leading-normal"
          >
            {parseInline(line)}
          </p>
        );
      }
    }

    flushTable(lines.length);
    return renderedElements;
  });
};

export default function RecommendationChat() {
  const [messages, setMessages] = useState([
    {
      id: "greet",
      role: "model",
      content:
        "Hello! I am your CloudOptics AI Assistant. I have access to your active resources, metrics, and FinOps alerts. How can I help you optimize your cloud costs today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const handleSend = async (textToSend) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    if (!textToSend) {
      setInput("");
    }

    const userMessage = {
      id: `msg-${Date.now()}-user`,
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsSending(true);

    try {
      // Include current conversation history for context 
      const chatHistory = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/recommendations/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: chatHistory }),
      });

      if (!res.ok) throw new Error("Failed to send chat message");

      const json = await res.json();
      const botResponse = {
        id: `msg-${Date.now()}-bot`,
        role: "model",
        content: json.message,
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}-err`,
          role: "model",
          content:
            "Sorry, I encountered an error communicating with Gemini. Please try again.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3 px-2">
        <div className="bg-[#792CA2]/10 p-1.5 rounded-lg border border-[#792CA2]/20">
          <ChatBubbleLeftRightIcon className="w-5 h-5 text-[#792CA2]" />
        </div>
        <h2 className="text-xl font-extrabold text-[#111844] tracking-tight flex flex-wrap gap-x-1.5 gap-y-0.5">
          <span>AI</span>
          <span>Cloud</span>
          <span>Assistant</span>
        </h2>
      </div>

      <div className="relative mt-2 flex-grow flex flex-col min-h-[480px]">
        
        <div className="absolute inset-0 bg-gradient-to-br from-[#792CA2]/5 via-blue-500/5 to-[#9A4DCC]/10 rounded-3xl blur-xl" />

        {/* Main Chat Box */}
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white flex-grow flex flex-col relative z-10 h-full overflow-hidden">
         
          <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
              <SparklesIcon className="w-4 h-4 text-[#792CA2] animate-pulse" />
              AI Powered Optimization Model
            </div>
            <button
              onClick={() =>
                setMessages([
                  {
                    id: "greet",
                    role: "model",
                    content:
                      "Chat reset. How else can I assist with your AWS infrastructure?",
                  },
                ])
              }
              className="text-[10px] font-bold text-gray-400 hover:text-[#792CA2] transition-colors"
            >
              Clear Chat
            </button>
          </div>

          {/* Messages Area */}
          <div
            ref={messagesContainerRef}
            className="flex-grow overflow-y-auto pr-3 mb-3 space-y-3 custom-scrollbar h-0"
          >
            <AnimatePresence initial={false}>
              {messages.map((msg) => {
                const isUser = msg.role === "user";
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs font-medium leading-relaxed shadow-sm break-words select-text ${
                        isUser
                          ? "bg-[#111844] dark:bg-[#792CA2] text-white rounded-tr-none"
                          : "bg-[#ffffff] dark:bg-[#15193B] text-gray-700 dark:text-[#F9F7F7] border border-gray-150 dark:border-white/5 rounded-tl-none"
                      }`}
                    >
                      {isUser ? (
                        <p className="whitespace-pre-wrap font-sans">
                          {msg.content}
                        </p>
                      ) : (
                        <div className="font-sans space-y-1">
                          {formatMessage(msg.content)}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {isSending && (
              <div className="flex justify-start">
                <div className="bg-[#ffffff] dark:bg-[#15193B] border border-gray-150 dark:border-white/5 rounded-2xl rounded-tl-none px-4 py-3 flex gap-1 items-center shadow-sm">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -4, 0] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                      className="w-1.5 h-1.5 rounded-full bg-[#792CA2]"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Suggested Prompts Part */}
          {messages.length === 1 && (
            <div className="mb-3 space-y-1.5">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">
                Suggested Prompts
              </p>
              <div className="flex flex-col gap-1.5">
                {SUGGESTED_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(prompt)}
                    disabled={isSending}
                    className="w-full text-left px-3 py-1.5 bg-[#ffffff] dark:bg-[#15193B] hover:bg-[#792CA2]/5 dark:hover:bg-[#792CA2]/15 hover:text-[#792CA2] dark:hover:text-[#C084FC] border border-gray-150 dark:border-white/10 text-[11px] font-semibold text-gray-600 dark:text-gray-300 rounded-xl transition-all shadow-sm truncate"
                  >
                    💡 {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message Input Box */}
          <div className="mt-auto pt-2 border-t border-gray-100 dark:border-slate-800 flex items-center gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSending}
              rows={1}
              placeholder="Ask about costs, idle services..."
              className="flex-grow bg-[#F9F7F7] dark:bg-slate-800 border border-gray-200/85 dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-medium text-[#111844] dark:text-[#F9F7F7] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#792CA2] dark:focus:ring-[#C084FC] focus:border-[#792CA2] dark:focus:border-[#C084FC] transition-all resize-none max-h-16"
            />
            <button
              onClick={() => handleSend()}
              disabled={isSending || !input.trim()}
              className="bg-gradient-to-r from-[#12163b] to-[#1e2354] dark:from-[#792CA2] dark:to-[#9A4DCC] text-white p-2.5 rounded-xl hover:shadow-md hover:shadow-[#792CA2]/10 transition-all disabled:opacity-40 disabled:pointer-events-none flex-shrink-0"
            >
              <PaperAirplaneIcon className="w-4 h-4 transform rotate-0" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
