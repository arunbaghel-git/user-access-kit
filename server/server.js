import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
dotenv.config(); //  load environment variables from a .env file into the global process.env object
import connectDB from "./config/mongodb.js";
import {route} from './routes\/authRoute.js';
const port = process.env.PORT || 4700;
const app = express();
connectDB();
// middleware
app.use(
  cors({
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"], // limits the frontend to only these four specific HTTP actions
    origin: process.env.FRONTEND_URL, // only allows the frontend website at this exact URL to access API
    allowedHeaders: ["Content-type"], // specifies which metadata headers the frontend can send
  }),
);
app.use(express.json()); // parse incoming HTTP requests with JSON payloads and make that data easily available inside the req.body object
app.use(cookieParser()); // Reads cookies from incoming requests and populates 'req.cookies' with an object with key-value pairs of the client's cookies

//
app.get("/", (req, res) => {
  res.send("hii from server");
});
app.get('/api',route);
//
app.listen(port, () => {
  console.log(`server is running on https://www.localhost:${port}`);
});
