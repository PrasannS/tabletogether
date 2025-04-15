import React, { useState } from 'react';
import { recipeParser } from '../../recipeParser';
import { useNavigate } from 'react-router-dom';

const EntryPage = () => {
  console.log("Recipe Entry Page Loaded");
  const [viewMode, setViewMode] = useState('paste'); // 'paste' or 'structured'
  
  // Fields for paste view
  const [recipeText, setRecipeText] = useState('');
  
  // Fields for structured view
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  
  const [parsedRecipe, setParsedRecipe] = useState(null);
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    let recipe;
    
    if (viewMode === 'paste') {
      // Use parser for the paste view
      if (!recipeText.trim()) return;
      recipe = recipeParser(recipeText);
    } else {
      // For structured view, create recipe object directly
      if (!title.trim() || !ingredients.trim() || !instructions.trim()) return;
      
      recipe = {
        title: title,
        ingredients: ingredients.split('\n').filter(item => item.trim() !== ''),
        instructions: instructions.split('\n').filter(item => item.trim() !== ''),
		additionalSections: ""
      };
    }
    
    console.log("Recipe data:", recipe);
    setParsedRecipe(recipe);
    navigate("/viewer", { state: { recipe: recipe } });
  };

  // Toggle between view modes
  const toggleViewMode = () => {
    setViewMode(viewMode === 'paste' ? 'structured' : 'paste');
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Add Recipe</h1>
        
        <div className="flex items-center">
          <span className={`mr-2 ${viewMode === 'paste' ? 'font-bold' : ''}`}></span>
          <div 
            className="relative inline-block w-12 h-6 cursor-pointer"
            onClick={toggleViewMode}
          >
            <div className={`w-12 h-6 rounded-full transition-colors duration-300 ${viewMode === 'paste' ? 'bg-gray-300' : 'bg-blue-500'}`}>
              <div 
                className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow transition-transform duration-300 ${viewMode === 'structured' ? 'transform translate-x-6' : ''}`}
              />
            </div>
          </div>
          <span className={`ml-2 ${viewMode === 'structured' ? 'font-bold' : ''}`}></span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        {viewMode === 'paste' ? (
          // Paste view
          <div className="mb-4">
            <textarea
              className="w-full p-4 border border-gray-300 rounded-md min-h-64"
              value={recipeText}
              onChange={(e) => setRecipeText(e.target.value)}
              placeholder="Paste your recipe here..."
            />
          </div>
        ) : (
          // Structured view
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Recipe Title</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-md"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter recipe title"
              />
            </div>
            
            <div>
              <label className="block mb-1 font-medium">Ingredients</label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-md min-h-32"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="Enter ingredients (one per line)"
              />
            </div>
            
            <div>
              <label className="block mb-1 font-medium">Instructions</label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-md min-h-32"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Enter instructions (one step per line)"
              />
            </div>
          </div>
        )}
        
        <button
          type="submit"
          className="bg-blue-500 text-black py-2 px-4 rounded-md hover:bg-blue-600 mt-4"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default EntryPage;