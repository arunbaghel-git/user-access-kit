import express from 'express';
import { registerUser } from "../controllers/authController";

export const route = express.Router();

route.post('/register',registerUser);