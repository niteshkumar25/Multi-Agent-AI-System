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
    addConversations: (state, actions) => {
      state.conversations.unshift(actions.payload);
    },
    setSelectedConversations: (state, actions) => {
      state.selectedConversation = actions.payload;
    },
  },
});

export const { setConversation, addConversations, setSelectedConversations} = conversationSlice.actions;
export default conversationSlice.reducer;
