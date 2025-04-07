import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../App';

const NavBar = () => {
  const { currentUser, logout } = useContext(AuthContext);

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          <Link to="/" className="font-bold text-xl">Recipe Planner</Link>
          <Link to="/" className="hover:text-blue-200">Menu</Link>
          <Link to="/pantryPage" className="hover:text-blue-200">Pantry</Link>
          <Link to="/recipes" className="hover:text-blue-200">Recipes</Link>
          <Link to="/viewer" className="hover:text-blue-200">Recipe Viewer</Link>
          <Link to="/addrecipe" className="hover:text-blue-200">Add</Link>
        </div>
        
        <div className="flex items-center space-x-4">
          {currentUser && (
            <span className="text-sm">
              Welcome, {currentUser.username}
            </span>
          )}
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;