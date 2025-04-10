import React, { useState } from 'react';
import { recipeParser } from '../../recipeParser';
import { useNavigate } from 'react-router-dom';


const EntryPage = () => {

	console.log("Recipe Entry Page Loaded");	
	const [recipeText, setRecipeText] = useState('');
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
<div className="bg-[#455932] text-white px-6 py-1 rounded-xl shadow-md text-center mb-6">
          <h1 className="text-3xl font-light">Recipe Parser</h1>
        </div>		 
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
			  className="bg-[#455932] text-white py-2 px-4 rounded-md hover:bg-blue-600"
			  
			>
			  Save
			</button>
		  </form>
		</div>
	);
};

export default EntryPage;