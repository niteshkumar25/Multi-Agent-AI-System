import { useEffect, useRef, useState } from "react";

import {
  FiArrowUp,
  FiCode,
  FiGlobe,
  FiFileText,
  FiLayers,
  FiPaperclip,
  FiLoader,
  FiUser,
  FiCpu,
  FiMessageSquare,
  FiImage,
  FiMonitor,
  FiX,
  FiFile,
} from "react-icons/fi";

import { HiSparkles } from "react-icons/hi2";

import { useDispatch, useSelector } from "react-redux";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  addConversations,
  setSelectedConversations,
  updateConversationTitle,
} from "../redux/conversationSlice";

import { setMessages } from "../redux/messageSlice";

import { createConversation } from "../features/createConversation";
import getMessages from "../features/getMessages";
import sendMessage from "../features/sendMessage";
import updateConversation from "../features/updateConversation";


const AGENTS = [
  { name: "Auto", icon: HiSparkles },
  { name: "Chat", icon: FiMessageSquare },
  { name: "Coding", icon: FiCode },
  { name: "PDF", icon: FiFileText },
  { name: "PPT", icon: FiMonitor },
  { name: "Image", icon: FiImage },
  { name: "Search", icon: FiGlobe },
];

const WELCOME_AGENTS = [
  { name: "Chat", description: "General reasoning", icon: FiLayers },
  { name: "Search", description: "Web research", icon: FiGlobe },
  { name: "Coding", description: "Write & debug", icon: FiCode },
  { name: "PDF", description: "Read documents", icon: FiFileText },
  { name: "PPT", description: "Create slides", icon: FiLayers },
  { name: "Image", description: "Analyze images", icon: FiPaperclip },
];

/* ------------------------------------------------------------------ */
/*  File constraints                                                   */
/* ------------------------------------------------------------------ */
const MAX_FILES = 5;
const MAX_FILE_SIZE_MB = 20;
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;

/* ------------------------------------------------------------------ */
/*  Markdown renderer for AI responses                                 */
/* ------------------------------------------------------------------ */
const markdownComponents = {
  h1: ({ children }) => (
    <h1 className="mt-5 mb-3 text-lg font-semibold text-white first:mt-0">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-5 mb-2 text-base font-semibold text-white first:mt-0">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-4 mb-2 text-sm font-semibold text-white first:mt-0">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="mt-3 mb-1.5 text-sm font-medium text-white first:mt-0">{children}</h4>
  ),
  p: ({ children }) => <p className="mb-3 leading-7 last:mb-0">{children}</p>,
  ul: ({ children }) => (
    <ul className="mb-3 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-3 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="leading-7 marker:text-slate-500">{children}</li>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-indigo-400 underline underline-offset-2 hover:text-indigo-300"
    >
      {children}
    </a>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-white">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  blockquote: ({ children }) => (
    <blockquote className="my-3 border-l-2 border-white/15 pl-4 italic text-slate-400">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-4 border-white/10" />,
  pre: ({ children }) => (
    <pre className="my-3 overflow-x-auto rounded-lg border border-white/10 bg-[#0b0d12] p-3 text-[12.5px] leading-6">
      {children}
    </pre>
  ),
  code: ({ node, className, children, ...props }) => {
    const isBlock = /language-/.test(className || "");
    if (isBlock) {
      return (
        <code className={`${className} font-mono`} {...props}>
          {children}
        </code>
      );
    }
    return (
      <code
        className="rounded bg-white/[0.08] px-1.5 py-0.5 font-mono text-[12.5px] text-indigo-300"
        {...props}
      >
        {children}
      </code>
    );
  },
  table: ({ children }) => (
    <div className="my-3 overflow-x-auto rounded-lg border border-white/10">
      <table className="w-full border-collapse text-left text-xs">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border-b border-white/10 bg-white/[0.03] px-3 py-2 font-medium text-slate-300">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-b border-white/5 px-3 py-2 align-top">{children}</td>
  ),
};

/* ------------------------------------------------------------------ */
/*  Message content renderer                                           */
/* ------------------------------------------------------------------ */
function MessageContent({ content, isUser }) {
  if (isUser) {
    return (
      <p className="whitespace-pre-wrap break-words leading-6">{content}</p>
    );
  }

  return (
    <div className="min-w-0 break-words [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={markdownComponents}
      >
        {content || ""}
      </ReactMarkdown>
    </div>
  );
}

function formatBytes(bytes) {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

/* ------------------------------------------------------------------ */
/*  Agent pill bar                                                     */
/* ------------------------------------------------------------------ */
function AgentBar({ selectedAgent, onSelect }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 px-3 pt-3">
      {AGENTS.map((agent) => {
        const Icon = agent.icon;
        const isSelected = selectedAgent === agent.name;

        return (
          <button
            key={agent.name}
            type="button"
            onClick={() => onSelect(agent.name)}
            aria-pressed={isSelected}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
              isSelected
                ? "bg-indigo-500 text-white shadow-sm shadow-indigo-500/30"
                : "bg-white/[0.04] text-slate-400 hover:bg-white/[0.08] hover:text-slate-200"
            }`}
          >
            <Icon size={13} className={isSelected ? "text-white" : ""} />
            {agent.name}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Attached file chips                                                */
/* ------------------------------------------------------------------ */
function FileChips({ files, onRemove }) {
  if (!files.length) return null;

  return (
    <div className="flex flex-wrap gap-1.5 px-3 pt-3">
      {files.map((file, index) => (
        <span
          key={`${file.name}-${index}`}
          className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] py-1 pl-2 pr-1 text-[11px] text-slate-300"
        >
          <FiFile size={12} className="text-slate-500" />
          <span className="max-w-[160px] truncate">{file.name}</span>
          <span className="text-slate-600">{formatBytes(file.size)}</span>

          <button
            type="button"
            onClick={() => onRemove(index)}
            className="ml-0.5 rounded-full p-0.5 text-slate-500 transition hover:bg-white/10 hover:text-white"
            aria-label={`Remove ${file.name}`}
          >
            <FiX size={11} />
          </button>
        </span>
      ))}
    </div>
  );
}


function ChatArea() {
  const dispatch = useDispatch();

  const { selectedConversation } = useSelector((state) => state.conversation);
  const { messages } = useSelector((state) => state.message);

  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  // ✅ Selected agent — defaults to "Auto"
  const [selectedAgent, setSelectedAgent] = useState("Auto");

  // ✅ File attachment state
  const [files, setFiles] = useState([]);
  const [fileError, setFileError] = useState("");

  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  /* Scroll to bottom whenever messages change */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* Load messages whenever selected conversation changes */
  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedConversation?._id) {
        dispatch(setMessages([]));
        return;
      }

      try {
        const data = await getMessages(selectedConversation._id);

        console.log("Messages API response:", data);

        const messageList = Array.isArray(data)
          ? data
          : data?.messages || data?.data || [];

        const sortedMessages = [...messageList].sort(
          (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
        );

        console.log("Messages for UI:", sortedMessages);

        dispatch(setMessages(sortedMessages));
      } catch (error) {
        console.error("Failed to load messages:", error);
        dispatch(setMessages([]));
      }
    };

    loadMessages();
  }, [selectedConversation?._id, dispatch]);

  /* Get existing conversation OR create a new one */
  const getOrCreateConversation = async () => {
    if (selectedConversation?._id) return selectedConversation;

    const data = await createConversation();

    if (!data) throw new Error("Failed to create conversation");

    const newConversation = data?.conversation || data;

    if (!newConversation?._id) throw new Error("Created conversation has no ID");

    dispatch(addConversations(newConversation));
    dispatch(setSelectedConversations(newConversation));

    return newConversation;
  };

  /* ✅ Agent pill click */
  const handleAgentSelect = (agentName) => {
    setSelectedAgent(agentName);
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  /* ✅ Open native file picker */
  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  /* ✅ Handle file selection from the dialog */
  const handleFileChange = (e) => {
    const picked = Array.from(e.target.files || []);
    if (!picked.length) return;

    setFileError("");

    const accepted = [];
    const rejected = [];

    for (const file of picked) {
      if (files.length + accepted.length >= MAX_FILES) {
        rejected.push(`${file.name} (max ${MAX_FILES} files)`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        rejected.push(`${file.name} (over ${MAX_FILE_SIZE_MB} MB)`);
        continue;
      }
      accepted.push(file);
    }

    if (accepted.length) setFiles((prev) => [...prev, ...accepted]);
    if (rejected.length) setFileError(`Skipped: ${rejected.join(", ")}`);

    e.target.value = "";
  };

  /* ✅ Remove a file chip */
  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setFileError("");
  };

  /* Send message */
const handleSendMessage = async () => {
  const prompt = message.trim();

  if ((!prompt && files.length === 0) || sending) return;

  const agentForThisMessage = selectedAgent.toLowerCase();
  const filesForThisMessage = [...files];

  try {
    setSending(true);

    const conversation = await getOrCreateConversation();
    const conversationId = conversation?._id;

    if (!conversationId) {
      throw new Error("Conversation ID is missing");
    }

    /* First message → create conversation title */
    if (messages.length === 0) {
      const title = createTitle(
        prompt || filesForThisMessage[0]?.name || "New chat"
      );

      dispatch(updateConversationTitle({ conversationId, title }));

      updateConversation(conversationId, title).catch((err) =>
        console.error("Failed to persist title:", err)
      );
    }

    /* Temporary user message */
    const temporaryUserMessage = {
      _id: `temp-user-${Date.now()}`,
      conversationId,
      role: "user",
      content: prompt,
      attachments: filesForThisMessage.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
      })),
      createdAt: new Date().toISOString(),
    };

    // Immediately show user's message
    dispatch(
      setMessages([...messages, temporaryUserMessage])
    );

    // Clear composer
    setMessage("");
    setFiles([]);
    setFileError("");

    /* Auto = backend decides */
    const agentPayload =
      agentForThisMessage && agentForThisMessage !== "auto"
        ? agentForThisMessage
        : undefined;

    /*
     * /chat API
     *
     * Expected response:
     * {
     *   answer: "...",
     *   images: [...]
     * }
     */
    const response = await sendMessage({
      conversationId,
      prompt,
      agent: agentPayload,
      files: filesForThisMessage,
    });

    console.log("Chat API response:", response);

    /* -----------------------------------------
       Read new backend response format
       ----------------------------------------- */

    const aiContent =
      typeof response === "string"
        ? response
        : response?.answer || "";

    const images =
      Array.isArray(response?.images)
        ? response.images
        : [];

    console.log("AI answer:", aiContent);
    console.log("AI images:", images);

    /* -----------------------------------------
       Add assistant message
       ----------------------------------------- */

    if (aiContent || images.length > 0) {
      const assistantMessage = {
        _id: `temp-ai-${Date.now()}`,
        conversationId,
        role: "assistant",
        content: aiContent,
        images,
        createdAt: new Date().toISOString(),
      };

      dispatch(
        setMessages([
          ...messages,
          temporaryUserMessage,
          assistantMessage,
        ])
      );
    }

    /* -----------------------------------------
       Re-sync messages from backend
       ----------------------------------------- */

    const updatedData = await getMessages(conversationId);

    const updatedMessages = Array.isArray(updatedData)
      ? updatedData
      : updatedData?.messages || updatedData?.data || [];

    const sortedMessages = [...updatedMessages].sort(
      (a, b) =>
        new Date(a.createdAt || 0) -
        new Date(b.createdAt || 0)
    );

    dispatch(setMessages(sortedMessages));
  } catch (error) {
    console.error("Failed to send message:", error);

    // Restore user's input
    setMessage(prompt);
    setFiles(filesForThisMessage);
  } finally {
    setSending(false);
  }
};

  /* Enter = send, Shift + Enter = newline */
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const showWelcome = !selectedConversation && messages.length === 0;
  const canSend = (message.trim().length > 0 || files.length > 0) && !sending;

  return (
    <main className="flex min-w-0 flex-1 flex-col bg-[#0d0f14]">
      {/* ---------------------------- Header ---------------------------- */}
      <header className="flex h-[68px] shrink-0 items-center justify-between border-b border-white/[0.06] px-7">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-200">
            {selectedConversation?.title || "New conversation"}
          </p>

          <p className="flex items-center gap-1.5 text-[11px] text-slate-600">
            {selectedAgent && selectedAgent !== "Auto" ? (
              <>
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                <span className="text-indigo-300">{selectedAgent}</span>
                <span className="text-slate-700">· agent</span>
              </>
            ) : (
              "Multi-Agent AI System"
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-white/[0.06] px-3 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span className="text-[11px] text-slate-500">
            {sending ? "Processing..." : "System ready"}
          </span>
        </div>
      </header>

      {/* ---------------------------- Content --------------------------- */}
      <div className="flex-1 overflow-y-auto">
        {showWelcome ? (
          <WelcomeScreen
            selectedAgent={selectedAgent}
            onAgentSelect={handleAgentSelect}
          />
        ) : (
          <div className="mx-auto max-w-4xl px-8 py-8">
            {messages.map((msg, index) => (
              <Message
                key={msg._id || `${msg.role}-${index}`}
                message={msg}
              />
            ))}

            {sending && (
              <div className="mb-6 flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.06]">
                  <FiCpu size={14} className="text-slate-400" />
                </div>

                <div className="rounded-xl border border-white/[0.06] bg-[#11141b] px-4 py-3">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <FiLoader size={13} className="animate-spin" />
                    {selectedAgent && selectedAgent !== "Auto"
                      ? `${selectedAgent} is thinking...`
                      : "Thinking..."}
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* ---------------------------- Input ----------------------------- */}
      <div className="border-t border-white/[0.06] bg-[#0b0d12] px-8 py-5">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-xl border border-white/[0.08] bg-[#11141b]">
            {/* ✅ Agent pill bar — matches your screenshot */}
            <AgentBar
              selectedAgent={selectedAgent}
              onSelect={handleAgentSelect}
            />

            {/* ✅ Attached file chips */}
            <FileChips files={files} onRemove={removeFile} />

            {/* ✅ File validation errors */}
            {fileError && (
              <p className="px-3 pt-2 text-[11px] text-rose-400">{fileError}</p>
            )}

            {/* ✅ Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              hidden
              onChange={handleFileChange}
            />

            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                selectedConversation
                  ? "Continue the conversation..."
                  : "Ask Anything..."
              }
              rows={2}
              disabled={sending}
              className="w-full resize-none bg-transparent px-4 pt-3 pb-4 text-sm text-slate-200 outline-none placeholder:text-slate-600 disabled:opacity-50"
            />

            <div className="flex items-center justify-between px-3 pb-3">
              {/* ✅ Attach — opens the hidden input */}
              <button
                type="button"
                onClick={openFilePicker}
                disabled={sending || files.length >= MAX_FILES}
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-slate-500 transition hover:bg-white/[0.05] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FiPaperclip size={14} />
                Attach
                {files.length > 0 && (
                  <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] text-slate-300">
                    {files.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={handleSendMessage}
                disabled={!canSend}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {sending ? (
                  <FiLoader size={15} className="animate-spin" />
                ) : (
                  <FiArrowUp size={16} />
                )}
              </button>
            </div>
          </div>

          <p className="mt-2 text-center text-[10px] text-slate-700">
            Press Enter to send · Shift + Enter for a new line
          </p>
        </div>
      </div>
    </main>
  );
}

function WelcomeScreen({ selectedAgent, onAgentSelect }) {
  return (
    <div className="mx-auto max-w-4xl px-8 py-12">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-600">
        AI Workspace
      </p>

      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">
        Build something intelligent.
      </h1>

      <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
        Route tasks between specialized agents for coding, research,
        documents, presentations and vision.
      </p>

      <section className="mt-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xs font-medium uppercase tracking-widest text-slate-600">
            Start with an agent
          </h2>

          <span className="text-[11px] text-slate-700">
            {selectedAgent && selectedAgent !== "Auto"
              ? `Selected: ${selectedAgent}`
              : `${WELCOME_AGENTS.length} available`}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {WELCOME_AGENTS.map((agent) => {
            const Icon = agent.icon;
            return (
              <AgentCard
                key={agent.name}
                icon={<Icon />}
                name={agent.name}
                description={agent.description}
                selected={selectedAgent === agent.name}
                onClick={() => onAgentSelect(agent.name)}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}


function Message({ message }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`mb-7 flex gap-3 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.06]">
          <FiCpu size={14} className="text-slate-400" />
        </div>
      )}

      <div
        className={`min-w-0 max-w-[75%] rounded-xl px-4 py-3 text-sm leading-6 ${
          isUser
            ? "bg-white text-black"
            : "border border-white/[0.06] bg-[#11141b] text-slate-300"
        }`}
      >
        {/* User attachments */}
        {isUser && message.attachments?.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {message.attachments.map((att, i) => (
              <span
                key={`${att.name}-${i}`}
                className="inline-flex items-center gap-1.5 rounded-md bg-black/10 px-2 py-1 text-[11px] text-slate-700"
              >
                <FiFile size={11} />

                <span className="max-w-[160px] truncate">
                  {att.name}
                </span>
              </span>
            ))}
          </div>
        )}

        {/* AI text response */}
        {message.content && (
          <MessageContent
            content={message.content}
            isUser={isUser}
          />
        )}

        {/* AI generated/search images */}
        {!isUser && message.images?.length > 0 && (
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {message.images.map((image, index) => {
              const imageUrl =
                typeof image === "string"
                  ? image
                  : image?.url ||
                    image?.image ||
                    image?.src;

              if (!imageUrl) return null;

              return (
                <a
                  key={`${imageUrl}-${index}`}
                  href={imageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block overflow-hidden rounded-lg border border-white/[0.08] bg-black/20"
                >
                  <img
                    src={imageUrl}
                    alt={`AI result ${index + 1}`}
                    loading="lazy"
                    className="h-auto max-h-[320px] w-full object-cover transition hover:scale-[1.02]"
                  />
                </a>
              );
            })}
          </div>
        )}
      </div>

      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/20">
          <FiUser size={14} className="text-indigo-300" />
        </div>
      )}
    </div>
  );
}



function AgentCard({ icon, name, description, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group rounded-xl border p-4 text-left transition duration-200 hover:-translate-y-0.5 ${
        selected
          ? "border-indigo-400/60 bg-indigo-500/[0.08] ring-1 ring-indigo-400/40"
          : "border-white/[0.06] bg-[#10131a] hover:border-white/[0.12] hover:bg-[#141821]"
      }`}
    >
      <div
        className={`mb-4 flex h-9 w-9 items-center justify-center rounded-lg ${
          selected
            ? "bg-indigo-500/20 text-indigo-200"
            : "bg-white/[0.05] text-slate-400 group-hover:text-white"
        }`}
      >
        {icon}
      </div>

      <p className="text-sm font-medium text-white">{name}</p>
      <p className="mt-1 text-xs text-slate-600">{description}</p>
    </button>
  );
}

function createTitle(prompt) {
  const cleaned = prompt.replace(/\s+/g, " ").trim();
  if (cleaned.length <= 40) return cleaned;
  return cleaned.slice(0, 40) + "...";
}

export default ChatArea;