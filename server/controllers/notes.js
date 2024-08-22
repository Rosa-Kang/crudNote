import express from 'express';
import mongoose from 'mongoose';

import Note from '../models/Note';

const router = express.Router();

export const getNotes = async (req, res) => {
    try {
        const notes = await Note.find();

        res.status(200).json(notes);
    } catch (error) {
        res.status(404).json({ message : error.message });
    }
}

export const addNote = async (req, res) => {
    const {title, content, tags, isPinned, userId } = req.body;
    
    try {
        const newNote = new Note({
            title, 
            content,
            tags: tags || [],
            isPinned,
            userId:user._id
        })
        await newNote.save();

        res.status(200).json(newNote);
    } catch (error) {
        res.status(404).json({ message : error.message });
    }
}

