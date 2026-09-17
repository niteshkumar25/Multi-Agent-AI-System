import React, { useEffect, useState } from "react";

import {
  FiHome,
  FiFolder,
  FiSettings,
  FiPlus,
  FiChevronRight,
  FiMessageSquare,
  FiLoader,
  FiCreditCard,
  FiLogOut,
} from "react-icons/fi";

import { useDispatch, useSelector } from "react-redux";

import {
  setConversation,
  addConversations,
  setSelectedConversations,
} from "../redux/conversationSlice";

import getCurrentUser from "../features/getCurrentUser";
import logoutUser from "../features/logout";
import { getConversations } from "../features/getConversations";
import { createConversation } from "../features/createConversation";
import { setUserData } from "../redux/userSlice";

function SlideBar() {
  const dispatch = useDispatch();

  const {
    conversations,
    selectedConversation,
  } = useSelector((state) => state.conversation);

  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  const [loggingOut, setLoggingOut] = useState(false);

  /*
   * Load conversations + current user
   */
  useEffect(() => {
    const loadConversations = async () => {
      try {
        setLoading(true);

        const data = await getConversations();

        const conversationList = Array.isArray(data)
          ? data
          : data?.conversations ||
            data?.data ||
            [];

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

    const loadCurrentUser = async () => {
      try {
        setUserLoading(true);

        const data = await getCurrentUser();

        console.log("User API response:", data);

        /*
         * Handles different possible API responses:
         *
         * { user: {...} }
         *
         * { data: {...} }
         *
         * {...}
         */
        const currentUser =
          data?.user ||
          data?.data ||
          data;

        console.log(
          "Current user:",
          currentUser
        );

        setUser(currentUser);
      } catch (error) {
        console.error(
          "Failed to load current user:",
          error
        );
      } finally {
        setUserLoading(false);
      }
    };

    loadConversations();
    loadCurrentUser();
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

      const newConversation =
        data?.conversation ||
        data?.data ||
        data;

      dispatch(
        addConversations(newConversation)
      );

      // Automatically select new conversation
      dispatch(
        setSelectedConversations(
          newConversation
        )
      );
    } catch (error) {
      console.error(
        "Failed to create conversation:",
        error
      );
    } finally {
      setCreating(false);
    }
  };

  /*
   * Logout
   */
  const handleLogout = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);

      await logoutUser();

      /*
       * Clear local user state
       */
      setUser(null);

      /*
       * Optional:
       * Clear selected conversation
       */
      dispatch(
        setSelectedConversations(null)
      );

      /*
       * Redirect to login
       */
      window.location.href = "/";
    } catch (error) {
      console.error(
        "Failed to logout:",
        error
      );
    } finally {
      setLoggingOut(false);
    }
  };

  /*
   * User name
   */
  const userName =
    user?.fullName ||
    user?.name ||
    user?.displayName ||
    "User";

  /*
   * User avatar
   */
  const userAvatar =
    user?.avatar ||
    user?.photoURL ||
    user?.profilePicture ||
    user?.picture ||
    null;

  /*
   * User initials
   */
  const userInitials = userName
    .split(" ")
    .map((name) => name[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

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
          type="button"
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

          {creating
            ? "Creating..."
            : "New Chat"}

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

        {/* Header */}
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
        {!loading &&
          conversations.length === 0 && (
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
        {!loading &&
          conversations.length > 0 && (
            <div className="space-y-1">

              {conversations.map(
                (conversation) => (
                  <ConversationItem
                    key={conversation._id}
                    conversation={conversation}
                    selectedConversation={
                      selectedConversation
                    }
                    onSelect={() =>
                      dispatch(
                        setSelectedConversations(
                          conversation
                        )
                      )
                    }
                  />
                )
              )}

            </div>
          )}

      </div>

      {/* Bottom */}
      <div className="border-t border-white/[0.06] p-3">

        {/* Settings */}
        <NavItem
          icon={<FiSettings />}
          text="Settings"
        />

        {/* User */}
        <div className="mt-2 flex items-center gap-2 rounded-lg px-2 py-2">

          {/* Avatar */}
          {userLoading ? (

            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.06]">

              <FiLoader
                size={13}
                className="animate-spin text-slate-500"
              />

            </div>

          ) : userAvatar ? (

            <img
              src={userAvatar}
              alt={userName}
              className="h-8 w-8 shrink-0 rounded-full object-cover"
            />

          ) : (

            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-medium text-indigo-300">
              {userInitials}
            </div>

          )}

          {/* User information */}
          <div className="min-w-0 flex-1">

            <p className="truncate text-xs font-medium text-slate-200">

              {userLoading
                ? "Loading..."
                : userName}

            </p>

            <p className="truncate text-[10px] text-slate-600">
              Free Plan
            </p>

          </div>

          {/* Credits */}
          <button
            type="button"
            title="Credits"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-500 transition hover:bg-white/[0.06] hover:text-white"
          >
            <FiCreditCard
              size={14}
            />
          </button>

          {/* Logout */}
          <button
            type="button"
            title="Logout"
            onClick={()=>{
              logoutUser()
              dispatch(setUserData(null))
            }}
            disabled={loggingOut}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-500 transition hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
          >

            {loggingOut ? (
              <FiLoader
                size={14}
                className="animate-spin"
              />
            ) : (
              <FiLogOut
                size={14}
              />
            )}

          </button>

        </div>

      </div>

    </aside>
  );
}


/*
 * Navigation item
 */
function NavItem({
  icon,
  text,
  active,
}) {
  return (
    <button
      type="button"
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
function ConversationItem({
  conversation,
  selectedConversation,
  onSelect,
}) {
  const title =
    conversation.title ||
    "New conversation";

  const isSelected =
    selectedConversation?._id ===
    conversation._id;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs transition ${
        isSelected
          ? "bg-white/[0.08] text-white"
          : "text-slate-500 hover:bg-white/[0.04] hover:text-slate-200"
      }`}
    >

      <FiMessageSquare
        size={13}
        className={`shrink-0 ${
          isSelected
            ? "text-white"
            : "text-slate-700 group-hover:text-slate-500"
        }`}
      />

      <span className="min-w-0 flex-1 truncate">
        {title}
      </span>

      <FiChevronRight
        size={13}
        className={`shrink-0 transition ${
          isSelected
            ? "text-slate-400 opacity-100"
            : "opacity-0 group-hover:opacity-100"
        }`}
      />

    </button>
  );
}

export default SlideBar;