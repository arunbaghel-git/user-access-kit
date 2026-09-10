import express from 'express';
import { registerUser,loginUser, logoutUser } from "../controllers/authController.js";

export const route = express.Router();

route.post('/register',registerUser);
route.post('/login',loginUser);
route.post('/logout',logoutUser);