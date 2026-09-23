import { createSlice } from "@reduxjs/toolkit";

const conversationSlice = createSlice({
  name: "conversation",

  initialState: {
    conversations: [],
    selectedConversation: null,
  },

  reducers: {
    setConversation: (state, action) => {
      state.conversations = action.payload;
    },

    addConversations: (state, action) => {
      state.conversations.unshift(action.payload);
    },

    setSelectedConversations: (state, action) => {
      state.selectedConversation = action.payload;
    },

      updateConversationTitle: (state, action) => {
        const { conversationId, title } = action.payload;
        const convo = state.conversations.find(c => c._id === conversationId);
        if (convo) convo.title = title;
        if (state.selectedConversation?._id === conversationId) {
          state.selectedConversation.title = title;
        }
      }
  },
});

export const {
  setConversation,
  addConversations,
  setSelectedConversations,
  updateConversationTitle,
} = conversationSlice.actions;

export default conversationSlice.reducer;