import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar'
import NoteCard from '../../components/Cards/NoteCard';
import API from '../../api/index';

import { MdAdd } from 'react-icons/md'
import AddEditNotes from './AddEditNotes';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { Toast } from '../../components/ToastMessage/Toast';
import { EmptyCard } from '../../components/EmptyCard/EmptyCard';
import addNotesImg from '../../assets/create-note.png';
import noDataImg from '../../assets/no-data.png';

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null
  });

  const [toastMessage, setToastMessage] = useState({
    isShown: false,
    type: "add",
    message: ""
  });

  const [userInfo, setUserInfo] = useState(null);
  const [allNotes, setAllNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSearch, setIsSearch] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const navigate = useNavigate();

  const showToastMessage = (message, type) => {
    setToastMessage({ isShown: true, message: message, type: type})
  }

  const handleCloseToast = () => {
    setToastMessage({ isShown: false, message: ""})
  }

  const handleEdit= (noteDetails) => {
    if(userInfo && userInfo._id === noteDetails.userId) {
      setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit"})
    } else {
      showToastMessage("This note is not yours. Please login or try to edit your note.", 'warning')
    }
  }

// Delete Note
  const handleDelete = async(noteDetails) => {
    if(userInfo && userInfo._id === noteDetails.userId) {
      const noteId = noteDetails._id
      try {
        const response = await API.delete(`/notes/delete-note/${noteId}`);
  
        // Fix to the modal close and update the new note
        if (response.status === 200 || response.status === 204) {
          showToastMessage("Note Deleted Successfully!", 'delete')
          getAllNotes();
        }
        
      } catch (error) {
        if(error.message) {
          console.error("Fail to Delete:", error.response?.data || error.message)
        }
      }
    } else {
      showToastMessage("This note is not yours. Please login or try to delete your note.", 'warning')
    }
  }

// Get User Info
  const getUserInfo = async() => {
    try {
      const response = await API.get("/user/get-user");
      if(response.data?.user) {
        setUserInfo(response.data.user);
      } else {
        setUserInfo(null)
      }
    } catch (error) {
      if(error.response && error.response.status === 404) {
        localStorage.clear();
        navigate("/signin");
        console.error("Error fetching user data:", error.response?.data || error.message);
      }
    }
  }

// Get all notes
  const getAllNotes = async() => {
    try {
      setLoading(true)
      const response = await API.get("/notes/get-all-notes");
      if(response.data) {
        setAllNotes(response.data)
      }
    } catch (error) {
        console.log("An unexpected error occured. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Search for a note
  const onSearchNote = async (query) => {
    setIsSearch(true);
    try {
      const response = await API.get("/notes/search-notes", {
        params: { query },
      });

      if(response.data.length === 0) {
          setAllNotes([]);
        }
      else {
          setAllNotes(response.data.notes); 
        } 
      }
        catch (error) {
      console.log(error)
    }
  }

  // isPinned
  const updateIsPinned = async(noteData) => {
      const noteId = noteData._id;
      try {
        const response = await API.put(`/notes/update-note-pinned/${noteId}` + {
          "isPInned" : !noteId.isPinned,
        });

        if(response.data && response.data.note) {
          showToastMessage("Note Updated Successfully.");
          getAllNotes();
        }
      } catch (error) {
        console.log(error);
        
      }
  }

  const handleClearSearch = () => {
      getAllNotes();
  }

  useEffect(() => {
    getUserInfo();
    getAllNotes();
    handleClearSearch();
  
    return () => {
      
    }
  }, [])
  

  const handleAddButtonClick =() => {
    if(userInfo) {
      setOpenAddEditModal({
        isShown: true, type: "add", data: null
      })
    } else {
      showToastMessage("Please log in to add a note.", 'warning')
    }
  }

  return (
    <>
     <Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClearSearch} />

     <div className="container mx-auto">
     {loading ? (
          <p>Loading...</p> 
        ) : 
      allNotes.length > 0 ? (
        <div className="grid grid-cols-3 gap-4 my-8 mx-6">
          {allNotes.map((item, index) => (
            <NoteCard 
            key={item._id}
            title = {item.title}
            date = {item.createdAt}
            content = {item.content}
            tags = {item.tags}
            isPinned ={isPinned}
            onEdit ={()=> handleEdit(item)} 
            onDelete ={()=> handleDelete(item)}
            onPinNote ={()=> updateIsPinned(item)}
          />
          ))}
        </div>
      ) : (
        <button onClick={handleAddButtonClick} className='flex items-center justify-center w-full'>
          <EmptyCard imgSrc={isSearch ? noDataImg : addNotesImg} message={isSearch? `Oops! No notes found marching your search.` : `Start creating your first noet! Click 'Add' button to jot down your thoughts, ideas, and reminders. Let's get started!`} />
        </button>
      )}

        <button 
          className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10"
          onClick={handleAddButtonClick}
        >
          <MdAdd className="text-[32px] text-white" />
        </button>

      <Modal
        ariaHideApp={false}
        isOpen={openAddEditModal.isShown}
        onRequestClose={()=> {}}
        style={{
          overlay: {
            backgroundColor:"rgba(0,0,0,0.2)",
          },
        }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll "
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => setOpenAddEditModal({ isShown: false, type: "add", data: null})} 
          getAllNotes={getAllNotes}
          showToastMessage= {showToastMessage}
         />
      </Modal>

      <Toast 
        isShown = {toastMessage.isShown}
        message = {toastMessage.message}
        type = {toastMessage.type}
        onClose ={ handleCloseToast }
      />

     </div>
    </>
  )
}

export default Home 