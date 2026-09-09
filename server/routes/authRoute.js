import express from 'express';
import { registerUser,loginUser } from "../controllers/authController.js";

export const route = express.Router();

route.post('/register',registerUser);
route.get('/login',loginUser);