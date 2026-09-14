import React from "react";
import {
  FiPlus,
  FiMessageSquare,
  FiSearch,
  FiCode,
  FiFileText,
  FiImage,
  FiSettings,
  FiChevronDown,
} from "react-icons/fi";

function SlideBar() {
  const agents = [
    {
      name: "Chat",
      icon: <FiMessageSquare />,
    },
    {
      name: "Search",
      icon: <FiSearch />,
    },
    {
      name: "Coding",
      icon: <FiCode />,
    },
    {
      name: "PDF",
      icon: <FiFileText />,
    },
    {
      name: "Vision",
      icon: <FiImage />,
    },
  ];

  const chats = [
    "Build authentication API",
    "Explain LangGraph",
    "React dashboard",
    "Docker configuration",
  ];

  return (
    <aside className="flex h-screen w-[270px] shrink-0 flex-col border-r border-white/[0.06] bg-[#0b0d12]">

      {/* Header */}
      <div className="flex h-[64px] items-center justify-between border-b border-white/[0.06] px-4">

        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.08]">
            ✦
          </div>

          <div>
            <p className="text-sm font-semibold text-white">
              Multi-Agent
            </p>

            <p className="text-[11px] text-slate-500">
              AI Workspace
            </p>
          </div>
        </div>

        <button className="text-slate-500 transition hover:text-white">
          <FiChevronDown size={16} />
        </button>
      </div>

      {/* New Chat */}
      <div className="p-3">
        <button className="flex w-full items-center gap-2 rounded-xl bg-white px-3 py-2.5 text-sm font-medium text-black transition hover:bg-slate-200">
          <FiPlus size={17} />
          New Chat
        </button>
      </div>

      {/* Agents */}
      <div className="px-3">

        <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
          Agents
        </p>

        <div className="space-y-1">
          {agents.map((agent) => (
            <button
              key={agent.name}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
            >
              <span className="text-base">
                {agent.icon}
              </span>

              {agent.name}
            </button>
          ))}
        </div>
      </div>

      {/* Chat History */}
      <div className="mt-6 flex-1 overflow-y-auto px-3">

        <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
          Recent Chats
        </p>

        <div className="space-y-1">

          {chats.map((chat, index) => (
            <button
              key={index}
              className="w-full truncate rounded-lg px-3 py-2 text-left text-sm text-slate-500 transition hover:bg-white/[0.05] hover:text-slate-200"
            >
              {chat}
            </button>
          ))}

        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/[0.06] p-3">

        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-400 transition hover:bg-white/[0.05] hover:text-white">
          <FiSettings />
          Settings
        </button>

        {/* User */}
        <div className="mt-2 flex items-center gap-3 rounded-xl bg-white/[0.03] p-2.5">

          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-xs font-semibold">
            NK
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-white">
              User
            </p>

            <p className="truncate text-[11px] text-slate-600">
              Free plan
            </p>
          </div>

        </div>

      </div>

    </aside>
  );
}

export default SlideBar;