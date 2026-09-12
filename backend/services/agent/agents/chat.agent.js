import { getModel } from "../config/llmModels"

export const chatAgent  = async(state)=>{
    const llm = await getModel("chat");
    const systemPrompt = "Your Multi Ai Agent, An Intelligent AI Assistant"
    const response = llm.invoke([
        {
            role:"system",
            content:systemPrompt
        },{
            role:"human",
            content:state.prompt
        }
    ])

    return {
        ...state,
       aiResponse:await response.content 

    }
}