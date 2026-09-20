import axios from "axios"
import { graph } from "../graph/graph.js"
export const agent = async (req,res)=>{
    try {
        const {prompt, conversationId} = req.body

        console.log("prompt, conversationId", prompt, conversationId);
        
      
      
        await axios.post(`${process.env.CHATSERVICE_URL}/save-message`,{
            conversationId,
            role:"user",
            content:prompt
        })

        const result = await graph.invoke({
            prompt,conversationId

        })

        const response = result.aiResponse

        console.log("response, response", response)
        // const response = "hello world"

        await axios.post(`${process.env.CHATSERVICE_URL}/save-message`,{
            conversationId,
            role:"assistant",
            content:response
        })


        return res.status(200).json(response)

    } catch (error) {
        console.log(error);
        
        return res.status(500).json({message:"internal error"})
    }
}