import api from "../../utils/axios";

const logoutUser = async () => {
  try {
    const { data } = await api.get(
      "/auth/logout",
    );

  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

export default logoutUser;