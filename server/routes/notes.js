import express from 'express';
import { getNotes } from '../controllers/notes';

const router = express.Router();

router.get('/', getNotes);

