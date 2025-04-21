import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../App';

const NavBar = () => {
  const { currentUser, logout } = useContext(AuthContext);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#6d8d4f] text-white p-4 shadow-md">
    <div className="container mx-auto flex justify-between items-center text-center">
      <div className="flex space-x-2">
        <Link 
          to="/" 
          className="bg-[#4d693a] hover:bg-[#5f7d47] text-white py-2 px-4 rounded transition"
        >
          Menu
        </Link>
        <Link 
          to="/pantry" 
          className="bg-[#4d693a] hover:bg-[#5f7d47] text-white py-2 px-4 rounded transition"
        >
          Pantry
        </Link>
        <Link 
          to="/recipes" 
          className="bg-[#4d693a] hover:bg-[#5f7d47] text-white py-2 px-4 rounded transition"
        >
          Recipes
        </Link>
        <Link 
          to="/addrecipe" 
          className="bg-[#4d693a] hover:bg-[#5f7d47] text-white py-2 px-4 rounded transition"
        >
          Add
        </Link>
      </div>  
        
        <div className="flex items-center space-x-4">
          {currentUser && (
            <span className="text-sm">
              Welcome, {currentUser.username}
            </span>
          )}
          <button
            onClick={logout}
            className="bg-[#394929] text-white px-4 py-2 rounded-md transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;