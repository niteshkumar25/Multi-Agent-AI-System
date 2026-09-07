import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
// import authRouter from "./routes/auth.route.js";
import authRouter from "./routes/auth.route.js";    

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
app.use(express.json());



app.use("/", authRouter);


app.get("/", (req, res) => {
  res.send("Auth Server is running");
});

app.listen(PORT, () => {
  console.log(`AUth Server is running on port ${PORT}`);
  connectDB();
});