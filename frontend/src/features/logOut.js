import api from "../../utils/axios";

export const logoutUser = async () => {
  try {
    const response = await api.post("/auth/logout");

    console.log("Logout response:", response.status);

    return response.data;
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};