import React, { useState } from "react";
import {
  FiPaperclip,
  FiArrowUp,
  FiChevronDown,
  FiGlobe,
  FiCode,
  FiFileText,
} from "react-icons/fi";

function ChatArea() {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    console.log("Message:", message);

    setMessage("");
  };

  return (
    <main className="flex min-w-0 flex-1 flex-col bg-[#0d0f14]">

      {/* Top bar */}
      <header className="flex h-[64px] shrink-0 items-center justify-between border-b border-white/[0.06] px-6">

        <div className="flex items-center gap-2">

          <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-300 transition hover:bg-white/[0.05] hover:text-white">

            <span>Chat Agent</span>

            <FiChevronDown size={14} />

          </button>

        </div>

        <div className="flex items-center gap-2">

          <span className="h-2 w-2 rounded-full bg-green-400" />

          <span className="text-xs text-slate-500">
            Online
          </span>

        </div>

      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">

        <div className="mx-auto flex w-full max-w-3xl flex-col px-6 py-10">

          {/* Empty state */}
          <div className="flex flex-1 flex-col items-center justify-center py-24 text-center">

            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03] text-2xl">
              ✦
            </div>

            <h1 className="text-2xl font-semibold text-white">
              How can I help you?
            </h1>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              Ask a question, search the web, write code, analyze a PDF,
              create a presentation, or process an image.
            </p>

            {/* Suggestions */}
            <div className="mt-8 grid w-full grid-cols-1 gap-2 sm:grid-cols-2">

              <Suggestion
                icon={<FiCode />}
                title="Write some code"
                text="Build a REST API with Node.js"
              />

              <Suggestion
                icon={<FiGlobe />}
                title="Search the web"
                text="Find the latest AI news"
              />

              <Suggestion
                icon={<FiFileText />}
                title="Analyze a document"
                text="Summarize a PDF"
              />

              <Suggestion
                icon={<FiPaperclip />}
                title="Upload a file"
                text="Analyze my document"
              />

            </div>

          </div>

        </div>

      </div>

      {/* Input */}
      <div className="shrink-0 px-4 pb-5">

        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-3xl"
        >

          <div className="rounded-2xl border border-white/[0.08] bg-[#13161d] shadow-xl">

            {/* Input */}
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message your AI agent..."
              rows={3}
              className="w-full resize-none bg-transparent px-4 pt-4 text-sm text-white outline-none placeholder:text-slate-600"
            />

            {/* Toolbar */}
            <div className="flex items-center justify-between px-3 pb-3">

              <div className="flex items-center gap-1">

                <button
                  type="button"
                  className="rounded-lg p-2 text-slate-500 transition hover:bg-white/[0.06] hover:text-white"
                >
                  <FiPaperclip size={17} />
                </button>

                <button
                  type="button"
                  className="rounded-lg px-2.5 py-1.5 text-xs text-slate-500 transition hover:bg-white/[0.06] hover:text-white"
                >
                  + Tools
                </button>

              </div>

              <button
                type="submit"
                disabled={!message.trim()}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <FiArrowUp size={17} />
              </button>

            </div>

          </div>

          <p className="mt-2 text-center text-[10px] text-slate-700">
            AI can make mistakes. Check important information.
          </p>

        </form>

      </div>

    </main>
  );
}

function Suggestion({ icon, title, text }) {
  return (
    <button className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-left transition hover:border-white/[0.12] hover:bg-white/[0.04]">

      <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.05] text-slate-400 transition group-hover:text-white">
        {icon}
      </div>

      <p className="text-sm font-medium text-slate-300">
        {title}
      </p>

      <p className="mt-1 text-xs text-slate-600">
        {text}
      </p>

    </button>
  );
}

export default ChatArea;