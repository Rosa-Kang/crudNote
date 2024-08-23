import express from 'express';
import { getNotes,addNote, editNote, deleteNote, updateIsPinned } from '../controllers/notes';
import { authenticateToken } from '../middleware/utilities';

const router = express.Router();

router.get('/', getNotes);
router.post('/add-note', authenticateToken, addNote);
router.put('/edit-note/:noteId', authenticateToken, editNote);
router.put('/update-note-pinned/:noteId', authenticateToken, updateIsPinned);
router.delete('/delete-note/:noteId', authenticateToken, deleteNote);

