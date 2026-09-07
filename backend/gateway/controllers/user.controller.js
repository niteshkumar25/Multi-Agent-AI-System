export const getUser = async (req, res) => {
  try {
    const user = req.user;  
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Retrieved user:", user);
     res.status(200).json(user);
}
catch (error) {     
    console.error("Get user error:", error);
    res.status(500).json({ message: "Internal server error" });
}
}       
