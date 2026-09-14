import React from "react";
import {
  FiCode,
  FiTerminal,
  FiActivity,
  FiChevronRight,
} from "react-icons/fi";

function Artifact() {
  return (
    <aside className="hidden h-screen w-[300px] shrink-0 flex-col border-l border-white/[0.06] bg-[#0b0d12] lg:flex">

      {/* Header */}
      <div className="flex h-[68px] items-center justify-between border-b border-white/[0.06] px-5">

        <div>
          <p className="text-sm font-medium">
            Agent Activity
          </p>

          <p className="mt-1 text-[10px] text-slate-600">
            Live execution
          </p>
        </div>

        <span className="h-2 w-2 rounded-full bg-emerald-400" />

      </div>

      {/* Agent Status */}
      <div className="p-4">

        <div className="rounded-xl border border-white/[0.06] bg-[#10131a] p-4">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-300">
              <FiActivity />
            </div>

            <div>
              <p className="text-xs font-medium">
                Router
              </p>

              <p className="mt-1 text-[10px] text-emerald-400">
                Running
              </p>
            </div>

          </div>

          <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/[0.05]">
            <div className="h-full w-[72%] rounded-full bg-indigo-400" />
          </div>

        </div>

      </div>

      {/* Execution */}
      <div className="px-4">

        <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
          Execution
        </p>

        <Step
          icon={<FiCode />}
          title="Coding Agent"
          status="Completed"
        />

        <Step
          icon={<FiTerminal />}
          title="Tool execution"
          status="Running"
          active
        />

        <Step
          icon={<FiActivity />}
          title="Response"
          status="Waiting"
        />

      </div>

      {/* Output */}
      <div className="mt-auto border-t border-white/[0.06] p-4">

        <button className="flex w-full items-center justify-between rounded-lg border border-white/[0.06] bg-[#10131a] px-3 py-3 text-xs text-slate-400 transition hover:bg-white/[0.04] hover:text-white">

          <span>Open generated artifact</span>

          <FiChevronRight />

        </button>

      </div>

    </aside>
  );
}

function Step({ icon, title, status, active }) {
  return (
    <div className="flex items-center gap-3 border-b border-white/[0.04] py-3">

      <div
        className={`flex h-8 w-8 items-center justify-center rounded-lg ${
          active
            ? "bg-indigo-500/10 text-indigo-300"
            : "bg-white/[0.03] text-slate-600"
        }`}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">

        <p className="text-xs text-slate-400">
          {title}
        </p>

        <p
          className={`mt-1 text-[10px] ${
            active ? "text-indigo-300" : "text-slate-700"
          }`}
        >
          {status}
        </p>

      </div>

    </div>
  );
}

export default Artifact;