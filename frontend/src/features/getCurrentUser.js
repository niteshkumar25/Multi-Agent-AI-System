import api from "../../utils/axios";

  const getCurrentUser = async () => { 
    try {
        const {data} = await api.get("/getUser");

        console.log("Current user data:", data);

        return data;
    }
    catch (error) {
        console.error("Error fetching current user:", error);
        throw error;
    }

}

export default getCurrentUser;