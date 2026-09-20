import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  FiArrowUp,
  FiCode,
  FiGlobe,
  FiFileText,
  FiLayers,
  FiPaperclip,
  FiLoader,
  FiMessageSquare,
} from "react-icons/fi";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  setMessages,
  addMessage,
  clearMessages,
} from "../redux/messageSlice";

import {
  updateConversationTitle,
} from "../redux/conversationSlice";

import getMessages from "../features/getMessages";
import sendMessage from "../features/sendMessage";
import updateConversation from "../features/updateConversation";

function ChatArea() {
  const dispatch = useDispatch();

  const {
    selectedConversation,
  } = useSelector(
    (state) =>
      state.conversation
  );

  const {
    messages,
  } = useSelector(
    (state) => state.message
  );

  const [message, setMessage] =
    useState("");

  const [loadingMessages, setLoadingMessages] =
    useState(false);

  const [sending, setSending] =
    useState(false);

  const messagesEndRef =
    useRef(null);

  /*
   * Load messages whenever
   * selected conversation changes
   */
  useEffect(() => {
    if (!selectedConversation?._id) {
      dispatch(clearMessages());
      return;
    }

    const loadMessages =
      async () => {
        try {
          setLoadingMessages(true);

          const data =
            await getMessages(
              selectedConversation._id
            );

          const messageList =
            Array.isArray(data)
              ? data
              : data?.messages || [];

          dispatch(
            setMessages(
              messageList
            )
          );

        } catch (error) {
          console.error(
            "Failed to load messages:",
            error
          );

          dispatch(
            clearMessages()
          );

        } finally {
          setLoadingMessages(
            false
          );
        }
      };

    loadMessages();

  }, [
    selectedConversation?._id,
    dispatch,
  ]);

  /*
   * Auto scroll
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, sending]);

  /*
   * Send message
   */
  const handleSendMessage =
    async () => {
      const prompt =
        message.trim();

      if (
        !prompt ||
        sending ||
        !selectedConversation?._id
      ) {
        return;
      }

      const conversationId =
        selectedConversation._id;

      /*
       * Immediately show user message
       */
      const userMessage = {
        _id:
          `temp-user-${Date.now()}`,

        conversationId,

        role: "user",

        content: prompt,

        createdAt:
          new Date().toISOString(),
      };

      dispatch(
        addMessage(
          userMessage
        )
      );

      setMessage("");

      try {
        setSending(true);

        /*
         * Call backend
         */
        const data =
          await sendMessage({
            conversationId,
            prompt,
          });

        /*
         * Backend returns:
         *
         * {
         *   response: "..."
         * }
         */
        const response =
          data?.response ||
          data;

        /*
         * Add assistant message
         */
        const assistantMessage = {
          _id:
            `temp-ai-${Date.now()}`,

          conversationId,

          role: "assistant",

          content: response,

          createdAt:
            new Date().toISOString(),
        };

        dispatch(
          addMessage(
            assistantMessage
          )
        );

        /*
         * First message:
         * create conversation title
         */
        if (
          messages.length === 0
        ) {
          const title =
            createTitle(prompt);

          try {
            await updateConversation(
              conversationId,
              title
            );

            dispatch(
              updateConversationTitle({
                conversationId,
                title,
              })
            );

          } catch (error) {
            console.error(
              "Failed to update conversation title:",
              error
            );
          }
        }

      } catch (error) {
        console.error(
          "Failed to send message:",
          error
        );

        /*
         * Optional error message
         */
        dispatch(
          addMessage({
            _id:
              `error-${Date.now()}`,

            conversationId,

            role: "assistant",

            content:
              "Sorry, something went wrong while processing your message.",

            createdAt:
              new Date().toISOString(),

            error: true,
          })
        );

      } finally {
        setSending(false);
      }
    };

  /*
   * Enter to send
   */
  const handleKeyDown =
    (event) => {
      if (
        event.key === "Enter" &&
        !event.shiftKey
      ) {
        event.preventDefault();

        handleSendMessage();
      }
    };

  /*
   * No conversation selected
   */
  if (!selectedConversation) {
    return (
      <main className="flex min-w-0 flex-1 flex-col">

        <header className="flex h-[68px] shrink-0 items-center border-b border-white/[0.06] px-7">

          <div>
            <p className="text-sm font-medium">
              Workspace
            </p>

            <p className="text-[11px] text-slate-600">
              Select a conversation
            </p>
          </div>

        </header>

        <div className="flex flex-1 items-center justify-center">

          <div className="text-center">

            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.04]">
              <FiMessageSquare
                size={20}
                className="text-slate-600"
              />
            </div>

            <h2 className="text-sm font-medium text-slate-300">
              Start a new conversation
            </h2>

            <p className="mt-2 text-xs text-slate-600">
              Create a new chat from the sidebar.
            </p>

          </div>

        </div>

      </main>
    );
  }

  return (
    <main className="flex min-w-0 flex-1 flex-col">

      {/* Header */}
      <header className="flex h-[68px] shrink-0 items-center justify-between border-b border-white/[0.06] px-7">

        <div className="min-w-0">

          <p className="truncate text-sm font-medium text-slate-200">
            {selectedConversation.title ||
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
              ? "Thinking..."
              : "System ready"}
          </span>

        </div>

      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">

        <div className="mx-auto max-w-4xl px-8 py-8">

          {loadingMessages ? (

            <div className="flex items-center justify-center py-20">

              <FiLoader
                size={18}
                className="animate-spin text-slate-600"
              />

            </div>

          ) : messages.length === 0 ? (

            <EmptyConversation />

          ) : (

            <div className="space-y-6">

              {messages.map(
                (msg) => (
                  <Message
                    key={msg._id}
                    message={msg}
                  />
                )
              )}

              {sending && (
                <div className="flex gap-3">

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.06]">

                    <FiLayers
                      size={14}
                      className="text-slate-400"
                    />

                  </div>

                  <div className="rounded-xl bg-[#11141b] px-4 py-3">

                    <div className="flex gap-1">

                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-600" />

                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-600 [animation-delay:150ms]" />

                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-600 [animation-delay:300ms]" />

                    </div>

                  </div>

                </div>
              )}

              <div
                ref={
                  messagesEndRef
                }
              />

            </div>

          )}

        </div>

      </div>

      {/* Input */}
      <div className="border-t border-white/[0.06] bg-[#0b0d12] px-8 py-5">

        <div className="mx-auto max-w-4xl">

          <div className="rounded-xl border border-white/[0.08] bg-[#11141b]">

            <textarea
              value={message}
              onChange={(e) =>
                setMessage(
                  e.target.value
                )
              }
              onKeyDown={
                handleKeyDown
              }
              placeholder="Message the agent..."
              rows={2}
              disabled={sending}
              className="w-full resize-none bg-transparent px-4 py-4 text-sm outline-none placeholder:text-slate-600 disabled:opacity-50"
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
            The router automatically selects the best agent for your task.
          </p>

        </div>

      </div>

    </main>
  );
}


/*
 * Individual message
 */
function Message({
  message,
}) {
  const isUser =
    message.role === "user";

  return (
    <div
      className={`flex gap-3 ${
        isUser
          ? "justify-end"
          : "justify-start"
      }`}
    >

      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.06]">

          <FiLayers
            size={14}
            className="text-slate-400"
          />

        </div>
      )}

      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-6 ${
          isUser
            ? "bg-white text-black"
            : "bg-[#11141b] text-slate-300"
        }`}
      >

        <div className="whitespace-pre-wrap">
          {message.content}
        </div>

      </div>

      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/20 text-[10px] font-medium text-indigo-300">
          You
        </div>
      )}

    </div>
  );
}


/*
 * Empty conversation
 */
function EmptyConversation() {
  return (
    <div className="flex min-h-[55vh] items-center justify-center">

      <div className="text-center">

        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.04]">

          <FiLayers
            size={20}
            className="text-slate-600"
          />

        </div>

        <h1 className="text-xl font-medium text-slate-200">
          Start building
        </h1>

        <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
          Ask the AI system anything. Your request will be routed to the appropriate specialized agent.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-2 text-left md:grid-cols-3">

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

      </div>

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
}) {
  return (
    <button
      type="button"
      className="group rounded-xl border border-white/[0.06] bg-[#10131a] p-3 text-left transition duration-200 hover:-translate-y-0.5 hover:border-white/[0.12] hover:bg-[#141821]"
    >

      <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.05] text-slate-400 group-hover:text-white">
        {icon}
      </div>

      <p className="text-xs font-medium">
        {name}
      </p>

      <p className="mt-1 text-[10px] text-slate-600">
        {description}
      </p>

    </button>
  );
}


/*
 * Generate conversation title
 */
function createTitle(prompt) {
  const cleaned =
    prompt
      .replace(/\s+/g, " ")
      .trim();

  if (cleaned.length <= 40) {
    return cleaned;
  }

  return (
    cleaned.slice(0, 40) +
    "..."
  );
}

export default ChatArea;