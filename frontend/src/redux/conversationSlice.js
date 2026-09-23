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

    updateConversation: (state, action) => {
      const index = state.conversations.findIndex(
        (conversation) => conversation._id === action.payload._id
      );

      if (index !== -1) {
        state.conversations[index] = {
          ...state.conversations[index],
          ...action.payload,
        };
      }

      if (
        state.selectedConversation?._id === action.payload._id
      ) {
        state.selectedConversation = {
          ...state.selectedConversation,
          ...action.payload,
        };
      }
    },
  },
});

export const {
  setConversation,
  addConversations,
  setSelectedConversations,
  updateConversation,
} = conversationSlice.actions;

export default conversationSlice.reducer;