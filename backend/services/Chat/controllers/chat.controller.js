import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const createConversation = async (req, res) => {
  try {
    let userId = req.headers["x-user-id"];
    console.log("UserId", userId);
    const conversation = await Conversation.create({
      userId: userId,
    });

    return res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getConversations = async (req, res) => {
  try {
    let userId = req.headers["x-user-id"];
    console.log("UserId", userId);
    const conversation = await Conversation.find({
      userId: userId,
    }).sort({
      updatedAt: -1,
    });

    return res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateConversation = async (req, res) => {
  try {
    const { id, title } = req.body;

    const conversation = await Conversation.findByIdAndUpdate(id, {
      title: title,
    });
    return res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const saveMessage = async (req, res) => {
  try {
    const { conversationId, role, content, images } = req.body;

    const message = await Message.create({
      conversationId,
      role,
      content,
      images
    });

    return res.status(200).json(message);
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {

    console.log("req.params.conversationId", req.params.conversationId);
    

    const messages = await Message.find({
      conversationId:req.params.conversationId,
    }).sort({
      createdAt: 1,
    });


    console.log("messages", messages);
    

    

    return res.status(200).json(messages);
  } catch (error) {
    console.log("error", error)

    res.status(500).json({ message: "Internal server error" });
  }
};
