import React, { useState } from 'react'
import ProfileInfo from '../Cards/ProfileInfo'
import { Link, useNavigate } from 'react-router-dom'
import SearchBar from '../SearchBar/SearchBar';

const Navbar = ({userInfo, onSearchNote, handleClearSearch}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear()
    navigate("/signin")
  }

  const handleSearch = () => {
    if(searchQuery) {
      onSearchNote(searchQuery);
    }
  }

  const onClearSearch = () => {
      setSearchQuery("");
      handleClearSearch();
  }

  return (
    <div className='bg-white flex items-center justify-between px-6 py-2 drop-shadow'>
      <Link to="/">
        <h2 className="text-xl font-medium text-black py-2">Notes</h2>
      </Link>

        <SearchBar 
          value={searchQuery}
          onChange={({ target }) => { setSearchQuery(target.value) }}
          handleSearch={handleSearch}
          onClearSearch={onClearSearch}
         />

        <ProfileInfo userInfo={userInfo} onLogout ={onLogout}/>
    </div>
  )
}

export default Navbar