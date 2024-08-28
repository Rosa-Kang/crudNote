import express from 'express';
const router = express.Router();

import {  signin, signup, getUser } from '../controllers/user.js';
import auth from '../middleware/utilities.js';

router.post("/signin", signin);
router.post("/signup", signup);
router.get("/get-user", auth ,getUser);

export default router;