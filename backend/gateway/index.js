import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import proxy from "express-http-proxy";
import cors from "cors";
import cookieParser from "cookie-parser";
import { getUser } from "./controllers/user.controller.js";
import protect from "./middleware/auth.middleware.js";
import { proxyWithHeader } from "./utils/proxyWithHeaders.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));


const PORT = process.env.PORT || 8000;

app.use(morgan("dev"));
app.use(cookieParser());
app.use("/auth", proxy(process.env.AUTHSERVICE_URL));
app.use("/chat",protect, proxyWithHeader(process.env.CHATSERVICE_URL));
app.get("/getUser", protect, getUser)



app.get("/", (req, res) => {
  res.send("Gateway is running");
});

app.listen(PORT, () => {
  console.log(`Gateway is running on port ${PORT}`);
});