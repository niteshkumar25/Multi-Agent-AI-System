import api from "../../utils/axios";

const updateConversation = async (
  conversationId,
  title
) => {
  try {
    const { data } = await api.put(
      `/chat/update-conversation`,
      {
        id:conversationId,
        title:title,
      }
    );

    return data;

  } catch (error) {
    console.error(
      "Error updating conversation:",
      error
    );

    throw error;
  }
};

export default updateConversation;