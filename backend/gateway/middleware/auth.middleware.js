import redis from '../../shared/redis/redis.js';

const protect = async (req, res, next) => {
  try {
    const sessionId = req.cookies?.session;
    if (!sessionId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const session = await redis.get(`session-${sessionId}`, (err, sessionData) => {
      if (err) {
        console.error("Redis error:", err);
        return res.status(500).json({ message: "Internal server error" });
      } 
    });

    if(!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = JSON.parse(session);
    next();

}
catch (error) { 
    res.status(500).json({ message: "Internal server error" });
}
}

export default protect;