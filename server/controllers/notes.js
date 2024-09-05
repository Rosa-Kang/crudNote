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
    if (typeof isPinned !== 'undefined') note.isPinned = isPinned; // Handle boolean values

    await note.save();
    // Respond with the updated note data
    return res.status(200).json({ success: true, message: "Note updated successfully.", note });

  } catch (error) {
    return res.status(500).json('Internal Server Error')
  }
}

export const deleteNote = async(req, res) => {
    const userId = req.userId;
    const { noteId } = req.params;

    try {
        const note = await Note.findOne({ _id: noteId, userId: userId });

        if(!note) return res.status(404).json({ message: 'Note not found.'});

        await Note.deleteOne({ _id: noteId, userId: userId });
        return res.json({message : 'Note deleted successfully.'});

    } catch (error) {
        return res.status(500).json('Internal Server Error');
    }
}

export const searchNote = async(req, res) => {
    const { query } = req.query;

    if(!query) {
        return res
        .status(404)
        .json({ error: true, message: "Search query is required"});
    }

    try {
        const matchingNotes = await Note.find({
             title: { $regex: query, $options: "i" },
             content: { $regex: query, $options: "i" }
        });
        if(matchingNotes.length > 0) {
            return res.status(200).json({
                    error: false,
                    notes: matchingNotes,
                    message: "Notes matching the search query retrieved successfully."
                })
        } else {
            return res.send(matchingNotes)
        }
        

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error."
        })
    }
}

export const updateIsPinned = async(req, res)=> {
    const { isPinned } = req.body;
    const { noteId } = req.params;
    const userId = req.userId;

    try {
        const note = await Note.findOne({ _id: noteId, userId: userId });

        if(!note) return res.status(400).json({message: "Note not found"});

        note.isPinned = isPinned;
        await note.save();
        
    } catch (error) {
        res.status(500).json({message: "Internal Server Error."})
    }
}
