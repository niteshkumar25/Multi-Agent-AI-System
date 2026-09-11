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

export const getConversation = async (req, res) => {
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
    const { conversationId, role, content } = req.body;

    const message = await Message.create({
      conversationId,
      role,
      content,
    });

    return res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId:req.parmas.conversationId,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
