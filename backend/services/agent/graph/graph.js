import {StateGraph} from "@langchain/langgraph"
import { agentState } from "./state.js"
import { router } from "./router.js"
import { chatAgent } from "../agents/chat.agent"
import { searchAgent } from "../agents/search.agent"
import { codingAgent } from "../agents/coding.agent"
import { pptAgent } from "../agents/ppt.agent"
import { pdfAgent } from "../agents/pdf.agent"
import { vision } from "../agents/vision.agent.js"

const workflow = new StateGraph(agentState)

workflow.addNode("router", router)
workflow.addNode("chat", chatAgent)
workflow.addNode("search", searchAgent)
workflow.addNode("coding", codingAgent)
workflow.addNode("ppt", pptAgent)
workflow.addNode("pdf", pdfAgent)
workflow.addNode("vision", vision)

workflow.addEdge("__start__","router")
workflow.addConditionalEdges("router", (state)=>{
    switch(state.agent) {
        case "chat":
            return "chat"
        case "search":
            return "search"
        case "coding":
            return "coding"
        case "ppt":
            return "ppt"
        case "pdf":
            return "pdf"
        case "vision":
            return "vision"
        
    }
})