import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import router from "./routes/chat.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
app.use(express.json());


app.use('/', router);


app.get("/", (req, res) => {
  res.send("Chat Server is running");
});

app.listen(PORT, () => {
  console.log(`Chat Server is running on port ${PORT}`);
  connectDB();
});