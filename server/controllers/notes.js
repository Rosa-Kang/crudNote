import express from 'express';

import Note from '../models/Note.js';

const router = express.Router();

export const getNotes = async (req, res) => {
    try {
        const notes = await Note.find().sort({isPinned: -1});

        res.status(200).json(notes);
    } catch (error) {
        res.status(404).json({ message : error.message });
    }
}

export const addNote = async (req, res) => {
    const {title, content, tags, isPinned } = req.body;
    
    try {
        const newNote = new Note({
            title, 
            content,
            tags: tags || [],
            isPinned,
            userId:req.userId
        })
        await newNote.save();

        res.status(200).json(newNote);
    } catch (error) {
        res.status(404).json({ message : error.message });
    }
}

export const editNote = async (req, res) => {
    const userId = req.userId;
    const { noteId } = req.params;
    const { title, content, tags, isPinned } = req.body;


  try {
    const note = await Note.findOne({ _id: noteId, userId });

    if(!note) return res.status(404).json({ error: true, message: "Note not found."});

    if(title) note.title = title;
    if(content) note.content = content;
    if(tags) note.tags = tags;
    if(isPinned) note.isPinned = isPinned;

    await note.save();

  } catch (error) {
    return res.status(500).json('Internal Server Error')
  }
}

export const deleteNote = async(req, res) => {
    const noteId = req.params.noteId;
    const { user }= req.user;

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });

        if(!note) return res.status(404).json({ message: 'Note not found.'});

        await Note.deleteOne({ _id: noteId, userId: user._id });
        return res.json({message : 'Note deleted successfully.'});

    } catch (error) {
        return res.status(500).json('Internal Server Error');
    }
}

export const updateIsPinned = async(req, res)=> {
    const noteId = req.params.noteId;
    const { isPinned } = req.body;
    const { user } = req.user;

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id});

        if(!note) return res.status(400).json({message: "Note not found"});

        note.isPinned = isPinned;
        await note.save();
        
    } catch (error) {
        res.status(500).json({message: "Internal Server Error."})
    }
}
