import express from 'express';
const router = express.Router();

import {  signin, signup, getUser } from '../controllers/user.js';
import { authenticateToken } from '../middleware/utilities.js';

router.post("/signup", signup)
router.post("/signin", signin);
router.get("/get-user", authenticateToken ,getUser);

export default router;