import React, { useState } from "react";
import {
  FiArrowUp,
  FiCode,
  FiGlobe,
  FiFileText,
  FiLayers,
  FiPaperclip,
} from "react-icons/fi";

function ChatArea() {
  const [message, setMessage] = useState("");

  return (
    <main className="flex min-w-0 flex-1 flex-col">

      {/* Top */}
      <header className="flex h-[68px] shrink-0 items-center justify-between border-b border-white/[0.06] px-7">

        <div>
          <p className="text-sm font-medium">
            Workspace
          </p>

          <p className="text-[11px] text-slate-600">
            Multi-Agent AI System
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-white/[0.06] px-3 py-1.5">

          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

          <span className="text-[11px] text-slate-500">
            System ready
          </span>

        </div>

      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">

        <div className="mx-auto max-w-4xl px-8 py-12">

          {/* Welcome */}
          <section>

            <p className="text-xs uppercase tracking-[0.2em] text-slate-600">
              AI Workspace
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight">
              Build something intelligent.
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
              Route tasks between specialized agents for coding,
              research, documents, presentations and vision.
            </p>

          </section>

          {/* Agents */}
          <section className="mt-12">

            <div className="mb-4 flex items-center justify-between">

              <h2 className="text-xs font-medium uppercase tracking-widest text-slate-600">
                Start with an agent
              </h2>

              <span className="text-[11px] text-slate-700">
                6 available
              </span>

            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">

              <AgentCard
                icon={<FiLayers />}
                name="Chat"
                description="General reasoning"
              />

              <AgentCard
                icon={<FiGlobe />}
                name="Search"
                description="Web research"
              />

              <AgentCard
                icon={<FiCode />}
                name="Coding"
                description="Write & debug"
              />

              <AgentCard
                icon={<FiFileText />}
                name="PDF"
                description="Read documents"
              />

              <AgentCard
                icon={<FiLayers />}
                name="PPT"
                description="Create slides"
              />

              <AgentCard
                icon={<FiPaperclip />}
                name="Vision"
                description="Analyze images"
              />

            </div>

          </section>

          {/* Recent */}
          <section className="mt-12">

            <h2 className="mb-4 text-xs font-medium uppercase tracking-widest text-slate-600">
              Recent activity
            </h2>

            <div className="divide-y divide-white/[0.05] rounded-xl border border-white/[0.06]">

              <Activity title="Authentication service" type="Coding" />
              <Activity title="LangGraph router" type="Coding" />
              <Activity title="Distributed systems notes" type="PDF" />

            </div>

          </section>

        </div>

      </div>

      {/* Input */}
      <div className="border-t border-white/[0.06] bg-[#0b0d12] px-8 py-5">

        <div className="mx-auto max-w-4xl">

          <div className="rounded-xl border border-white/[0.08] bg-[#11141b]">

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe what you want to build..."
              rows={2}
              className="w-full resize-none bg-transparent px-4 py-4 text-sm outline-none placeholder:text-slate-600"
            />

            <div className="flex items-center justify-between px-3 pb-3">

              <button className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-slate-600 hover:bg-white/[0.05] hover:text-white">
                <FiPaperclip size={14} />
                Attach
              </button>

              <button
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black transition hover:bg-slate-200"
              >
                <FiArrowUp size={16} />
              </button>

            </div>

          </div>

          <p className="mt-2 text-center text-[10px] text-slate-700">
            The router automatically selects the best agent for your task.
          </p>

        </div>

      </div>

    </main>
  );
}

function AgentCard({ icon, name, description }) {
  return (
    <button className="group rounded-xl border border-white/[0.06] bg-[#10131a] p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-white/[0.12] hover:bg-[#141821]">

      <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.05] text-slate-400 group-hover:text-white">
        {icon}
      </div>

      <p className="text-sm font-medium">
        {name}
      </p>

      <p className="mt-1 text-xs text-slate-600">
        {description}
      </p>

    </button>
  );
}

function Activity({ title, type }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">

      <div>
        <p className="text-sm text-slate-300">
          {title}
        </p>

        <p className="mt-1 text-[10px] text-slate-600">
          Recently opened
        </p>
      </div>

      <span className="rounded-md bg-white/[0.04] px-2 py-1 text-[10px] text-slate-500">
        {type}
      </span>

    </div>
  );
}

export default ChatArea;