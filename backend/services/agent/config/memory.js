import axios from "axios"
import radis from "../../../shared/redis/redis.js"



export const getMemory = async (conversationId)=>{
    
    //Get All Messages
    let {data} = await axios.get(`${process.env.CHATSERVICE_URL}/get-messages/${conversationId}`)

    let key = `messages-${conversationId}`
    const cached = await radis.get(key);
    if(cached){
        return JSON.parse(cached)
    }

    await radis.set(key, JSON.stringify(data), "EX", 24*60*60)

    return data

}


export const addMessage = async (conversationId, role, content)=>{
    let key = `messages-${conversationId}`;
     const rawMessages = await radis.get(key);
     const messages = rawMessages ? JSON.parse(rawMessages) : []
     messages.push({
        role, 
        content
     })

     if(messages.length > 20){
        messages.shift()
     }

     await radis.set(key,JSON.stringify(messages))
}
