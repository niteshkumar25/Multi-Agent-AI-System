import React, { useEffect, useState } from "react";
import {
  FiHome,
  FiFolder,
  FiClock,
  FiSettings,
  FiPlus,
  FiChevronRight,
  FiMessageSquare,
  FiLoader,
} from "react-icons/fi";

import { useDispatch, useSelector } from "react-redux";

import {
  setConversation,
  addConversations,
} from "../../redux/conversationSlice";

import { getConversations } from "../api/getConversations";
import { createConversation } from "../api/createConversation";

function SlideBar() {
  const dispatch = useDispatch();

  const { conversations } = useSelector(
    (state) => state.conversation
  );

  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  /*
   * Get conversations when Sidebar loads
   */
  useEffect(() => {
    const loadConversations = async () => {
      try {
        setLoading(true);

        const data = await getConversations();

        /*
         * Depending on your backend response,
         * data may be:
         *
         * [
         *   {...},
         *   {...}
         * ]
         *
         * OR:
         *
         * {
         *   conversations: [...]
         * }
         */

        const conversationList = Array.isArray(data)
          ? data
          : data?.conversations || [];

        dispatch(setConversation(conversationList));
      } catch (error) {
        console.error(
          "Failed to load conversations:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [dispatch]);

  /*
   * Create new conversation
   */
  const handleNewChat = async () => {
    if (creating) return;

    try {
      setCreating(true);

      const data = await createConversation();

      if (!data) return;

      /*
       * If backend returns:
       *
       * {
       *   conversation: {...}
       * }
       *
       * use data.conversation
       *
       * Otherwise use data directly.
       */
      const newConversation =
        data?.conversation || data;

      dispatch(addConversations(newConversation));

    } catch (error) {
      console.error(
        "Failed to create conversation:",
        error
      );
    } finally {
      setCreating(false);
    }
  };

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

      {/* New Chat */}
      <div className="p-3">

        <button
          onClick={handleNewChat}
          disabled={creating}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-3 py-2.5 text-sm font-medium text-black transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {creating ? (
            <FiLoader
              size={16}
              className="animate-spin"
            />
          ) : (
            <FiPlus size={17} />
          )}

          {creating ? "Creating..." : "New Chat"}
        </button>

      </div>

      {/* Navigation */}
      <div className="px-3">

        <NavItem
          icon={<FiHome />}
          text="Overview"
          active
        />

        <NavItem
          icon={<FiFolder />}
          text="Projects"
        />

      </div>

      {/* Conversations */}
      <div className="mt-6 flex-1 overflow-y-auto px-3">

        <div className="mb-2 flex items-center justify-between px-2">

          <span className="text-[10px] font-semibold tracking-widest text-slate-600">
            HISTORY
          </span>

          <span className="text-[10px] text-slate-700">
            {conversations.length}
          </span>

        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center gap-2 px-3 py-3 text-xs text-slate-600">

            <FiLoader
              size={13}
              className="animate-spin"
            />

            Loading conversations...

          </div>
        )}

        {/* Empty */}
        {!loading && conversations.length === 0 && (
          <div className="px-3 py-4 text-center">

            <FiMessageSquare
              className="mx-auto mb-2 text-slate-700"
              size={20}
            />

            <p className="text-xs text-slate-600">
              No conversations yet
            </p>

            <p className="mt-1 text-[10px] text-slate-700">
              Start a new chat
            </p>

          </div>
        )}

        {/* Conversations */}
        {!loading && conversations.length > 0 && (
          <div className="space-y-1">

            {conversations.map((conversation) => (
              <ConversationItem
                key={
                  conversation._id ||
                  conversation.id ||
                  conversation.conversationId
                }
                conversation={conversation}
              />
            ))}

          </div>
        )}

      </div>

      {/* Bottom */}
      <div className="border-t border-white/[0.06] p-3">

        <NavItem
          icon={<FiSettings />}
          text="Settings"
        />

        {/* User */}
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

/*
 * Navigation item
 */
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

/*
 * Conversation item
 */
function ConversationItem({ conversation }) {
  /*
   * Adjust these depending on your backend model.
   */
  const title =
    conversation.title ||
    conversation.name ||
    conversation.message ||
    "New conversation";

  return (
    <button
      className="
        group flex w-full items-center gap-2
        rounded-lg px-3 py-2
        text-left text-xs text-slate-500
        transition
        hover:bg-white/[0.04]
        hover:text-slate-200
      "
    >

      <FiMessageSquare
        size={13}
        className="shrink-0 text-slate-700 group-hover:text-slate-500"
      />

      <span className="min-w-0 flex-1 truncate">
        {title}
      </span>

      <FiChevronRight
        size={13}
        className="shrink-0 opacity-0 transition group-hover:opacity-100"
      />

    </button>
  );
}

export default SlideBar;