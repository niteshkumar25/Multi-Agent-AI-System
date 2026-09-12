import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { router } from "./graph/router.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
app.use(express.json());


app.use("/", router)

app.get("/", (req, res) => {
  res.send("Agent Server is running");
});


app.listen(PORT, () => {
  console.log(`Agent Server is running on port ${PORT}`);
  connectDB();
});