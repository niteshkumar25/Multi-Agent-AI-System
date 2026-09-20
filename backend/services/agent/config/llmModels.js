import { ChatGroq } from "@langchain/groq"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import dotenv from "dotenv";
dotenv.config();


const groq = new ChatGroq({
    model: "openai/gpt-oss-120b",
    apiKey:process.env.GROQ_API_KEY,
    // temperature: 0.7,
    // maxTokens: 2048,                     // ← Critical: enough for reasoning + output
    // reasoningEffort: "low",
})


const gemini = new ChatGoogleGenerativeAI({
    model: "gemini-3.1-pro-preview",
    apiKey:process.env.GOOGLE_API_KEY
})


export const getModel = (agent) =>{
    switch (agent) {
        case "chat":
            return groq
        case "search":
            return groq
        case "coding":
            return gemini    
        default:
            return groq;
    }
}
