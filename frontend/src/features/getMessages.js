import api from "../../utils/axios";

const getMessages = async (conversationId) => {
  try {
    const { data } = await api.get(
      `/chat/get-messages/${conversationId}`
    );

    return data;
  } catch (error) {
    console.error(
      "Error fetching messages:",
      error
    );

    throw error;
  }
};

export default getMessages;