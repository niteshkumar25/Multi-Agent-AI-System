import axios from "axios"
import { graph } from "../graph/graph.js"
export const aget = async (req,res)=>{
    try {
        const {prompt, conversionId} = req.body
        await axios.post(`${process.env.CHATSERVICE_URL}/save-message`,{
            conversionId,
            role:"user",
            content:prompt
        })

        const result = await graph.invoke({
            prompt,conversionId

        })

        const response = result.aiResponse

        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({message:"internal error"})
    }
}