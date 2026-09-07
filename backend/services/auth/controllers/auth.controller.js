import {getAuth} from 'firebase-admin/auth';
import {app} from '../config/firebase.js';
import User from '../models/user.model.js';
import redis from '../../../shared/redis/redis.js';

export const login = async (req, res) => {
  try {
    const { token } = req.body; 
    const decodeToken = await getAuth(app).verifyIdToken(token);
    let user = await User.findOne({ firebaseId: decodeToken.uid });

    console.log("user", user)

    if(!user){
        user = await User.create({
            firebaseId: decodeToken.uid,   
            name: decodeToken.name,
            email: decodeToken.email,   
            avatar: decodeToken.picture
        })
    }
    
    
    //Create Session Cookie
    const expiresIn = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    const sessionId = crypto.randomUUID();
    redis.set(`session-${sessionId}`, JSON.stringify({
      userId: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar
    }), 'EX', expiresIn / 1000); // Store session in Redis with expiration


    res.cookie('session', sessionId, { maxAge: expiresIn, httpOnly: true, secure: false });


    return res.status(200).json({ message: "User Logged In", user: user });    

  }
  catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }

}

export const logout = async (req, res) => {
  try {
    const sessionId = req.cookies.session;  
    await redis.del(`session-${sessionId}`);
    res.clearCookie('session');
    return res.status(200).json({ message: "User Logged Out" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
