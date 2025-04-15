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
	  
	  if (!recipeText.trim()) return;
	  
	  // send back parsed recipe
	  const parsed = recipeParser(recipeText);
	  console.log("Parsed recipe:", parsed);
	  
	  setParsedRecipe(parsed);
	  navigate("/viewer", { state: { recipe: parsed } });
	};
  
	return (
	  <div className="container mx-auto p-4 max-w-2xl">
		<h1 className="text-2xl font-bold mb-4">Recipe Parser</h1>
		  <form onSubmit={handleSubmit}>
			<div className="mb-4">
			  <textarea
				className="w-full p-4 border border-gray-300 rounded-md min-h-64"
				value={recipeText}
				onChange={(e) => setRecipeText(e.target.value)}
				placeholder="Paste your recipe here..."
			  />
			</div>
			<button
			  type="submit"
			  className="bg-blue-500 text-black py-2 px-4 rounded-md hover:bg-blue-600"
			>
			  Save
			</button>
		  </form>
		</div>
	);
};

export default EntryPage;