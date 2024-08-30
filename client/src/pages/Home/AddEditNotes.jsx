import React, { useState } from 'react'
import TagInput from './TagInput'
import { MdClose } from 'react-icons/md';
import API from '../../api';

const AddEditNotes = ({ noteData, getAllNotes, type, onClose, showToastMessage }) => {
  const [title, setTitle] = useState( noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags ||[]);
  
  const [error, setError] = useState(null);

  // Add Note
  const addNewNote = async(e) => {
      try {
        const response = await API.post("/notes/add-note", {
          title,
          content,
          tags
        });

        if (response.status === 200 || response.status === 204) {
          getAllNotes();
          onClose();
          showToastMessage("Note added successfully!");
        }
      
      } catch (error) {
        if (error.response && error.response.data) {
          setError(error.response.data.message || 'An error occurred while editing the note.');
        } else {
          setError('An error occurred: ' + (error.message || 'Unknown error'));
        }
        console.error("Error editing note:", error);
      }
  }

  // Edit Note
  const editNote = async(e) => {
    const noteId = noteData._id
    try {
      const response = await API.put("/notes/edit-note/" + noteId, {
        title, 
        content,
        tags
      });

      // Fix to the modal close and update the new note
      if (response.status === 200 || response.status === 204) {
        getAllNotes();
        onClose();
        showToastMessage("Note updated successfully!");
      } else {
        setError("Failed to update the note.");
      }
      
    } catch (error) {
      if(error.message) {
        setError(error.message.data)
      }
    }
  }

  const handleAddNote =()=> {
    if(!title){
      setError("Please enter the title.");
      return;
    }

    if(!content){
      setError("Please enter the content.");
      return;
    }
    setError("");

    try {if(type === 'edit') {
      editNote();
    } else {
      addNewNote();
    }} catch(error) {
      console.error("Error handling note:", error);
    }
  }

  return (
    <div className='relative'>
      <button 
      className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50 hover:transition-all ease-in-out" 
      onClick={onClose}>
        <MdClose className='text-xl text-slate-400' />
      </button>

      <div className="flex flex-col gap-2">
        <label className="input-label">TITLE</label>
        <input 
          value={title}
          type="text" 
          className="text-2xl text-slate-950 outline-none" 
          placeholder='Go To Gym At 5'
          onChange={({target}) => setTitle(target.value)}
        />
      </div>
      
      <div className="flex flex-col gap2 mt-4">
        <label className="input-label">CONTENT</label>
        <textarea type="text" 
          className="text-sm text-slate-900 outline-none bg-slate-50 p-2 rounded" 
          placeholder='Content'
          rows={10}
          value={content}
          onChange={({target}) => setContent(target.value)}
        />
      </div>

      <div className="mt-3">
        <label className="input-label">TAGS</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>

      {error && <p className='text-red-500 text-xs pt-4'>{error}</p>}

      <button className="btn-primary font-medium mt-5 p-3" onClick={handleAddNote}>
        {type === 'edit' ? 'UPDATE' : 'ADD'}
      </button>
    </div>
  )
}

export default AddEditNotes