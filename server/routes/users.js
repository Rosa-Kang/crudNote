import express from 'express';
const router = express.Router();

import { signin, signup } from '';

router.post("/signup", signup)
router.post("/signin", signin);