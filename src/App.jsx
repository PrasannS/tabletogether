import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

import WeeklyMenu from './pages/menuPage';
import PantryPage from './pages/pantryPage';
import RecipeDatabase from './pages/recipeDatabase';
import RecipeViewerPage from './pages/recipeViewerPage';
import NotesApp from './pages/firebasePage';

function App() {
  const [count, setCount] = useState(0); // 👈 you can use this anywhere

  return (
    <>
      {/* Page Routing */}
      <Routes>
        <Route path="/" element={<WeeklyMenu />} />
        <Route path="/pantry" element={<PantryPage />} />
        <Route path="/recipes" element={<RecipeDatabase />} />
        <Route path="/firebase" element={<NotesApp />} />
        <Route path="/viewer" element={<RecipeViewerPage />} />
      </Routes>
    </>
  );
}

export default App;