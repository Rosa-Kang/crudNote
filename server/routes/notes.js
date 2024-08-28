import express from 'express';
import { getNotes,addNote, editNote, deleteNote, updateIsPinned } from '../controllers/notes.js';
import auth from '../middleware/utilities.js';

const router = express.Router();

router.get('/', getNotes);
router.post('/add-note', auth, addNote);
router.put('/edit-note/:noteId', auth, editNote);
router.put('/update-note-pinned/:noteId', auth, updateIsPinned);
router.delete('/delete-note/:noteId', auth, deleteNote);

export default router;