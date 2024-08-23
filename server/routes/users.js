import express from 'express';
const router = express.Router();

import {  signin, signup, getUser } from '../controllers/user';
import { authenticateToken } from '../middleware/utilities';

router.post("/signup", signup)
router.post("/signin", signin);
router.get("/get-user", authenticateToken ,getUser)