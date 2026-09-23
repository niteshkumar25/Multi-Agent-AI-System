import React, { useEffect, useRef, useState } from "react";

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
} from "react-icons/fi";

import { useDispatch, useSelector } from "react-redux";

import {
  addConversations,
  setSelectedConversations,
  updateConversation
} from "../redux/conversationSlice";

import { setMessages } from "../redux/messageSlice";

import { createConversation } from "../features/createConversation";
import getMessages from "../features/getMessages";
import sendMessage from "../features/sendMessage";

function ChatArea() {
  const dispatch = useDispatch();

  const { selectedConversation } = useSelector(
    (state) => state.conversation
  );

  const { messages } = useSelector(
    (state) => state.message
  );

  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);

  /*
   * Scroll to bottom whenever messages change
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  /*
   * Load messages whenever selected conversation changes
   */
  useEffect(() => {
    const loadMessages = async () => {
      /*
       * No conversation selected
       */
      if (!selectedConversation?._id) {
        dispatch(setMessages([]));
        return;
      }

      try {
        const data = await getMessages(
          selectedConversation._id
        );

        console.log(
          "Messages API response:",
          data
        );

        /*
         * Support different response formats
         */
        const messageList = Array.isArray(data)
          ? data
          : data?.messages ||
            data?.data ||
            [];

        /*
         * Sort oldest -> newest
         *
         * This prevents messages appearing
         * in reverse order.
         */
        const sortedMessages = [...messageList].sort(
          (a, b) => {
            return (
              new Date(a.createdAt || 0) -
              new Date(b.createdAt || 0)
            );
          }
        );

        console.log(
          "Messages for UI:",
          sortedMessages
        );

        dispatch(
          setMessages(sortedMessages)
        );
      } catch (error) {
        console.error(
          "Failed to load messages:",
          error
        );

        dispatch(setMessages([]));
      }
    };

    loadMessages();
  }, [
    selectedConversation?._id,
    dispatch,
  ]);

  /*
   * Get existing conversation OR create
   * a new conversation.
   */
  const getOrCreateConversation =
    async () => {
      /*
       * Existing conversation
       */
      if (selectedConversation?._id) {
        return selectedConversation;
      }

      /*
       * Create new conversation
       */
      const data =
        await createConversation();

      if (!data) {
        throw new Error(
          "Failed to create conversation"
        );
      }

      const newConversation =
        data?.conversation || data;

      if (!newConversation?._id) {
        throw new Error(
          "Created conversation has no ID"
        );
      }

      /*
       * Add conversation to sidebar
       */
      dispatch(
        addConversations(
          newConversation
        )
      );

      /*
       * Select conversation immediately
       */
      dispatch(
        setSelectedConversations(
          newConversation
        )
      );

      return newConversation;
    };

  /*
   * Send message
   */
  const handleSendMessage = async () => {
    const prompt = message.trim();

    if (!prompt || sending) {
      return;
    }

    try {
      setSending(true);

      /*
       * Get or create conversation
       */
      const conversation =
        await getOrCreateConversation();

      const conversationId =
        conversation?._id;

      if (!conversationId) {
        throw new Error(
          "Conversation ID is missing"
        );
      }

      /*
       * Create temporary user message
       *
       * THIS FIXES THE FIRST MESSAGE ISSUE.
       */
      const temporaryUserMessage = {
        _id: `temp-user-${Date.now()}`,
        conversationId,
        role: "user",
        content: prompt,
        createdAt:
          new Date().toISOString(),
      };

      /*
       * Immediately show user message
       */
      dispatch(
        setMessages([
          ...messages,
          temporaryUserMessage,
        ])
      );

      /*
       * Clear input
       */
      setMessage("");

      /*
       * Send to backend
       */
      const response =
        await sendMessage({
          conversationId,
          prompt,
        });

      console.log(
        "Chat API response:",
        response
      );

      /*
       * Backend currently returns:
       *
       * res.status(200).json(response)
       *
       * Therefore response can be:
       * string
       * or object
       */
      const aiContent =
        typeof response === "string"
          ? response
          : response?.response ||
            response?.content ||
            response?.message ||
            "";

      /*
       * Show AI response immediately
       */
      if (aiContent) {
        const assistantMessage = {
          _id: `temp-ai-${Date.now()}`,
          conversationId,
          role: "assistant",
          content: aiContent,
          createdAt:
            new Date().toISOString(),
        };

        /*
         * IMPORTANT:
         * Use the current message list
         * including the temporary user message.
         */
        dispatch(
          setMessages([
            ...messages,
            temporaryUserMessage,
            assistantMessage,
          ])
        );
      }

      /*
       * Fetch actual messages from database.
       *
       * This replaces temporary messages
       * with real MongoDB messages.
       */
      const updatedData =
        await getMessages(
          conversationId
        );

      const updatedMessages =
        Array.isArray(updatedData)
          ? updatedData
          : updatedData?.messages ||
            updatedData?.data ||
            [];

      /*
       * Always sort oldest -> newest
       */
      const sortedMessages =
        [...updatedMessages].sort(
          (a, b) => {
            return (
              new Date(a.createdAt || 0) -
              new Date(b.createdAt || 0)
            );
          }
        );

      dispatch(
        setMessages(sortedMessages)
      );

    } catch (error) {
      console.error(
        "Failed to send message:",
        error
      );

      /*
       * Put the message back into input
       * if request failed.
       */
      setMessage(prompt);

    } finally {
      setSending(false);
    }
  };

  /*
   * Enter = send
   * Shift + Enter = new line
   */
  const handleKeyDown = (e) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {
      e.preventDefault();

      handleSendMessage();
    }
  };

  /*
   * Empty state
   */
  const showWelcome =
    !selectedConversation &&
    messages.length === 0;

  return (
    <main className="flex min-w-0 flex-1 flex-col bg-[#0d0f14]">

      {/* Header */}
      <header className="flex h-[68px] shrink-0 items-center justify-between border-b border-white/[0.06] px-7">

        <div>
          <p className="text-sm font-medium text-slate-200">
            {selectedConversation?.title ||
              "New conversation"}
          </p>

          <p className="text-[11px] text-slate-600">
            Multi-Agent AI System
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-white/[0.06] px-3 py-1.5">

          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

          <span className="text-[11px] text-slate-500">
            {sending
              ? "Processing..."
              : "System ready"}
          </span>

        </div>

      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">

        {showWelcome ? (

          <WelcomeScreen
            onAgentSelect={(text) => {
              setMessage(text);

              setTimeout(() => {
                textareaRef.current?.focus();
              }, 0);
            }}
          />

        ) : (

          <div className="mx-auto max-w-4xl px-8 py-8">

            {messages.map(
              (msg, index) => (
                <Message
                  key={
                    msg._id ||
                    `${msg.role}-${index}`
                  }
                  message={msg}
                />
              )
            )}

            {/* AI loading */}
            {sending && (
              <div className="mb-6 flex gap-3">

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.06]">
                  <FiCpu
                    size={14}
                    className="text-slate-400"
                  />
                </div>

                <div className="rounded-xl border border-white/[0.06] bg-[#11141b] px-4 py-3">

                  <div className="flex items-center gap-2 text-xs text-slate-500">

                    <FiLoader
                      size={13}
                      className="animate-spin"
                    />

                    Thinking...

                  </div>

                </div>

              </div>
            )}

            <div ref={messagesEndRef} />

          </div>
        )}

      </div>

      {/* Input */}
      <div className="border-t border-white/[0.06] bg-[#0b0d12] px-8 py-5">

        <div className="mx-auto max-w-4xl">

          <div className="rounded-xl border border-white/[0.08] bg-[#11141b]">

            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder={
                selectedConversation
                  ? "Continue the conversation..."
                  : "Describe what you want to build..."
              }
              rows={2}
              disabled={sending}
              className="w-full resize-none bg-transparent px-4 py-4 text-sm text-slate-200 outline-none placeholder:text-slate-600 disabled:opacity-50"
            />

            <div className="flex items-center justify-between px-3 pb-3">

              <button
                type="button"
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-slate-600 transition hover:bg-white/[0.05] hover:text-white"
              >
                <FiPaperclip
                  size={14}
                />

                Attach
              </button>

              <button
                type="button"
                onClick={
                  handleSendMessage
                }
                disabled={
                  !message.trim() ||
                  sending
                }
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
              >

                {sending ? (
                  <FiLoader
                    size={15}
                    className="animate-spin"
                  />
                ) : (
                  <FiArrowUp
                    size={16}
                  />
                )}

              </button>

            </div>

          </div>

          <p className="mt-2 text-center text-[10px] text-slate-700">
            Press Enter to send · Shift +
            Enter for a new line
          </p>

        </div>

      </div>

    </main>
  );
}

/*
 * Welcome screen
 */
function WelcomeScreen({
  onAgentSelect,
}) {
  return (
    <div className="mx-auto max-w-4xl px-8 py-12">

      <p className="text-xs uppercase tracking-[0.2em] text-slate-600">
        AI Workspace
      </p>

      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">
        Build something intelligent.
      </h1>

      <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
        Route tasks between specialized
        agents for coding, research,
        documents, presentations and
        vision.
      </p>

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
            onClick={() =>
              onAgentSelect("")
            }
          />

          <AgentCard
            icon={<FiGlobe />}
            name="Search"
            description="Web research"
            onClick={() =>
              onAgentSelect("")
            }
          />

          <AgentCard
            icon={<FiCode />}
            name="Coding"
            description="Write & debug"
            onClick={() =>
              onAgentSelect("")
            }
          />

          <AgentCard
            icon={<FiFileText />}
            name="PDF"
            description="Read documents"
            onClick={() =>
              onAgentSelect("")
            }
          />

          <AgentCard
            icon={<FiLayers />}
            name="PPT"
            description="Create slides"
            onClick={() =>
              onAgentSelect("")
            }
          />

          <AgentCard
            icon={<FiPaperclip />}
            name="Vision"
            description="Analyze images"
            onClick={() =>
              onAgentSelect("")
            }
          />

        </div>

      </section>

    </div>
  );
}

/*
 * Message
 */
function Message({ message }) {
  /*
   * Your backend uses "user" and
   * "assistant" for normal messages.
   *
   * Also support "assistent" because
   * your backend previously had that typo.
   */
  const isUser =
    message.role === "user";

  return (
    <div
      className={`mb-7 flex gap-3 ${
        isUser
          ? "justify-end"
          : "justify-start"
      }`}
    >

      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.06]">
          <FiCpu
            size={14}
            className="text-slate-400"
          />
        </div>
      )}

      <div
        className={`max-w-[75%] rounded-xl px-4 py-3 text-sm leading-6 ${
          isUser
            ? "bg-white text-black"
            : "border border-white/[0.06] bg-[#11141b] text-slate-300"
        }`}
      >
        {message.content}
      </div>

      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/20">
          <FiUser
            size={14}
            className="text-indigo-300"
          />
        </div>
      )}

    </div>
  );
}

/*
 * Agent card
 */
function AgentCard({
  icon,
  name,
  description,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group rounded-xl border border-white/[0.06] bg-[#10131a] p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-white/[0.12] hover:bg-[#141821]"
    >

      <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.05] text-slate-400 group-hover:text-white">
        {icon}
      </div>

      <p className="text-sm font-medium text-white">
        {name}
      </p>

      <p className="mt-1 text-xs text-slate-600">
        {description}
      </p>

    </button>
  );
}

export default ChatArea;