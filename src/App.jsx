import { useState, createContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import LoginPage from './pages/userLoginPage';
import WeeklyMenu from './pages/menuPage';
import PantryPage from './pages/pantryPage';
import RecipeDatabase from './pages/recipeDatabase';
import RecipeViewerPage from './pages/recipeViewerPage';
import NavBar from './pages/navBar';  
import EntryPage from './pages/recipeEntryPage';

// Create auth context to share authentication state
export const AuthContext = createContext();

function App() {
  const [count, setCount] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check if user is already logged in on app load
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  
  // Current user info
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Function to handle successful login
  const handleLoginSuccess = (user) => {
    console.log("Login success with user:", user);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', JSON.stringify(user));
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  // Function to handle logout
  const handleLogout = () => {
    console.log("Logging out");
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  // For debugging
  console.log("Auth state:", { isAuthenticated, currentUser });

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUser, logout: handleLogout }}>
      {isAuthenticated && <NavBar />}
      
      <div className="container mx-auto px-4 py-4">
        {/* Page Routing */}
        <Routes>
          {/* Login route */}
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
              <Navigate to="/" /> : 
              <LoginPage onLoginSuccess={handleLoginSuccess} />
            } 
          />

          {/* Protected routes */}
          <Route 
            path="/" 
            element={
              isAuthenticated ? 
              <WeeklyMenu /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/addrecipe" 
            element={
              isAuthenticated ? 
              <EntryPage /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/pantry" 
            element={
              isAuthenticated ? 
              <PantryPage /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/recipes" 
            element={
              isAuthenticated ? 
              <RecipeDatabase /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/viewer" 
            element={
              isAuthenticated ? 
              <RecipeViewerPage /> : 
              <Navigate to="/login" />
            } 
          />
          
          

          {/* Redirect any unknown routes to login */}
          <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
        </Routes>
      </div>
    </AuthContext.Provider>
  );
}

export default App;