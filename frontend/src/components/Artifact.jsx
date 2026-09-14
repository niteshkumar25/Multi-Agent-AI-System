import React from "react";
import {
  FiCode,
  FiX,
  FiDownload,
  FiMaximize2,
  FiCopy,
} from "react-icons/fi";

function Artifact() {
  return (
    <aside className="hidden h-screen w-[330px] shrink-0 flex-col border-l border-white/[0.06] bg-[#0b0d12] lg:flex">

      {/* Header */}
      <div className="flex h-[64px] shrink-0 items-center justify-between border-b border-white/[0.06] px-4">

        <div className="flex items-center gap-2.5">

          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.05] text-slate-400">
            <FiCode size={16} />
          </div>

          <div>
            <p className="text-sm font-medium text-white">
              Artifact
            </p>

            <p className="text-[11px] text-slate-600">
              Generated output
            </p>
          </div>

        </div>

        <button className="rounded-lg p-2 text-slate-600 transition hover:bg-white/[0.05] hover:text-white">
          <FiX size={16} />
        </button>

      </div>

      {/* File info */}
      <div className="border-b border-white/[0.06] px-4 py-3">

        <div className="flex items-center justify-between">

          <div>
            <p className="text-xs font-medium text-slate-300">
              server.js
            </p>

            <p className="mt-0.5 text-[10px] text-slate-600">
              JavaScript
            </p>
          </div>

          <div className="flex items-center gap-1">

            <button className="rounded-lg p-2 text-slate-600 transition hover:bg-white/[0.05] hover:text-white">
              <FiCopy size={14} />
            </button>

            <button className="rounded-lg p-2 text-slate-600 transition hover:bg-white/[0.05] hover:text-white">
              <FiDownload size={14} />
            </button>

            <button className="rounded-lg p-2 text-slate-600 transition hover:bg-white/[0.05] hover:text-white">
              <FiMaximize2 size={14} />
            </button>

          </div>

        </div>

      </div>

      {/* Code */}
      <div className="flex-1 overflow-auto bg-[#080a0e] p-4">

        <pre className="font-mono text-[12px] leading-6 text-slate-400">
          <code>
{`import express from "express";

const app = express();

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok"
  });
});

app.listen(3000, () => {
  console.log(
    "Server running on port 3000"
  );
});`}
          </code>
        </pre>

      </div>

      {/* Bottom */}
      <div className="border-t border-white/[0.06] p-3">

        <button className="w-full rounded-lg bg-white px-3 py-2 text-xs font-medium text-black transition hover:bg-slate-200">
          Apply Changes
        </button>

      </div>

    </aside>
  );
}

export default Artifact;