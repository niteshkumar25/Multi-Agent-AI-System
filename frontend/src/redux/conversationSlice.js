import {createSlice} from '@reduxjs/toolkit'

const conversationSlice = createSlice({
  name: 'conversation',
  initialState: {
    conversations: []
  },
  reducers: {
    setConversation:(state,action)=>{
        state.conversations=action.payload
    },
    addConversations:(state,actions)=>{
        state.conversations.unshift(actions.payload)
    }
  }
})

export const {  setConversation,addConversations, } = conversationSlice.actions
export default conversationSlice.reducer