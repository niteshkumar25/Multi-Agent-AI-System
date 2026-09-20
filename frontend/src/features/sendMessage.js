import api from "../../utils/axios";

const sendMessage = async (payload) => {
  try {
    const { data } = await api.post(
      "/agent/chat",
      payload
    );


    console.log("data", data);
    

    return data;
  } catch (error) {
    console.error(
      "Error sending message:",
      error
    );

    throw error;
  }
};

export default sendMessage;