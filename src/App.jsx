import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import WeeklyMenuPage from './pages/menuPage'
import RecipeSearch from './pages/recipeDatabase'
import recipeViewerPage from './pages/recipeViewerPage'
import NotesApp from './pages/firebasePage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <NotesApp />
    </>
  )
}

export default App 
