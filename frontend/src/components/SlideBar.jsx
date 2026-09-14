import React from "react";
import {
  FiHome,
  FiFolder,
  FiClock,
  FiSettings,
  FiPlus,
  FiChevronRight,
} from "react-icons/fi";

function SlideBar() {
  return (
    <aside className="flex h-screen w-[230px] shrink-0 flex-col border-r border-white/[0.06] bg-[#0b0d12]">

      {/* Logo */}
      <div className="flex h-[68px] items-center gap-3 border-b border-white/[0.06] px-5">

        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-sm font-bold text-black">
          ✦
        </div>

        <div>
          <p className="text-sm font-semibold">
            Aether
          </p>

          <p className="text-[10px] text-slate-600">
            AI WORKSPACE
          </p>
        </div>

      </div>

      {/* Navigation */}
      <div className="p-3">

        <NavItem
          icon={<FiHome />}
          text="Overview"
          active
        />

        <NavItem
          icon={<FiFolder />}
          text="Projects"
        />

        <NavItem
          icon={<FiClock />}
          text="History"
        />

      </div>

      {/* Projects */}
      <div className="mt-4 px-3">

        <div className="mb-2 flex items-center justify-between px-2">

          <span className="text-[10px] font-semibold tracking-widest text-slate-600">
            PROJECTS
          </span>

          <button className="text-slate-600 hover:text-white">
            <FiPlus size={14} />
          </button>

        </div>

        <Project name="Multi-Agent AI" />
        <Project name="RAG Assistant" />
        <Project name="Developer Tools" />

      </div>

      {/* Bottom */}
      <div className="mt-auto border-t border-white/[0.06] p-3">

        <NavItem
          icon={<FiSettings />}
          text="Settings"
        />

        <div className="mt-2 flex items-center gap-3 rounded-lg px-2 py-2">

          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/20 text-xs text-indigo-300">
            NK
          </div>

          <div className="min-w-0">
            <p className="truncate text-xs font-medium">
              Developer
            </p>

            <p className="text-[10px] text-slate-600">
              Free workspace
            </p>
          </div>

        </div>

      </div>

    </aside>
  );
}

function NavItem({ icon, text, active }) {
  return (
    <button
      className={`mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
        active
          ? "bg-white/[0.07] text-white"
          : "text-slate-500 hover:bg-white/[0.04] hover:text-slate-200"
      }`}
    >
      {icon}
      {text}
    </button>
  );
}

function Project({ name }) {
  return (
    <button className="group flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs text-slate-500 hover:bg-white/[0.04] hover:text-white">

      <span className="truncate">
        {name}
      </span>

      <FiChevronRight
        size={13}
        className="opacity-0 transition group-hover:opacity-100"
      />

    </button>
  );
}

export default SlideBar;